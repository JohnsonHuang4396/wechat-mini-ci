import type { InlineConfig } from '@/types'
import { logger, resolveConfig } from '@/utils'
import chalk from 'chalk'
import { Project } from '@/ci'
import { exit } from 'node:process'

export enum ActionsEnum {
  preview = 'preview',
  upload = 'upload'
}

export enum ActionTitlesEnum {
  preview = '预览',
  upload = '上传'
}

export interface ActionsParams {
  action?: ActionsEnum
  title?: ActionTitlesEnum
}

export function actions({
  action = ActionsEnum.upload,
  title = ActionTitlesEnum.upload
}: ActionsParams = {}) {
  return async (root: string, inlineConfig: InlineConfig = {}) => {
    try {
      const resolvedConfig = await resolveConfig({ root, ...inlineConfig })
      if (!resolvedConfig || !resolvedConfig.length)
        return

      const instanceList: Project[] = []
      for (const config of resolvedConfig) {
        if (!inlineConfig.dry) {
          try {
            const instance = new Project(config)
            await instance[action]()
            instanceList.push(instance)
            logger.success(`小程序 ${instance.options?.appid ?? ''} ${chalk.green(`[${title}]`)} 成功`)
          }
          catch (e) {
            logger.error(`小程序 ${config.appid ?? ''} ${chalk.red(`[${title}]`)} 失败: ${e}`)
            exit(0)
          }
          finally {
            logger.info(
              chalk.blue(`[${title}]`),
              `小程序 ${config.appid} 配置: `,
              JSON.stringify(config, null, 2)
            )
          }
        }
        else {
          logger.info(
            chalk.blue(`[${title}]`),
            `小程序 ${config.appid} 配置: `,
            JSON.stringify(config, null, 2)
          )
        }
      }
      return instanceList
    }
    finally {
      exit(0)
    }
  }
}
