// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    stylistic: {
      quotes: 'single',
      semi: false,
      indent: 2,
      overrides: {
        'style/comma-dangle': ['error', 'never']
      }
    },
    rules: {
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'ts/explicit-function-return-type': 'off'
    },
    ignores: [
      'dist/**',
      'node_modules/**'
    ]
  }
)
