# vite-plugin-render

Vite plugin to render any file to a component

- Render any file as Vue components
- Use Vue components inside those template files

This is a fork of [@antfu](https://github.com/antfu) [vite-plugin-md](https://github.com/antfu/vite-plugin-md) that 
extracts the Markdown parts to an external render function. Many thanks for his work !

[![NPM version](https://img.shields.io/npm/v/vite-plugin-render?color=a1b858)](https://www.npmjs.com/package/vite-plugin-render)

## Install

Install

```bash
npm i vite-plugin-render -D # yarn add vite-plugin-render -D
```

Add it to `vite.config.js`, and configure the render function and file patterns includes you need.

Here's an example for Markdown using [markdown-it](https://github.com/markdown-it/markdown-it) as the renderer on 
`*.md` files, but you can adjust to any template engine.

```ts
// vite.config.js
import Render from 'vite-plugin-render'
const MarkdownIt = require('markdown-it')

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

export default {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/], // <--
    }),
    Render({
      include: [/\.md$/],
      render: (content: string) => {
          return markdown.render(content)
      }
    }),
  ],
}
```

And import it as a normal Vue component

## Import any file as Vue components

```html
<template>
  <HelloWorld />
</template>

<script>
import HelloWorld from './README.md'

export default {
  components: {
    HelloWorld,
  },
}
</script>
```

## Use Vue Components inside source file

You can even use Vue components inside your source file, for example

```html
<Counter :init='5'/>
```

<Counter :init='5'/>

Note you can either register the components globally, or use the `<script setup>` tag to register them locally.

```ts
import { createApp } from 'vue'
import App from './App.vue'
import Counter from './Counter.vue'

const app = createApp(App)

// register global
app.component('Counter', Counter) // <--

app.mount()
```

```html
<script setup>
import { Counter } from './Counter.vue
</script>

<Counter :init='5'/>
```

Or you can use [`vite-plugin-components`](#work-with-vite-plugin-components) for auto components registration.

## Frontmatter

Frontmatter will be parsed and inject into Vue's instance data `frontmatter` field. 

For example:

```md
---
name: My Cool App
---

# Hello World

This is {{frontmatter.name}}
```

Will be rendered as

```html
<h1>Hello World</h1>
<p>This is My Cool App</p>
```

It will also be passed to the wrapper component's props if you have set `wrapperComponent` option.

## Document head and meta

To manage document head and meta, you would need to install [`@vueuse/head`](https://github.com/vueuse/head) and do some setup.

```bash
npm i @vueuse/head
```

```js
// vite.config.js
import Vue from '@vitejs/plugin-vue'
import Render from 'vite-plugin-render'

export default {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Render({
      headEnabled: true // <--
    })
  ]
}
```

```js
// src/main.js
import { createApp } from 'vue'
import { createHead } from '@vueuse/head' // <--

const app = createApp(App)

const head = createHead() // <--
app.use(head) // <--
```

Then you can use frontmatter to control the head. For example:

```yaml
---
title: My Cool App
meta:
  - name: description
    content: Hello World
---
```

For more options available, please refer to [`@vueuse/head`'s docs](https://github.com/vueuse/head).

## Options

```ts
// vite.config.js
import Render from 'vite-plugin-render'
const MarkdownIt = require('markdown-it')

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

export default {
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/], // <--
    }),
    Render({
      include: [/\.md$/],
      render: (content: string) => {
          return markdown.render(content)
      },
      // Class names for the wrapper div
      wrapperClasses: 'markdown-body'
    }),
  ],
}
```

See [the tsdoc](./src/types.ts) for more advanced options

## Example

See the [/example](./example).

Or the pre-configured starter template [Vitesse](https://github.com/antfu/vitesse).

## Integrations

### Work with [vite-plugin-voie](https://github.com/vamplate/vite-plugin-voie)

```ts
// vite.config.js
import Render from 'vite-plugin-render'
import Voie from 'vite-plugin-voie'
const MarkdownIt = require('markdown-it')

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

export default {
  plugins: [
    Voie({
      extensions: ['vue', 'md'],
    }),
    Render({
      include: [/\.md$/],
      render: (content: string) => {
          return markdown.render(content)
      },
      // Class names for the wrapper div
      wrapperClasses: 'markdown-body'
    }),
  ],
}
```

Put your markdown under `./src/pages/xx.md`, then you can access the page via route `/xx`.


### Work with [vite-plugin-components](https://github.com/antfu/vite-plugin-components)

`vite-plugin-components` allows you to do on-demand components auto importing without worrying about registration.

```ts
// vite.config.js
import Render from 'vite-plugin-render'
import ViteComponents from 'vite-plugin-components'
const MarkdownIt = require('markdown-it')

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

export default {
  plugins: [
    Render({
      include: [/\.md$/],
      render: (content: string) => {
          return markdown.render(content)
      }
    }),
    // should be placed after `Markdown()`
    ViteComponents({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      customLoaderMatcher: path => path.endsWith('.md'),
    })
  ],
}
```

Components under `./src/components` can be directly used in markdown components, and markdown components can also be put under `./src/components` to be auto imported.

## TypeScript Shim

```ts
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

declare module '*.md' {
  import { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}
```

## License

MIT License © 2020 [Anthony Fu](https://github.com/antfu)
