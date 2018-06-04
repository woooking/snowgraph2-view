import { PluginConfig } from './PluginConfig';

export interface SnowGraph {
  name: string;
  dataDir: string;
  destination: string;
  pluginConfigs: PluginConfig[];
}