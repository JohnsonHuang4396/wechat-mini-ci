// eslint-disable-next-line antfu/no-import-dist
import { defineConfig } from '../dist/index.mjs'

export default defineConfig({
  name: 'test',
  appid: '123',
  projectPath: './',
  privateKeyPath: './privateKey.txt'
})
