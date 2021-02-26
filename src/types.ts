/* eslint-disable no-use-before-define */
export interface Options {
  /**
   * Filename regular expressions to include
   */
  include?: string | RegExp | (string | RegExp)[]
  /**
   * Filename regular expressions to exclude
   */
  exclude?: string | RegExp | (string | RegExp)[]

  /**
   * Enable head support, need to install @vueuse/head and register to App in main.js
   *
   * @default false
   */
  headEnabled?: boolean
  /**
   * The head field in frontmatter used to be used for @vueuse/head
   *
   * When an empty string is passed, it will use the root properties of the frontmatter
   *
   * @default ''
   */
  headField?: string

  /**
   * Remove custom SFC block
   *
   * @default ['route', 'i18n']
   */
  customSfcBlocks?: string[]

  /**
   * Custom function to process the frontmatter
   */
  frontmatterPreprocess?: (frontmatter: any, options: ResolvedOptions) => FrontmatterData

  /**
   * Render function
   *
   * @param content content
   * @param matterData data retrieve with gray-matter
   */
  render? (content: string, matterData?: { head: any, frontmatter: any }): string

  /**
   * Class names for wrapper div
   *
   * @default 'render-body'
   */
  wrapperClasses?: string | string[]
  /**
   * Component name to wrapper with
   *
   * @default undefined
   */
  wrapperComponent?: string | undefined | null
  /**
   * Custom tranformations apply before and after the rendering.
   */
  transforms?: {
    before?: (code: string, id: string) => string
    after?: (code: string, id: string) => string
  }
}

export type UserOptions = Options & Required<Pick<Options, "include" | "render">>

export interface ResolvedOptions extends Required<Options> {
  wrapperClasses: string
}

export interface FrontmatterData {
  head: any
  frontmatter: any
}
