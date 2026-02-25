#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

async function loadLinguiApi() {
  try {
    const [{createCompiledCatalog, getCatalogs}, {getConfig}] = await Promise.all([
      import('@lingui/cli/api'),
      import('@lingui/conf')
    ]);
    return {createCompiledCatalog, getCatalogs, getConfig};
  } catch (error) {
    throw new Error(
      `Missing Lingui runtime dependencies. Ensure dependencies are installed and try again. Original error: ${error.message || String(error)}`
    );
  }
}

const NEXT_LINGUI_MACRO_PACKAGE = 'next-lingui/react/macro';

function mergeUniquePackages(current, required) {
  const merged = [...(current ?? [])];
  for (const packageName of required) {
    if (!merged.includes(packageName)) {
      merged.push(packageName);
    }
  }
  return merged;
}

function withNextLinguiMacroConfig(config) {
  return {
    ...config,
    macro: {
      ...config.macro,
      corePackage: mergeUniquePackages(config.macro?.corePackage, [
        '@lingui/macro',
        '@lingui/core/macro',
        NEXT_LINGUI_MACRO_PACKAGE
      ]),
      jsxPackage: mergeUniquePackages(config.macro?.jsxPackage, [
        '@lingui/macro',
        '@lingui/react/macro',
        NEXT_LINGUI_MACRO_PACKAGE
      ])
    }
  };
}

function printUsage() {
  console.log(`next-lingui <command> [options]

Commands:
  extract                 Extract messages using lingui.config
  compile                 Compile catalogs using lingui.config

Global options:
  --config <path>         Path to lingui.config file
  --cwd <path>            Working directory
  -h, --help              Show help

Extract options:
  --clean                 Remove obsolete messages
  --overwrite             Overwrite existing translations
  --locale <locale>       Restrict to locale (repeatable)

Compile options:
  --strict                Fail on missing translations and compile errors
  --namespace <name>      Compiled namespace (default from lingui config)
  --typescript            Force TypeScript output namespace
  --locale <locale>       Restrict to locale (repeatable)
`);
}

function createTableBorder(left, middle, right, columnWidths) {
  const segments = columnWidths.map((width) => '─'.repeat(width + 2));
  return `${left}${segments.join(middle)}${right}`;
}

function createTableRow(values, columnWidths) {
  const cells = values.map((value, index) => {
    const content = String(value);
    const padding = ' '.repeat(columnWidths[index] - content.length);
    return ` ${content}${padding} `;
  });

  return `│${cells.join('│')}│`;
}

function printCatalogStatistics(catalogPath, rows) {
  const headers = ['Language', 'Total count', 'Missing'];
  const columnWidths = headers.map((header, index) => {
    const maxRowWidth = rows.reduce((max, row) => {
      return Math.max(max, String(row[index]).length);
    }, 0);
    return Math.max(header.length, maxRowWidth);
  });

  console.log(`Catalog statistics for ${catalogPath}: `);
  console.log(createTableBorder('┌', '┬', '┐', columnWidths));
  console.log(createTableRow(headers, columnWidths));
  console.log(createTableBorder('├', '┼', '┤', columnWidths));
  rows.forEach((row) => {
    console.log(createTableRow(row, columnWidths));
  });
  console.log(createTableBorder('└', '┴', '┘', columnWidths));
}

function toDisplayPath(rootDir, targetPath) {
  const relativePath = path.relative(rootDir, targetPath);
  if (!relativePath || relativePath === '') {
    return targetPath;
  }
  return relativePath.split(path.sep).join('/');
}

function replaceLocalePlaceholder(inputPath, locale) {
  return inputPath.replaceAll('{locale}', locale);
}

function getOutputExtension(namespace) {
  switch (namespace) {
    case 'es':
      return 'mjs';
    case 'ts':
    case 'json':
      return namespace;
    default:
      return 'js';
  }
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    command: undefined,
    help: false,
    config: undefined,
    cwd: undefined,
    clean: false,
    overwrite: false,
    strict: false,
    namespace: undefined,
    typescript: false,
    locales: []
  };

  if (args.length === 0) {
    parsed.help = true;
    return parsed;
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (
      !parsed.command &&
      !arg.startsWith('-') &&
      arg !== 'extract' &&
      arg !== 'compile'
    ) {
      throw new Error(`Unknown command: ${arg}`);
    } else if (!parsed.command && (arg === 'extract' || arg === 'compile')) {
      parsed.command = arg;
    } else if (arg === '-h' || arg === '--help') {
      parsed.help = true;
    } else if (arg === '--clean') {
      parsed.clean = true;
    } else if (arg === '--overwrite') {
      parsed.overwrite = true;
    } else if (arg === '--strict') {
      parsed.strict = true;
    } else if (arg === '--typescript') {
      parsed.typescript = true;
    } else if (arg === '--config') {
      const value = args[i + 1];
      if (!value) throw new Error('Missing value for --config');
      parsed.config = value;
      i += 1;
    } else if (arg === '--cwd') {
      const value = args[i + 1];
      if (!value) throw new Error('Missing value for --cwd');
      parsed.cwd = value;
      i += 1;
    } else if (arg === '--namespace') {
      const value = args[i + 1];
      if (!value) throw new Error('Missing value for --namespace');
      parsed.namespace = value;
      i += 1;
    } else if (arg === '--locale') {
      const value = args[i + 1];
      if (!value) throw new Error('Missing value for --locale');
      parsed.locales.push(value);
      i += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

async function runExtract(config, options, api) {
  const {getCatalogs} = api;
  const startTime = Date.now();
  const catalogs = await getCatalogs(config);
  const locales = options.locales.length > 0 ? options.locales : [...config.locales];
  const catalogStatistics = [];

  await Promise.all(
    catalogs.map(async (catalog) => {
      await catalog.make({
        files: undefined,
        clean: options.clean,
        overwrite: options.overwrite,
        locale: locales,
        orderBy: config.orderBy
      });

      const rows = [];
      for (const locale of locales) {
        const {messages, missing} = await catalog.getTranslations(locale, {
          fallbackLocales: config.fallbackLocales,
          sourceLocale: config.sourceLocale
        });

        rows.push([
          locale === config.sourceLocale ? `${locale} (source)` : locale,
          Object.keys(messages).length,
          locale === config.sourceLocale ? '-' : missing.length
        ]);
      }

      catalogStatistics.push({
        path: toDisplayPath(config.rootDir, catalog.path),
        rows
      });
    })
  );

  const elapsedMs = Date.now() - startTime;
  console.log(`✔ Done in ${elapsedMs}ms`);

  for (const stats of catalogStatistics) {
    printCatalogStatistics(stats.path, stats.rows);
  }

  console.log('');
  console.log('(Use "npm run extract" to update catalogs with new messages.)');
  console.log(
    '(Use "npm run compile" to compile catalogs for production. Alternatively, use bundler plugins: https://lingui.dev/ref/cli#compiling-catalogs-in-ci)'
  );
}

function buildMissingTranslationsMessage(locale, missingMessages) {
  const lines = missingMessages.map((missing) => {
    const source =
      missing.source || missing.source === missing.id ? `: ${missing.source}` : '';
    return `${missing.id}${source}`;
  });
  return `Failed to compile locale "${locale}" because ${missingMessages.length} translation(s) are missing:\n${lines.join('\n')}`;
}

function buildCompileErrorsMessage(locale, errors) {
  const details = errors
    .map((error) => `${error.id}: ${error.error.message}`)
    .join('\n');
  return `Failed to compile locale "${locale}" because ${errors.length} message(s) failed to compile:\n${details}`;
}

async function writeCompiledCatalog(outputPathWithoutExt, source, namespace) {
  const ext = getOutputExtension(namespace);
  const outputPath = `${outputPathWithoutExt}.${ext}`;
  await fs.mkdir(path.dirname(outputPath), {recursive: true});
  await fs.writeFile(outputPath, source, 'utf8');
  return outputPath;
}

async function runCompile(config, options, api) {
  const {createCompiledCatalog, getCatalogs} = api;
  const catalogs = await getCatalogs(config);
  const locales = options.locales.length > 0 ? options.locales : [...config.locales];
  const namespace = options.typescript
    ? 'ts'
    : options.namespace || config.compileNamespace;
  const doMerge = Boolean(config.catalogsMergePath);
  let outputCount = 0;

  for (const locale of locales) {
    let mergedMessages = {};

    for (const catalog of catalogs) {
      const {messages, missing} = await catalog.getTranslations(locale, {
        fallbackLocales: config.fallbackLocales,
        sourceLocale: config.sourceLocale
      });

      if (options.strict && locale !== config.pseudoLocale && missing.length > 0) {
        throw new Error(buildMissingTranslationsMessage(locale, missing));
      }

      if (doMerge) {
        mergedMessages = {
          ...mergedMessages,
          ...messages
        };
        continue;
      }

      const {source, errors} = createCompiledCatalog(locale, messages, {
        strict: false,
        namespace,
        pseudoLocale: config.pseudoLocale,
        compilerBabelOptions: config.compilerBabelOptions
      });

      if (errors.length > 0 && options.strict) {
        throw new Error(buildCompileErrorsMessage(locale, errors));
      }

      const outputPath = await writeCompiledCatalog(
        replaceLocalePlaceholder(catalog.path, locale),
        source,
        namespace
      );
      outputCount += 1;
      console.log(`Compiled: ${path.relative(config.rootDir, outputPath)}`);
    }

    if (doMerge) {
      const {source, errors} = createCompiledCatalog(locale, mergedMessages, {
        strict: false,
        namespace,
        pseudoLocale: config.pseudoLocale,
        compilerBabelOptions: config.compilerBabelOptions
      });

      if (errors.length > 0 && options.strict) {
        throw new Error(buildCompileErrorsMessage(locale, errors));
      }

      const mergedBasePath = replaceLocalePlaceholder(config.catalogsMergePath, locale);
      const outputPath = await writeCompiledCatalog(mergedBasePath, source, namespace);
      outputCount += 1;
      console.log(`Compiled: ${path.relative(config.rootDir, outputPath)}`);
    }
  }

  console.log(`Compile completed: ${outputCount} file(s) written.`);
}

async function main() {
  const options = parseArgs(process.argv);

  if (options.help || !options.command) {
    printUsage();
    return;
  }

  if (options.command !== 'extract' && options.command !== 'compile') {
    throw new Error(`Unknown command: ${options.command}`);
  }

  const api = await loadLinguiApi();
  const cwd = options.cwd ? path.resolve(process.cwd(), options.cwd) : process.cwd();
  const config = withNextLinguiMacroConfig(
    api.getConfig({
      cwd,
      configPath: options.config
    })
  );

  if (options.command === 'extract') {
    await runExtract(config, options, api);
    return;
  }

  await runCompile(config, options, api);
}

main().catch((error) => {
  console.error(`[next-lingui] ${error.message || String(error)}`);
  process.exit(1);
});
