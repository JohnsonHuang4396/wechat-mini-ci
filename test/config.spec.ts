import { join } from 'node:path'
import { getConfigFilePath, loadConfig, resolveConfig } from '../src/utils'
import { describe, expect, it } from 'vitest'

const configDir = join(__dirname, '../example')

const projectRoot = join(__dirname, '../test/project')

describe('load config', () => {
  it('获取项目路径下的配置文件路径', () => {
    const filepath = getConfigFilePath(configDir)
    expect(filepath).toBeTypeOf('string')
  })

  it('基于文件路径获取配置内容', async () => {
    const config = await loadConfig(configDir)
    expect(config).toBeTypeOf('object')
  })

  it('获取指定配置文件的配置 js', async () => {
    const list = await resolveConfig({
      root: projectRoot,
      config: '../../example/ci.config.js'
    })
    expect(list).toHaveLength(1)
  })

  it('获取指定配置文件的配置 ts', async () => {
    const list = await resolveConfig({
      root: projectRoot,
      config: '../../example/ci.config.ts'
    })
    expect(list).toHaveLength(1)
  })

  it('获取指定配置文件的配置 mts', async () => {
    const list = await resolveConfig({
      root: projectRoot,
      config: '../../example/ci.config.mts'
    })
    expect(list).toHaveLength(1)
  })
})
