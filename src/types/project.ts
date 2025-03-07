import type { IInnerUploadOptions, IInnerUploadResult } from 'miniprogram-ci/dist/@types/ci/upload'

export interface IPreviewOptions extends Omit<IInnerUploadOptions, 'project' | 'version'> {
  test?: true
  version?: string
}

export interface IUploadOptions extends Omit<
  IInnerUploadOptions,
  'project' | 'test' | 'bigPackageSizeSupport' | 'qrcodeFormat' | 'qrcodeOutputDest' | 'pagePath' | 'searchQuery' | 'scene' | 'version'
> {
  version?: string
}

export interface IUploadResult extends Omit<IInnerUploadResult, 'respBody'> {
}
