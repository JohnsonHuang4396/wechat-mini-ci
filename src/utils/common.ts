import type { PathOrFileDescriptor } from 'node:fs'
import { readFileSync } from 'node:fs'
import { posix, resolve } from 'node:path'
import os from 'node:os'
import { cwd, exit } from 'node:process'
import type { InlineConfig } from '@/types'
import { logger } from './logger'

export const isObject = (val: any) => typeof val === 'object' && val !== null

export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

export const isWindows = os.platform() === 'win32'

export function normalizePath(id: string): string {
  return posix.normalize(isWindows ? slash(id) : id)
}

export function getResolvedRoot(config: InlineConfig) {
  return normalizePath(
    config.root ? resolve(config.root) : cwd()
  )
}

export function arrify(arr: any) {
  if (!arr)
    return []

  if (!Array.isArray(arr))
    return [arr]

  return [...arr]
}

export function readJSON(file: PathOrFileDescriptor) {
  try {
    return JSON.parse(readFileSync(file, 'utf-8'))
  }
  catch {
    throw new Error(`Failed to read JSON file: ${file}`)
  }
}

export async function runner(method: (...params: any[]) => any, ...args: any[]) {
  try {
    await method(...args)
    exit(0)
  }
  catch (e) {
    logger.error(e)
    exit(1)
  }
  finally {
    exit(0)
  }
}
