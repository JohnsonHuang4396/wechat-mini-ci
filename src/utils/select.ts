import type { InlineConfig, IProjectOptions } from '@/types'
import enquirer from 'enquirer'
import { logger } from './logger'
import { exit } from 'node:process'

interface SelectOptions {
  configList: any[]
  useSelect?: InlineConfig['useSelect']
  useMultiSelect?: InlineConfig['useMultiSelect']
}

export async function select(options: SelectOptions) {
  let {
    configList,
    useSelect = false,
    useMultiSelect = false
  } = options || {}

  // 单选、多选 两者只能选择其一
  if (useSelect) {
    useMultiSelect = false
  }
  if (useMultiSelect) {
    useSelect = false
  }

  // @ts-expect-error MultiSelect
  const { prompt, MultiSelect } = enquirer

  let result: IProjectOptions[] = []

  if (useSelect) {
  // @ts-expect-error name
    const { name } = await prompt({
      type: 'select',
      name: 'name',
      message: '请选择一个小程序配置',
      choices: configList
    })
    result = configList.filter(el => el.name === name)
    return result
  }

  if (useMultiSelect) {
    const multiSelectPrompt = new MultiSelect({
      name: 'value',
      message: '可选择多个小程序配置',
      limit: 7,
      choices: configList
    })

    try {
      const answer = await multiSelectPrompt.run()
      logger.log('您已选择:', answer)
      result = configList.filter(el => answer.includes(el.name))
      return result
    }
    catch (err) {
      logger.log('您已经取消', err)
      exit(1)
    }
  }

  return result
}
