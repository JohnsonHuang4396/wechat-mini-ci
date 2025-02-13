import type { IInnerUploadOptions, IInnerUploadResult } from 'miniprogram-ci/dist/@types/ci/upload'

export interface IPreviewOptions extends Omit<IInnerUploadOptions, 'project'> {
  test?: true
}

export interface IUploadOptions extends Omit<
  IInnerUploadOptions,
  'project' | 'test' | 'bigPackageSizeSupport' | 'qrcodeFormat' | 'qrcodeOutputDest' | 'pagePath' | 'searchQuery' | 'scene'
> {
}

export interface IUploadResult extends Omit<IInnerUploadResult, 'respBody'> {
}
