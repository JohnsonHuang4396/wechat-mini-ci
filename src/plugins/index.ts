import type { TMixProjectInlineConfig, Plugin } from '@/types'
import { printQRcode } from './build-in'
import type { ActionsEnum } from '@/commands/actions'
import { logger } from '@/utils'

const buildInPlugins = [
  printQRcode
]

export function resolvePlugins(config: TMixProjectInlineConfig) {
  const { plugins = [] } = config

  const prev: Plugin[] = []
  const post: Plugin[] = []

  for (const plugin of [...buildInPlugins, ...plugins]) {
    const { state } = plugin
    if (state === 'post') {
      post.push(plugin)
      continue
    }
    if (state === 'prev') {
      prev.push(plugin)
    }
    continue
  }
  return { prev, post }
}

export async function invokePluginsFn(plugins: Plugin[], config: TMixProjectInlineConfig, action: ActionsEnum) {
  for (const plugin of plugins) {
    logger.info(`执行插件: ${plugin.name}`)
    await plugin.fn({ action, config })
  }
}
