/* eslint-disable no-console */
import chalk from 'chalk'

class Logger {
  isCI: boolean
  isDryRun: boolean
  constructor({ isCI = true, isDryRun = false } = {}) {
    this.isCI = isCI
    this.isDryRun = isDryRun
  }

  log(...args: unknown[]) {
    console.log(chalk.green('🚀 wechat-miniprogram-ci'), ...args)
  }

  error(...args: any[]) {
    console.error(chalk.red('🚀 wechat-miniprogram-ci'), chalk.red('🚨 ERROR'), ...args)
  }

  info(...args: any[]) {
    this.log(chalk.green('INFO'), ...args)
  }

  success(...args: any[]) {
    this.log(chalk.green(' 🎉 SUCCESS'), ...args)
  }

  warn(...args: any[]) {
    this.log(chalk.yellow('🔥 WARNING'), ...args)
  }

  test(...args: any[]) {
    this.log(chalk.gray('🧪 TEST'), ...args)
  }
}

export const logger = new Logger()
