export type PluginConfig = {
  /** Optional custom path to request config module for `next-lingui/config` aliasing. */
  requestConfig?: string;

  /** Optional custom path to `lingui.config.*`; validated by the plugin. */
  linguiConfigPath?: string;

/**
   * A path to the messages file that you'd like to create a declaration for.
   * In case you want to consider multiple files, you can pass an array of paths.
   */
  createMessagesDeclaration?: string | Array<string>;

  /**
   * Legacy config was removed.
   * Keep the shape as `unknown` so users get a focused migration error.
   */
  experimental?: unknown;
};
