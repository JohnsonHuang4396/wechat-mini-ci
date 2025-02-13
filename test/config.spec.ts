import { getConfigFilePath, loadConfig, resolveConfig } from '../src/utils'
import { describe, expect, it } from 'vitest'

const configDir = './test/project'

describe('load config', () => {
  it('获取项目路径下的配置文件路径', () => {
    const filepath = getConfigFilePath(configDir)
    expect(filepath).toBeTypeOf('string')
  })

  it('基于文件路径获取配置内容', async () => {
    const config = await loadConfig(configDir)
    expect(config).toBeTypeOf('object')
  })

  it('获取所有项目配置，并整合位数组', async () => {
    const list = await resolveConfig({
      root: configDir
    })
    expect(list).toBeInstanceOf(Array)
  })
})
