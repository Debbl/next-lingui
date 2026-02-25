import {getCatalogs} from '@lingui/cli/api';
import {
  getConfig,
  type LinguiConfigNormalized,
  type OrderBy
} from '@lingui/conf';
import withNextLinguiMacroConfig from './withNextLinguiMacroConfig.js';

export type ExtractMessagesOptions = {
  /** Working directory used to resolve Lingui config and catalog globs. */
  cwd?: string;

  /** Optional explicit Lingui config path (e.g. `./lingui.config.ts`). */
  linguiConfigPath?: string;

  /** Optional source file subset to extract from. */
  files?: Array<string>;

  /** Remove obsolete messages while extracting. Defaults to `false`. */
  clean?: boolean;

  /** Overwrite existing translations. Defaults to `false`. */
  overwrite?: boolean;

  /** Restrict extraction to these locales. Defaults to all configured locales. */
  locales?: Array<string>;

  /** Optional catalog ordering strategy. */
  orderBy?: OrderBy;
};

export type ExtractMessagesResult = {
  config: LinguiConfigNormalized;
  catalogCount: number;
  updatedCatalogCount: number;
};

export async function unstable_extractMessages(
  options: ExtractMessagesOptions = {}
): Promise<ExtractMessagesResult> {
  const config = withNextLinguiMacroConfig(
    getConfig({
      cwd: options.cwd,
      configPath: options.linguiConfigPath
    })
  );

  const catalogs = await getCatalogs(config);
  let updatedCatalogCount = 0;

  await Promise.all(
    catalogs.map(async (catalog) => {
      const catalogResult = await catalog.make({
        files: options.files,
        clean: options.clean ?? false,
        overwrite: options.overwrite ?? false,
        locale: options.locales ?? [...config.locales],
        orderBy: options.orderBy ?? config.orderBy
      });

      if (catalogResult !== false) {
        updatedCatalogCount += 1;
      }
    })
  );

  return {
    config,
    catalogCount: catalogs.length,
    updatedCatalogCount
  };
}

export const extractMessages = unstable_extractMessages;
