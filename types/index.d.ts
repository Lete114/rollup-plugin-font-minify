/**
 *
 * @param { Options } options
 * @returns { Plugin } rollup plugin
 */
export default function fontmin(options?: Options): Plugin
export type FilterCallback = (text: string) => string
export interface Options {
  /**
   * reserved text
   */
  reserveText?: string | undefined
  /**
   * Filter text to keep only what is needed
   */
  filter?: FilterCallback | undefined
}
export type Plugin = import('rollup').Plugin
export type OutputBundle = import('rollup').OutputBundle
