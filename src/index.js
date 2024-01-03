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
    generateBundle(_, /** @type { OutputBundle } */ bundle) {
      for (const [fileName, outuput] of Object.entries(bundle)) {
        if (!isFontFileByExtension(fileName)) {
          if (outuput.code)
            reserveText += outuput.code
          if (outuput.source)
            reserveText += outuput.source
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

      for (const [fileName, outuput] of Object.entries(bundle)) {
        if (isFontFileByExtension(fileName)) {
          const fontmin = new Fontmin().src(outuput.source)

          fontmin.use(Fontmin.glyph({ text: reserveText, hinting: false }))

          fontmin.run(async (err, file) => {
            if (err)
              this.error(err)

            const originSize = displaySize(outuput.source.length)
            const size = displaySize(file[0]._contents.length)
            this.warn(`${originSize} ---> ${size}`)

            outuput.source = file[0]._contents
          })
        }
      }
    },
  }
}
