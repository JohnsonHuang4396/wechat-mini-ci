import type { ICreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project'
import type { IPreviewOptions, IUploadOptions } from './project'
import type { Plugin } from './plugins'

type TCreateProjectOptions = Omit<ICreateProjectOptions, 'type'>

export interface IProjectOptions extends TCreateProjectOptions {
  name: string
  version?: string
  type?: 'miniProgram'
  desc?: string
  configPath?: string
  packageJsonPath?: string
  plugins?: Plugin[]
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
  config?: string
  silent?: boolean
}

export type TMixProjectInlineConfig = IProjectOptions & InlineConfig
