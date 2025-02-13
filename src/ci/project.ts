import type { BaseProject } from 'miniprogram-ci/dist/@types'
import ci from 'miniprogram-ci'
import type { IProjectOptions, IUploadResult } from '../types'
import { defaultProjectOptions } from '../constants'
import type { ICreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project'
import chalk from 'chalk'

export class Project {
  private _instance?: BaseProject
  private _options?: IProjectOptions
  // eslint-disable-next-line no-console
  private _onPreviewUpdate?: (task: any) => void = console.log
  // eslint-disable-next-line no-console
  private _onUploadUpdate?: (task: any) => void = console.log

  constructor(options: IProjectOptions) {
    if (!options) {
      throw new Error('Invalid options')
    }
    const { privateKey, privateKeyPath } = options
    if (!privateKey && !privateKeyPath) {
      throw new Error('Private key or private key path is required')
    }
    this.init(options)
  }

  get instance() {
    return this._instance
  }

  get options() {
    return this._options
  }

  init(options: IProjectOptions) {
    if (this._instance)
      return
    this._options = Object.assign({}, defaultProjectOptions, options)
    this._instance = new ci.Project(this._options as ICreateProjectOptions)
  }

  async preview() {
    if (!this.instance) {
      throw new Error('项目实例未初始化')
    }
    if (!this._options?.preview) {
      throw new Error(`配置文件中${chalk.red('preview')}属性为空`)
    }
    return await ci.preview({
      ...this._options.preview,
      project: this.instance,
      onProgressUpdate: this._onPreviewUpdate
    })
  }

  onPreview(callback?: (task: any) => void) {
    this._onPreviewUpdate = callback
  }

  async upload(): Promise<IUploadResult> {
    if (!this.instance) {
      throw new Error('项目实例未初始化')
    }
    if (!this._options?.upload) {
      throw new Error(`配置文件中${chalk.red('upload')}属性为空`)
    }
    return await ci.upload({
      ...this._options.upload,
      project: this.instance,
      onProgressUpdate: this._onUploadUpdate
    })
  }

  onUploadUpdate(callback?: (task: any) => void) {
    this._onUploadUpdate = callback
  }
}
