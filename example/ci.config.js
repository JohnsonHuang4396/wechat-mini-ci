// eslint-disable-next-line antfu/no-import-dist
import { defineConfig } from '../dist/index.mjs'

export default defineConfig({
  name: 'wechat-miniprogram-test',
  appid: '123',
  projectPath: './',
  privateKeyPath: './privateKey.txt',
  plugins: [
    {
      name: 'prev-test-plugin',
      state: 'prev',
      fn() {
        console.log('👀 this is a prev plugin')
      }
    }
  ]
})
