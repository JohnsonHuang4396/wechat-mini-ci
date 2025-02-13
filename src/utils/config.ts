import { defaultConfigFileName, defaultConfigPath, defaultPackageJSONPath } from '@/constants'
import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import type { InlineConfig, IProjectOptions, TDefineConfig, TMixProjectInlineConfig } from '@/types'
import { resolve } from 'node:path'
import { isObject, readJSON, logger, getResolvedRoot, select, arrify } from '@/utils'
import { execaCommandSync } from 'execa'

/**
 * @description 基于package.json获取版本号
 */
export function getVersion(path = defaultPackageJSONPath) {
  let version = '1.0.0'
  try {
    version = readJSON(path).version
  }
  catch {
    logger.warn('未检测到package.json文件，版本号默认为1.0.0')
  }
  return version
}

/**
 * @description 基于git提交记录设置版本描述
 */
export function getDesc(
  projectPath: IProjectOptions['projectPath'],
  version: IProjectOptions['version']
) {
  let gitCommitHash = 'git commit hash 为空'
  try {
    gitCommitHash = execaCommandSync('git rev-parse --short HEAD', {
      stdio: 'pipe',
      cwd: projectPath
    }).stdout
  }
  catch (e) {
    logger.warn('获取 git commit hash 失败', e)
  }

  let gitCommitMessage = 'git commit message 为空'
  try {
    gitCommitMessage = execaCommandSync('git log -1 --pretty=%B', {
      stdio: 'pipe',
      cwd: projectPath
    }).stdout
  }
  catch (e) {
    logger.warn('获取 git commit message 失败', e)
  }

  let userName = '默认'
  const getUserName = (
    gitConfig = 'git config user.name',
    errorRetry = true
  ) => {
    try {
      userName = execaCommandSync(gitConfig, {
        stdio: 'pipe',
        cwd: projectPath
      }).stdout
    }
    catch (e) {
      logger.warn(`${gitConfig} 获取失败`, e)
      if (errorRetry)
        getUserName('git config --global user.name', false)
    }
  }
  getUserName()

  return `v${version} - ${gitCommitHash}: ${gitCommitMessage} - by@${userName}`
}

/**
 * @description 根据配置文件名获取文件路径
 */
export function getConfigFilePath(configDir: string) {
  let resolvedPath: string | undefined
  for (const filename of defaultConfigFileName) {
    const filePath = resolve(configDir, filename)
    if (!existsSync(filePath))
      continue

    resolvedPath = filePath
    break
  }

  if (!resolvedPath) {
    logger.warn('未检测到配置文件，使用默认配置')
  }

  return resolvedPath
}

/**
 * @description 获取配置文件内容
 */
export async function getConfigFromFile(path = defaultConfigPath): Promise<TDefineConfig | undefined> {
  let fileNameTmp: string = ''
  try {
    let fileUrl = path
    // 统一用 esm 处理
    // 不是 mjs 结尾，生成临时的 mjs 来读取，读取完后删除
    if (!/\.m?[tj]s$/.test(path)) {
      const fileBase = `${path}.timestamp-${Date.now()}`
      fileNameTmp = `${fileBase}.ts`
      fileUrl = `${pathToFileURL(fileBase)}.ts`
      const code = readFileSync(path, 'utf8')
      writeFileSync(fileNameTmp, code, 'utf8')
    }

    return (await import(fileUrl)).default
  }
  catch (e) {
    logger.error(`加载配置文件 ${path} 失败`, e)
    return
  }
  finally {
    try {
      unlinkSync(fileNameTmp)
    }
    catch {
    // already removed if this function is called twice simultaneously
    }
  }
}

export async function getConfigList(configPath: string) {
  let configPathList: string[] = []
  try {
    configPathList = readdirSync(configPath)
  }
  catch (error) {
    logger.error(error)
    throw new Error('请设置小程序配置路径 configPath')
  }
  if (configPathList.length === 0) {
    throw new Error('请设置小程序配置路径 configPath')
  }

  const configList: IProjectOptions[] = []
  for (const path of configPathList) {
    const config = await getConfigFromFile(`${configPath}/${path}`)
    config && (Array.isArray(config) ? configList.push(...config) : configList.push(config))
  }

  return configList
}

export function mergeConfig(defaults: Record<string, any>, config: Record<string, any>) {
  const getLastOptions = (val: any) => (isObject(val) ? val : {})

  const resolvedRoot = getResolvedRoot(defaults)
  const projectPath = config.projectPath ? resolve(resolvedRoot, config.projectPath) : undefined
  const privateKeyPath = config.privateKeyPath ? resolve(resolvedRoot, config.privateKeyPath) : undefined
  const projectConfigPath = `${resolve(resolvedRoot, config.projectPath)}/project.config.json`
  const packageJSONPath = config.packageJsonPath ? resolve(resolvedRoot, config.packageJsonPath) : undefined

  const projectOptions: IProjectOptions = {
    name: config.name,
    version: config.version,
    projectPath: resolve(resolvedRoot, config.projectPath),
    type: 'miniProgram',
    appid: config.appid,
    ignores: [
      'node_modules/**/*',
      'CHANGELOG.md',
      'README.md',
      'yarn.lock',
      'package-lock.json',
      'pnpm-lock.yaml'
    ]
  }
  projectOptions.privateKeyPath = privateKeyPath
  projectOptions.privateKey = config.privateKey

  let setting = {}
  try {
    const projectConfig = readJSON(projectConfigPath)
    setting = projectConfig?.setting
  }
  catch (e) {
    logger.warn(
      `加载项目中的 ${config.projectPath}/project.config.json 失败: ${e}`
    )
  }

  const commonConfig = {
    version: config.version || getVersion(packageJSONPath),
    robot: defaults.robot
  }

  const uploadFromConfig = getLastOptions(config.upload)
  const upload = {
    ...commonConfig,
    ...uploadFromConfig,
    desc: config.desc || getDesc((config.projectPath && projectPath), commonConfig.version),
    setting: {
      ...setting,
      ...uploadFromConfig?.setting
    }
  }

  const previewFromConfig = getLastOptions(config.preview)
  const preview = {
    ...commonConfig,
    ...previewFromConfig,
    setting: {
      ...setting,
      ...previewFromConfig?.setting
    }
  }

  return {
    ...projectOptions,
    upload,
    preview
    // plugins: config.plugins,
    // id: uniqueId(),
  }
}

/**
 * @description 基于配置文件所在目录和默认配置文件路径获取配置文件内容
 */
export async function loadConfig(configDir: string): Promise<TDefineConfig | undefined> {
  const resolvedPath = getConfigFilePath(configDir)
  if (!resolvedPath) {
    return
  }
  return getConfigFromFile(resolvedPath)
}

/**
 * @description 命令行获取配置
 */
export async function resolveConfig(config: InlineConfig) {
  const resolvedRoot = getResolvedRoot(config)
  let loadResult: TDefineConfig | TDefineConfig[] | undefined
  if (config.config)
    loadResult = await getConfigFromFile(resolve(resolvedRoot, config.config))
  else
    loadResult = await loadConfig(resolvedRoot)

  if (!isObject(loadResult))
    throw new Error('未发现配置项，请确保项目根目录下存在ci配置文件')

  let loadResultList: any[] = []
  // 单选或者多选
  if (config.useSelect || config.useMultiSelect || config.useAllConfig) {
    const allConfigList = arrify(loadResult)
    if (config.useAllConfig) {
      loadResultList = allConfigList
    }
    else {
      loadResultList = await select({
        configList: allConfigList,
        useSelect: config.useSelect,
        useMultiSelect: config.useMultiSelect
      })
    }
  }
  else {
    loadResultList = arrify(loadResult)
  }

  return loadResultList.map<TMixProjectInlineConfig>((item) => {
    return mergeConfig(config, item!)
  })
}
