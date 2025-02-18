import type { Plugin } from '@/types/plugins'
import { logger } from '@/utils'
import QRCode from 'qrcode'

export async function printQRcodeFn(params: { appid: string, name: string }) {
  const { name, appid } = params
  const url = `https://open.weixin.qq.com/sns/getexpappinfo?appid=${appid}#wechat-redirect`
  const terminalStr = await QRCode.toString(url, {
    type: 'terminal',
    small: true
  })
  logger.log(`【${name}】体验版二维码如下:\n`)

  // eslint-disable-next-line no-console
  console.log(terminalStr)

  return terminalStr
}

export const printQRcode: Plugin = {
  name: 'print-qrcode',
  state: 'post',
  fn: async ({ action, config }) => {
    if (action !== 'preview')
      return

    const { name, appid } = config
    await printQRcodeFn({ name, appid })
  }
}
