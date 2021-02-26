import { preprocessHead } from './head'
import { Options, ResolvedOptions } from './types'
import { toArray } from './utils'

export function resolveOptions(userOptions: Options): ResolvedOptions {
  if (Object.keys(userOptions).length == 0) {
    throw new Error('[vite-plugin-render] `include` and `render` are mandatory options.')
  }

  if (!userOptions.include) {
    throw new Error('[vite-plugin-render] `include` is a mandatory option.')
  }

  if (!userOptions.render) {
    throw new Error('[vite-plugin-render] `render` is a mandatory option.')
  }

  const options = Object.assign({
    headEnabled: false,
    headField: '',
    customSfcBlocks: ['route', 'i18n'],
    wrapperClasses: 'render-body',
    wrapperComponent: null,
    transforms: {},
    frontmatterPreprocess: (frontmatter: any, options: ResolvedOptions) => {
      const head = preprocessHead(frontmatter, options)
      return { head, frontmatter }
    },
  }, userOptions) as ResolvedOptions

  options.wrapperClasses = toArray(options.wrapperClasses).filter(i => i).join(' ')

  return options
}
