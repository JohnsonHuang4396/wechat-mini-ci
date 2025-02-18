/* eslint-disable no-console */
import { describe, expect, it } from 'vitest'
import { printQRcodeFn } from '../src/plugins/build-in'
import { execaCommandSync } from 'execa'
import { join } from 'node:path'

const CLIRoot = join(__dirname, '../src/cli.ts')

const root = join(__dirname, './project')

const config = join(__dirname, '../example/ci.config.js')

function run() {
  return execaCommandSync(`npx tsx ${CLIRoot} -d preview ${root} --c ${config}`)
}

describe('plugin', () => {
  it('build-in print-qrcode plugin', { skip: true }, async () => {
    expect(await printQRcodeFn({ appid: '123', name: 'test' })).toBeTypeOf('string')
  })

  it('test prev plugin', () => {
    const { stdout } = run()
    console.log(stdout)
    expect(stdout).toContain('👀 this is a prev plugin')
  })
})
