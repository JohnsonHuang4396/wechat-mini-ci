import type { ICreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project'
import type { IPreviewOptions, IUploadOptions } from './project'

type TCreateProjectOptions = Omit<ICreateProjectOptions, 'type'>

export interface IProjectOptions extends TCreateProjectOptions {
  name: string
  version: string
  type?: 'miniProgram'
  desc?: string
  configPath?: string
  packageJsonPath?: string
  preview?: IPreviewOptions
  upload?: IUploadOptions
}

export type TDefineConfig = IProjectOptions | IProjectOptions[]

export interface InlineConfig {
  /**
   * @default process.cwd()
   */
  root?: string
  useMultiSelect?: boolean
  useSelect?: boolean
  robot?: number
  dry?: boolean
  useAllConfig?: boolean
  // 指定配置文件
  config?: string
  mode?: string
}

export type TMixProjectInlineConfig = IProjectOptions & InlineConfig
