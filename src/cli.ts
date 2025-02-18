import type { Command } from 'cac'
import { cac } from 'cac'
import { logger, runner } from './utils'
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
    .option('-s, --useSelect', '选择一个配置操作')
    .option('-m, --useMultiSelect', '选择多个配置操作')
    .option('-si, --silent', '静默模式')
}

const previewCommand = cli.command('preview [root]', '预览小程序').alias('p')

cliInlineOptions(previewCommand).action(async (...args) => await runner(preview, ...args))

const uploadCommand = cli.command('upload [root]', '上传小程序').alias('u')

cliInlineOptions(uploadCommand).action(async (...args) => await runner(upload, ...args))

cli.help(() => {
  logger.info(
    '运行 wechat-mini-ci 前，请确保在执行命令目录下存在 wechat-mini-ci 的配置文件',
    `配置文件可选名称为: ${defaultConfigFileName.map(name => chalk.green(name)).join(', ')}`
  )
})

cli.version(version)

cli.parse()
