# wechat-mini-ci

English | [简体中文](./README.md)

One-click solution for WeChat Mini Program upload and preview, say goodbye to manual deployment scripts.

> This project is inspired by [mini-ci](https://github.com/ruochuan12/mini-ci) by Ruochuan. Thanks for the contribution!

> Before using, please make sure you have thoroughly read the [miniprogram-ci official documentation](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#%E6%A6%82%E8%BF%B0) and enabled the code upload feature in [WeChat Official Platform](https://mp.weixin.qq.com/). **(For personal use, it's recommended to disable the whitelist feature to avoid deployment failures due to IP changes)**

[![npm version](https://img.shields.io/npm/v/@johnsonhuang4396/wechat-mini-ci)](https://www.npmjs.com/package@johnsonhuang4396/wechat-mini-ci)
[![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@johnsonhuang4396/wechat-mini-ci)
[![github release](https://img.shields.io/github/v/release/JohnsonHuang4396/wechat-mini-ci)](https://github.com/JohnsonHuang4396/wechat-mini-ci/releases)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40johnsonhuang4396%2Fwechat-mini-ci)
![NPM License](https://img.shields.io/npm/l/%40johnsonhuang4396%2Fwechat-mini-ci)
![NPM Downloads](https://img.shields.io/npm/dm/%40johnsonhuang4396%2Fwechat-mini-ci)

## How to Use:
```bash
npm i -D @johnsonhuang4396/wechat-mini-ci

npm i -g @johnsonhuang4396/wechat-mini-ci # Global installation

npx @johnsonhuang4396/wechat-mini-ci [command] # Use directly without installation to ensure latest version
```

You can use `wechat-mini-ci` via command line or by calling the exported preview and upload functions in your scripts.

The preview and upload functions have built-in initialization, so you don't need to initialize them manually. However, if you have custom requirements, you can call Project with configuration options for custom operations👇:
```ts
import { Project } from '@johnsonhuang4396/wechat-mini-ci'

const {
  instance, // Initialization object, corresponds to miniprogram-ci's project
  options, // Configuration options passed during initialization
  preview,
  upload
} = new Project({ ...config }) // Project automatically initializes when called
```

Assume your project structure is as follows:
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

Configure `ci-config.ts` as follows:
```ts
import { defineConfig } from '@johnsonhuang4396/wechat-mini-ci'

export default defineConfig({
  name: 'wechat-mini-program',
  projectPath: './dist/build/mp-weixin/',
  privateKeyPath: 'Enter the relative/absolute path to your private-key',
  appid: 'Enter your Mini Program appid'
})
```

Then open a terminal in your project root directory and enter the following commands for upload and preview:
```bash
wmc p # Preview
wmc u # Upload
```

If you need to manage multiple Mini Programs, defineConfig also supports arrays:
```ts
export default defineConfig([
  {
    name: 'wechat-mini-program1',
    projectPath: 'Enter Mini Program path after build',
    privateKeyPath: 'Enter the relative/absolute path to your private-key',
    appid: 'Enter your Mini Program appid'
  },
  {
    name: 'wechat-mini-program2',
    projectPath: 'Enter Mini Program path after build',
    privateKeyPath: 'Enter the relative/absolute path to your private-key',
    appid: 'Enter your Mini Program appid'
  },
])
```

Then in your project root directory, you can choose to operate on one or multiple Mini Programs:
```bash
wmc p # Preview all by default
wmc p -s # Select one Mini Program to preview
wmc p -m # Select multiple Mini Programs to preview
```

Besides wmc , you can also use the following commands👇 (Make sure there are no duplicate commands) :
```
wechat-mini-ci
mini-ci
ci
```

Of course, `ci.config.ts` isn't limited to this name. The following filenames will also be processed as `wechat-mini-ci` configuration files👇:
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

## Plugins
Two types of plugins are provided: `prev` and `post` . `prev` runs before the operation, while `post` runs after. (When operating multiple Mini Programs simultaneously, plugins will be executed multiple times. Please ensure plugin functionality is simple enough to avoid prolonged CI execution times)

The built-in `print-qrcode` plugin will print the Mini Program's preview QR code after preview

Plugin implementation is as follows👇:

```ts
// plugin.ts
export const plugin = {
  name: 'Plugin Name',
  state: 'prev' | 'post',
  fn: ({ action, config }): void => {
    // action is the current operation, either 'preview' or 'upload'
    // config contains CLI options and current Mini Program configuration
  }
}

// ci.config.ts
export default defineConfig({
  plugins: [
    plugin
  ]
})
```

## Configuration Options:

Below are the `defineConfig` options👇:

| Name               | Description                      | Type                                                                                                 | Required |
|--------------------|----------------------------------|------------------------------------------------------------------------------------------------------|----------|
| `projectPath`      | Project Path                     | `string`                                                                                             | Yes      |
| `type`             | Project Type (only 'miniProgram')| `'miniProgram'`                                                                                     | No       |
| `appid`            | Application ID                   | `string`                                                                                             | Yes      |
| `privateKey`       | Private Key                      | `string`                                                                                             | No       |
| `privateKeyPath`   | Private Key Path                 | `string`                                                                                             | No       |
| `ignores`          | Ignored Files/Directories        | `string[]`                                                                                           | No       |
| `targetPlatform`   | Target Platform                  | `string`                                                                                             | No       |
| `compileDefines`   | Compile Definitions              | `{ [key: string]: string }`                                                                          | No       |
| `name`             | Project Name                     | `string`                                                                                             | Yes      |
| `version`          | Project Version                  | `string`                                                                                             | No       |
| `desc`             | Project Description              | `string`                                                                                             | No       |
| `configPath`       | Config File Path                 | `string`                                                                                             | No       |
| `packageJsonPath`  | package.json Path                | `string`                                                                                             | No       |
| `plugins`          | Plugin List                      | `Plugin[]`                                                                                           | No       |
| `preview`          | Preview Options                  | `IPreviewOptions`                                                                                    | No       |
| `upload`           | Upload Options                   | `IUploadOptions`                                                                                     | No       |

Preview options👇:

| Name                        | Description                      | Type                                                                                                 | Required |
|-----------------------------|----------------------------------|------------------------------------------------------------------------------------------------------|----------|
| `version`                   | Version Number                   | `string`                                                                                             | No       |
| `setting`                   | Compile Settings                 | `MiniProgramCI.ICompileSettings`                                                                     | No       |
| `desc`                      | Description                      | `string`                                                                                             | No       |
| `robot`                     | Robot Number                     | `number`                                                                                             | No       |
| `threads`                   | Thread Count                     | `number`                                                                                             | No       |
| `useCOS`                    | Use COS Storage                 | `boolean`                                                                                            | No       |
| `onProgressUpdate`          | Progress Update Callback         | `(task: MiniProgramCI.ITaskStatus \| string) => void`                                                | No       |
| `allowIgnoreUnusedFiles`    | Allow Ignore Unused Files        | `boolean`                                                                                            | No       |
| `test`                      | Test Mode                        | `boolean`                                                                                            | No       |
| `bigPackageSizeSupport`     | Support Large Package Size       | `boolean`                                                                                            | No       |
| `qrcodeFormat`              | QR Code Format                   | `base64 \| image \| terminal`                                                                      | No       |
| `qrcodeOutputDest`          | QR Code Output Destination       | `string`                                                                                             | No       |
| `pagePath`                  | Page Path                        | `string`                                                                                             | No       |
| `searchQuery`               | Search Query                     | `string`                                                                                             | No       |

Upload options👇:

| Name                           | Description                      | Type                                                                                                 | Required |
|--------------------------------|----------------------------------|------------------------------------------------------------------------------------------------------|----------|
| `version`                      | Version Number                   | `string`                                                                                             | No       |
| `setting`                      | Compile Settings                 | `MiniProgramCI.ICompileSettings`                                                                     | No       |
| `desc`                         | Description                      | `string`                                                                                             | No       |
| `robot`                        | Robot Number                     | `number`                                                                                             | No       |
| `threads`                      | Thread Count                     | `number`                                                                                             | No       |
| `useCOS`                       | Use COS Storage                 | `boolean`                                                                                            | No       |
| `onProgressUpdate`             | Progress Update Callback         | `(task: MiniProgramCI.ITaskStatus \| string) => void`                                               | No       |
| `allowIgnoreUnusedFiles`       | Allow Ignore Unused Files        | `boolean`                                                                                            | No       |
| `test`                         | Test Mode                        | `boolean`                                                                                            | No       |
| `bigPackageSizeSupport`        | Support Large Package Size       | `boolean`                                                                                            | No       |
| `qrcodeFormat`                 | QR Code Format                   | `'base64' \| 'image' \| 'terminal'`                                                                  | No       |
| `qrcodeOutputDest`             | QR Code Output Destination       | `string`                                                                                             | No       |
| `pagePath`                     | Page Path                        | `string`                                                                                             | No       |
| `searchQuery`                  | Search Query                     | `string`                                                                                             | No       |
| `scene`                        | Scene Value                      | `number`                                                                                             | No       |

## CLI Options:
Basic options👇:
```
Usage:
  $ wechat-mini-ci <command> [options]

Commands:
  preview [root]  Preview Mini Program
  upload [root]   Upload Mini Program

For more info, run any command with the `--help` flag:
  $ wechat-mini-ci preview --help
  $ wechat-mini-ci upload --help

Options:
  -d, --dry      Dry run
  -h, --help     Display this message
  -v, --version  Display version number
```

Preview | Upload options👇:

PS: When root is configured, config will use root as the base directory
```
  -r, --robot <robot>   Specify robot, default 1
  -c, --config <file>   Specify a configuration file
  -s, --useSelect       Select one configuration to operate
  -m, --useMultiSelect  Select multiple configurations to operate
  -si, --silent         Silent mode
  -d, --dry             Dry run
```

## Finally
Thanks to antfu's template and Ruochuan's mini-ci

## License
MIT License © Johnson Huang
