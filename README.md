# wechat-mini-ci

[English](./README2.md) | 简体中文

微信小程序上传、预览一步搞定，告别手写发布脚本

> 本项目灵感来源若川大佬的[mini-ci](https://github.com/ruochuan12/mini-ci)，感谢前辈的贡献

> 使用前请确保已经详细阅读 [miniprogram-ci官方文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#%E6%A6%82%E8%BF%B0)，并在 [微信公众平台](https://mp.weixin.qq.com/) 开启代码上传功能 **（如果是个人使用，建议关闭白名单功能，否则可能因IP变更导致发布失败）**

[![npm version](https://img.shields.io/npm/v/@johnsonhuang4396/wechat-mini-ci)](https://www.npmjs.com/package@johnsonhuang4396/wechat-mini-ci)
[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@johnsonhuang4396/wechat-mini-ci)
[![github release](https://img.shields.io/github/v/release/JohnsonHuang4396/wechat-mini-ci)](https://github.com/JohnsonHuang4396/wechat-mini-ci/releases)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40johnsonhuang4396%2Fwechat-mini-ci)
![NPM License](https://img.shields.io/npm/l/%40johnsonhuang4396%2Fwechat-mini-ci)
![NPM Downloads](https://img.shields.io/npm/dm/%40johnsonhuang4396%2Fwechat-mini-ci)

## 如何使用：
```bash
npm i -D @johnsonhuang4396/wechat-mini-ci

npm i -g @johnsonhuang4396/wechat-mini-ci #全局安装使用

npx @johnsonhuang4396/wechat-mini-ci [command] #也可以不安装直接使用，可以确保使用最新版本
```

你可以通过命令行调用`wechat-mini-ci`，也可以通过脚本形式调用导出的`preview`和`upload`函数

`preview`和`upload`函数均已内置初始化功能，你不需要自行初始化。但如果有自定义的需求，可以通过调用`Project`并传入配置项来进行自定义操作👇：
```ts
import { Project } from '@johnsonhuang4396/wechat-mini-ci'

const {
  instance, // 初始化对象，对应miniprogram-ci的project,
  options, // 初始化时传入的配置项
  preview,
  upload
} = new Project({ ...传入配置项 }) // Project在调用时会自动初始化，不需要重复初始化
```

现在假设你的项目路径如下：
```
dist
|- build
|-- mp-weixin
│
src
├─ dir1
└─ dir2
...
|- ci.config.ts
```

并在`ci-config.ts`中配置如下代码：
```ts
import { defineConfig } from '@johnsonhuang4396/wechat-mini-ci'

export default defineConfig({
  name: 'wechat-mini-program',
  projectPath: './dist/build/mp-weixin/',
  privateKeyPath: '填入private-key所在的相对/绝对路径',
  appid: '填入小程序的appid'
})
```

然后在项目的根目录下打开终端，输入如下指令，即可实现上传、预览：
```bash
wmc p #预览
wmc u #上传
```

如果你有多个小程序管理的需求，`defineConfig`也支持传入数组：
```ts
export default defineConfig([
  {
    name: 'wechat-mini-program1',
    projectPath: '填入打包后的小程序路径',
    privateKeyPath: '填入private-key所在的相对/绝对路径',
    appid: '填入小程序的appid'
  },
  {
    name: 'wechat-mini-program2',
    projectPath: '填入打包后的小程序路径',
    privateKeyPath: '填入private-key所在的相对/绝对路径',
    appid: '填入小程序的appid'
  },
])
```

然后在项目的根目录下打开终端，可以选择操作一个、多个小程序：
```bash
wmc p #默认情况下为全量预览
wmc p -s #选择一个小程序进行预览
wmc p -m #选择多个小程序进行预览
```

除了`wmc`外，你还可以使用如下命令来调用👇 **（使用前请确保没有重复的命令）**：
```
wechat-mini-ci
mini-ci
ci
```

当然，`ci.config.ts`也不局限于这个名称，下面的文件名同样会被当作`wechat-mini-ci`的配置文件进行处理👇：
```
ci.config.js
ci.config.mts
mini-ci.config.js
mini-ci.config.ts
mini-ci.config.mts
wx-mini.config.js
wx-mini.config.ts
wx-mini.config.mts
```

## 插件
提供了`prev`和`post`两种类型的插件，`prev`是在执行操作前运行，`post`则是在执行操作后运行 **（如果多个小程序同时操作的情况下，将会多次执行插件，请尽可能确保插件的功能足够简单，否则可能会导致ci执行时间过长）**

> 内置了`print-qrcode`插件，将在预览后打印出小程序的预览二维码

插件的实现如下👇：
```ts
// plugin.ts
export const plugin = {
  name: '插件名称',
  state: 'prev' | 'post',
  fn: ({ action, config }): void => {
    // action 是当前执行的操作，值为 preview 或 upload
    // config 包含了CLI的可选项和当前执行操作的小程序配置项
  }
}

// ci.config.ts
export default defineConfig({
  plugins: [
    plugin
  ]
})
```

## 配置项：

下面是`defineConfig`的配置项👇：

| 名称               | 注释                             | 类型                                                                                                 | 是否必填 |
|--------------------|----------------------------------|------------------------------------------------------------------------------------------------------|----------|
| `projectPath`      | 项目路径                         | `string`                                                                                             | 是       |
| `type`             | 项目类型选项（仅限 'miniProgram')                         | `'miniProgram'`                                                                                        | 否       |
| `appid`            | 应用ID                           | `string`                                                                                             | 是       |
| `privateKey`       | 私钥                             | `string`                                                                                             | 否       |
| `privateKeyPath`   | 私钥路径                         | `string`                                                                                             | 否       |
| `ignores`          | 忽略的文件或目录列表             | `string[]`                                                                                           | 否       |
| `targetPlatform`   | 目标平台                         | `string`                                                                                             | 否       |
| `compileDefines`   | 编译定义                         | `{ [key: string]: string }`                                                                            | 否       |
| `name`             | 项目名称                         | `string`                                                                                             | 是       |
| `version`          | 项目版本                         | `string`                                                                                             | 否       |
| `desc`             | 项目描述                         | `string`                                                                                             | 否       |
| `configPath`       | 配置文件路径                     | `string`                                                                                             | 否       |
| `packageJsonPath`  | package.json 文件路径            | `string`                                                                                             | 否       |
| `plugins`          | 插件列表                         | `Plugin[]`                                                                                           | 否       |
| `preview`          | 预览选项                         | `IPreviewOptions`                                                                                    | 否       |
| `upload`           | 上传选项                         | `IUploadOptions`                                                                                     | 否       |

下面是`预览`配置项👇：

| 名称                        | 注释                             | 类型                                                                                                 | 是否必填 |
|-----------------------------|----------------------------------|------------------------------------------------------------------------------------------------------|----------|
| `version`                   | 上传选项中的版本号                 | `string`                                                                                             | 否       |
| `setting`                   | 编译设置                         | `MiniProgramCI.ICompileSettings`                                                                       | 否       |
| `desc`                      | 描述                             | `string`                                                                                             | 否       |
| `robot`                     | 机器人编号                       | `number`                                                                                             | 否       |
| `threads`                   | 线程数                           | `number`                                                                                             | 否       |
| `useCOS`                    | 是否使用 COS 存储                 | `boolean`                                                                                            | 否       |
| `onProgressUpdate`          | 进度更新回调函数                   | `(task: MiniProgramCI.ITaskStatus \| string) => void`                                                | 否       |
| `allowIgnoreUnusedFiles`    | 是否忽略未使用的文件               | `boolean`                                                                                            | 否       |
| `test`                      | 测试模式                         | `boolean`                                                                                            | 否       |
| `bigPackageSizeSupport`     | 是否支持大包大小                   | `boolean`                                                                                            | 否       |
| `qrcodeFormat`              | 二维码格式                       | `base64 \| image \| terminal`                                                                      | 否       |
| `qrcodeOutputDest`          | 二维码输出目标                   | `string`                                                                                             | 否       |
| `pagePath`                  | 页面路径                         | `string`                                                                                             | 否       |
| `searchQuery`               | 搜索查询                         | `string`                                                                                             | 否       |

下面是`上传`配置项👇：

| 名称                           | 注释                             | 类型                                                                                                 | 是否必填 |
|--------------------------------|----------------------------------|------------------------------------------------------------------------------------------------------|----------|
| `version`                      | 上传选项中的版本号                 | `string`                                                                                             | 否       |
| `setting`                      | 编译设置                         | `MiniProgramCI.ICompileSettings`                                                                       | 否       |
| `desc`                         | 描述                             | `string`                                                                                             | 否       |
| `robot`                        | 机器人编号                       | `number`                                                                                             | 否       |
| `threads`                      | 线程数                           | `number`                                                                                             | 否       |
| `useCOS`                       | 是否使用 COS 存储                 | `boolean`                                                                                            | 否       |
| `onProgressUpdate`             | 进度更新回调函数                   | `(task: MiniProgramCI.ITaskStatus \| string) => void`                                                   | 否       |
| `allowIgnoreUnusedFiles`       | 是否忽略未使用的文件               | `boolean`                                                                                            | 否       |
| `test`                         | 测试模式                         | `boolean`                                                                                            | 否       |
| `bigPackageSizeSupport`        | 是否支持大包大小                   | `boolean`                                                                                            | 否       |
| `qrcodeFormat`                 | 二维码格式                       | `'base64' \| 'image' \| 'terminal'`                                                                      | 否       |
| `qrcodeOutputDest`             | 二维码输出目标                   | `string`                                                                                             | 否       |
| `pagePath`                     | 页面路径                         | `string`                                                                                             | 否       |
| `searchQuery`                  | 搜索查询                         | `string`                                                                                             | 否       |
| `scene`                        | 场景值                           | `number`                                                                                             | 否       |

## CLI配置项：
基础配置项👇：
```
Usage:
  $ wechat-mini-ci <command> [options]

Commands:
  preview [root]  预览小程序
  upload [root]   上传小程序

For more info, run any command with the `--help` flag:
  $ wechat-mini-ci preview --help
  $ wechat-mini-ci upload --help

Options:
  -d, --dry      空跑
  -h, --help     Display this message
  -v, --version  Display version number
```

`预览 | 上传`配置项👇：
> PS: 当配置了`root`时，`config`将会把`root`作为根目录进行操作
```
  -r, --robot <robot>   指定机器人，默认 1
  -c, --config <file>   指定一个文件为配置文件
  -s, --useSelect       选择一个配置操作
  -m, --useMultiSelect  选择多个配置操作
  -si, --silent         静默模式
  -d, --dry             空跑
```

## 最后

感谢[antfu大佬的模版](https://github.com/antfu/starter-ts)和[若川大佬的mini-ci](https://github.com/ruochuan12/mini-ci)开源

## License

[MIT](./LICENSE) License © [Johnson Huang](https://github.com/JohnsonHuang4396)
