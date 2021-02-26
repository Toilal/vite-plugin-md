import type { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import {UserOptions} from './types'
import { renderFactory } from './render'
import { resolveOptions } from './options'

function VitePluginRender(userOptions: UserOptions = {} as UserOptions): Plugin {
  const options = resolveOptions(userOptions)
  const render = renderFactory(options)

  const filter = createFilter(
      options.include,
      options.exclude
  )

  return {
    name: 'vite-plugin-render',
    enforce: 'pre',
    transform(raw, id) {
      if (!filter(id)) {
        return
      }
      return render(id, raw)
    },
    async handleHotUpdate(ctx) {
      if (!filter(ctx.file)) {
        return
      }
      const defaultRead = ctx.read
      ctx.read = async function() {
        return render(ctx.file, await defaultRead())
      }
    },
  }
}

export default VitePluginRender
