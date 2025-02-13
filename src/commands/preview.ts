import type { InlineConfig } from '@/types'
import { actions, ActionsEnum, ActionTitlesEnum } from './actions'

export async function preview(root: string, inlineConfig: InlineConfig) {
  return await actions({ action: ActionsEnum.preview, title: ActionTitlesEnum.preview })(root, inlineConfig)
}
