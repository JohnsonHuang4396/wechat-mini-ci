// eslint-disable-next-line antfu/no-import-dist
import { defineConfig } from '../dist/index.mjs'

export default defineConfig([
  {
    name: 'test1',
    appid: '123',
    projectPath: './',
    privateKeyPath: './privateKey.txt'
  },
  {
    name: 'test2',
    appid: '123',
    projectPath: './',
    privateKeyPath: './privateKey.txt'
  }
])
