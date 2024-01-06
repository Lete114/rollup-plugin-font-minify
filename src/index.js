import Fontmin from 'fontmin'
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
export default function fontmin(options = {}) {
  options = Object.assign({}, defaultOptions, options)

  let { reserveText, filter } = options

  return {
    name: 'fontmin',
    async generateBundle(_, /** @type { OutputBundle } */ bundle) {
      for (const [fileName, output] of Object.entries(bundle)) {
        if (!isFontFileByExtension(fileName)) {
          if (output.code) { reserveText += output.code }
          if (output.source) { reserveText += output.source }
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

      const fontminPromises = []
      for (const [fileName, output] of Object.entries(bundle)) {
        if (isFontFileByExtension(fileName)) {
          const fontmin = new Fontmin().src(output.source)

          fontmin.use(Fontmin.glyph({ text: reserveText, hinting: false }))

          const fontminPromise = new Promise((resolve, reject) => {
            fontmin.run((err, file) => {
              if (err) {
                reject(err)
                return
              }

              const originSize = displaySize(output.source.length)
              const size = displaySize(file[0]._contents.length)
              this.warn(`${originSize} ---> ${size}`)

              output.source = file[0]._contents
              resolve(output)
            })
          })

          fontminPromises.push(fontminPromise)
        }
      }
      await Promise.all(fontminPromises)
    },
  }
}
