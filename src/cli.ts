import type { Command } from 'cac'
import { cac } from 'cac'
import { logger } from './utils'
import chalk from 'chalk'
import { defaultConfigFileName } from './constants'
import { version } from '../package.json'
import { preview, upload } from './commands'

const cli = cac('wechat-mini-ci')

cli.option('-d, --dry', '空跑')

function cliInlineOptions(cliInstance: Command) {
  return cliInstance
    .option('-r, --robot <robot>', '指定机器人，默认 1')
    .option('-c, --config <file>', '指定一个文件为配置文件')
    .option('--mode <mode>', '指定模式，读取 .env.[mode] 配置文件')
    .option('-s, --useSelect', '需配置 configPath 选择一个配置操作')
    .option('-m, --useMultiSelect', '需配置 configPath 选择多个配置操作')
    .option('-a, --useAllConfig', '需配置 configPath，所有配置批量操作')
}

const previewCommand = cli.command('preview [root]', '预览小程序').alias('p')

cliInlineOptions(previewCommand).action(preview)

const uploadCommand = cli.command('upload [root]', '上传小程序').alias('u')

cliInlineOptions(uploadCommand).action(upload)

cli.help(() => {
  logger.info(
    '运行 wechat-mini-ci 前，请确保在执行命令目录下存在 wechat-mini-ci 的配置文件',
    `配置文件可选名称为: ${defaultConfigFileName.map(name => chalk.green(name)).join(', ')}`
  )
})

cli.version(version)

cli.parse()
