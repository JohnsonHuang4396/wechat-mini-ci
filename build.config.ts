import { URL, fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    inlineDependencies: true
  },
  entries: [
    'src/index'
  ],
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  },
  declaration: 'node16',
  clean: true
})
