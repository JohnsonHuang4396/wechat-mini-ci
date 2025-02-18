import { describe, it } from 'vitest'
import { preview, upload } from '../src/commands'
import { join } from 'node:path'

const root = 'test/project'

const config = join(__dirname, '../example/ci.config.js')

describe('ci', () => {
  it('预览 dry run', async () => {
    await preview(root, { config, dry: true, silent: true })
  })

  it('上传 dry run', async () => {
    await upload(root, { config, dry: true, silent: true })
  })
})
