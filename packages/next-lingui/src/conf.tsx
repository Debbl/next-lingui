import {type LinguiConfig,defineConfig as linguiDefineConfig} from '@lingui/conf';
import withNextLinguiMacroConfig from './extractor/withNextLinguiMacroConfig.js';

export function defineConfig(config: LinguiConfig): LinguiConfig {
  return linguiDefineConfig(withNextLinguiMacroConfig(config));
}

export type {LinguiConfig} from '@lingui/conf';
