import { parse } from 'node:path'
import fontMinify from 'font-minify'
import { displaySize, isFontFileByExtension } from './utils.js'

/**
 * @callback FilterCallback
 * @param { string } text - The input text to be filtered
 * @returns { string } - The filtered text
 */

/**
 * @typedef {object} Options
 * @property { string= } reserveText reserved text
 * @property { FilterCallback= } filter Filter text to keep only what is needed
 */

/**
 * @typedef { import('rollup').Plugin } Plugin
 */
/**
 * @typedef { import('rollup').OutputBundle } OutputBundle
 */

/**
 * @type { Options }
 */
const defaultOptions = {
  reserveText: '',
}

/**
 *
 * @param { Options } options
 * @returns { Plugin } rollup plugin
 */
export default (options = {}) => {
  options = Object.assign({}, defaultOptions, options)

  let { reserveText, filter } = options

  return {
    name: 'rollup-font-minify',
    async generateBundle(_, /** @type { OutputBundle } */ bundle) {
      for (const [fileName, output] of Object.entries(bundle)) {
        if (!isFontFileByExtension(fileName)) {
          if (output.code) {
            reserveText += output.code
          }
          if (output.source) {
            reserveText += output.source
          }
        }
      }

      // filter text
      if (typeof filter === 'function') {
        const result = filter(reserveText)
        if (typeof result === 'string') {
          reserveText = result
        }
        else {
          this.warn(
            '[skip] The return value of the filter function must be of type string.',
          )
        }
      }

      for (const [fileName, output] of Object.entries(bundle)) {
        if (isFontFileByExtension(fileName)) {
          let { base, ext } = parse(fileName)
          ext = ext.replace('.', '')
          if (ext === 'otf') {
            this.warn('[skip] not support font type "otf"')
            continue
          }

          const buffer = await fontMinify({
            ...options,
            buffer: output.source,
            text: reserveText,
            readOptions: {
              type: ext,
            },
            writeOptions: {
              type: ext,
            },
          })

          const originSize = displaySize(output.source.length)
          const size = displaySize(buffer.length)
          this.warn(`[${base}] ${originSize} ---> ${size}`)

          output.source = buffer
        }
      }
    },
  }
}
