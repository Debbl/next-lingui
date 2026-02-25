const NEXT_LINGUI_MACRO_PACKAGE = 'next-lingui/react/macro';

const REQUIRED_CORE_MACRO_PACKAGES = [
  '@lingui/macro',
  '@lingui/core/macro',
  NEXT_LINGUI_MACRO_PACKAGE
];

const REQUIRED_JSX_MACRO_PACKAGES = [
  '@lingui/macro',
  '@lingui/react/macro',
  NEXT_LINGUI_MACRO_PACKAGE
];

type MacroConfig = {
  macro?: {
    corePackage?: Array<string>;
    jsxPackage?: Array<string>;
  };
};

function mergeUniquePackages(current: Array<string> | undefined, required: Array<string>) {
  const merged = [...(current ?? [])];

  for (const packageName of required) {
    if (!merged.includes(packageName)) {
      merged.push(packageName);
    }
  }

  return merged;
}

export default function withNextLinguiMacroConfig<T extends MacroConfig>(
  config: T
): T {
  return {
    ...config,
    macro: {
      ...config.macro,
      corePackage: mergeUniquePackages(
        config.macro?.corePackage,
        REQUIRED_CORE_MACRO_PACKAGES
      ),
      jsxPackage: mergeUniquePackages(
        config.macro?.jsxPackage,
        REQUIRED_JSX_MACRO_PACKAGES
      )
    }
  } as T;
}
