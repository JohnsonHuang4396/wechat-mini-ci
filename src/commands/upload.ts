import type { InlineConfig } from '@/types'
import { actions, ActionsEnum, ActionTitlesEnum } from './actions'

export async function upload(root: string, inlineConfig: InlineConfig) {
  return await actions({ action: ActionsEnum.upload, title: ActionTitlesEnum.upload })(root, inlineConfig)
}
