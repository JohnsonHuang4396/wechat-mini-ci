import type { ActionsEnum } from '@/commands/actions'
import type { TMixProjectInlineConfig } from './config'

export type PluginAction = 'prev' | 'post'

export type PluginFn = (params: {
  action: ActionsEnum
  config: TMixProjectInlineConfig
}) => (Promise<void> | void)

export interface Plugin {
  name: string
  state: PluginAction
  fn: PluginFn
}
