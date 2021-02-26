import { UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Render from 'vite-plugin-render'
const MarkdownIt = require('markdown-it')
import prism from 'markdown-it-prism'
import Pages from 'vite-plugin-pages'

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
markdown.use(prism)

const config: UserConfig = {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Render({
      include: [/\.md$/],
      render: (content) => {
        return markdown.render(content)
      },
      headEnabled: true
    }),
    Pages({
      pagesDir: 'pages',
      extensions: ['vue', 'md'],
    }),
  ],
}

export default config
