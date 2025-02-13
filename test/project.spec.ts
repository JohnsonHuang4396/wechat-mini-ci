import { describe, expect, it } from 'vitest'
import { Project } from '../src'
import ci from 'miniprogram-ci'
import type { IProjectOptions } from '../src'

const mockConfig: IProjectOptions = {
  name: 'test',
  version: '1.0.0',
  projectPath: 'test/project',
  appid: '123',
  type: 'miniProgram'
}

const mockPrivateKey = '123'

const mockPrivateKeyPath = 'test/project/privateKey.txt'

describe('project init', () => {
  it('project config require privateKey or privateKeyPath', { fails: true }, () => {
    const _instance = new Project(mockConfig)
  })

  it('project init by using privateKey', () => {
    const instance = new Project({
      ...mockConfig,
      privateKey: mockPrivateKey
    })
    expect(instance.instance).instanceOf(ci.Project)
  })

  it('project init by using privateKeyPath', () => {
    const instance = new Project({
      ...mockConfig,
      privateKeyPath: mockPrivateKeyPath
    })
    expect(instance.instance).instanceOf(ci.Project)
  })
})
