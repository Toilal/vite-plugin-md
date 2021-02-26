import type { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import { Options } from './types'
import { createMarkdown } from './markdown'
import { resolveOptions } from './options'

function VitePluginMarkdown(userOptions: Options = {}): Plugin {
  const options = resolveOptions(userOptions)
  const markdownToVue = createMarkdown(options)

  const filter = createFilter(
      options.include,
      options.exclude
  )

  return {
    name: 'vite-plugin-md',
    enforce: 'pre',
    transform(raw, id) {
      if (!filter(id)) {
        return
      }
      return markdownToVue(id, raw)
    },
    async handleHotUpdate(ctx) {
      if (!filter(ctx.file)) {
        return
      }
      const defaultRead = ctx.read
      ctx.read = async function() {
        return markdownToVue(ctx.file, await defaultRead())
      }
    },
  }
}

export default VitePluginMarkdown
