import { describe, it } from 'vitest'
import { preview, upload } from '../src/commands'

const root = 'test/project'

describe('ci', () => {
  it('预览 dry run', async () => {
    await preview(root, { dry: true })
  })

  it('上传 dry run', async () => {
    await upload(root, { dry: true })
  })
})
