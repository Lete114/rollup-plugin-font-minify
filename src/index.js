import { parse } from 'node:path'
import fontMinify from 'font-minify'
import { color, displaySize, isFontFileByExtension } from './utils.js'

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

// eslint-disable-next-line no-console
const logger = console.log

/**
 *
 * @param { Options } options
 * @returns { Plugin } rollup plugin
 */
export default (options = {}) => {
  const name = 'rollup-font-minify'

  options = Object.assign({}, defaultOptions, options)

  let { reserveText, filter } = options

  return {
    name,
    async generateBundle(_, /** @type { OutputBundle } */ bundle) {
      const files = []
      const sizes = []

      for (const [fileName, output] of Object.entries(bundle)) {
        if (!isFontFileByExtension(fileName)) {
          files.push(fileName)
          if (output.code) {
            reserveText += output.code
          }
          if (output.source) {
            reserveText += output.source
          }
        }
        else {
          sizes.push(displaySize(output.code?.length || output.source?.length))
        }
      }

      const maxFileNameWidth = Math.max(...files.map(key => key.length)) + 6
      const maxSizeWidth = Math.max(...sizes.map(key => key.length))

      // filter text
      if (typeof filter === 'function') {
        const result = filter(reserveText)
        if (typeof result === 'string') {
          reserveText = result
        }
        else {
          const msg = color.yellow('[skip] The return value of the filter function must be of type string.')
          logger(msg)
        }
      }

      logger(color.cyan(`\n\u2728 [${name}]`), '- compressed font resource result: ')

      for (const [fileName, output] of Object.entries(bundle)) {
        if (isFontFileByExtension(fileName)) {
          let { base, ext } = parse(fileName)
          ext = ext.replace('.', '')
          if (ext === 'otf') {
            logger(color.yellow('[skip] not support font type "otf"'))
            continue
          }
          
          const originSize = displaySize(output.source.length)

          const filePH = Array.from({ length: Math.max(maxFileNameWidth - base.length + 1) }).join(' ')
          const sizePH = Array.from({ length: Math.max(maxSizeWidth - originSize.length + 1) }).join(' ')

          try {
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

            const size = displaySize(buffer.length)

            logger(`   [${color.blue(base)}] ${filePH} ${color.yellow(originSize)}${sizePH} ---> ${color.green(size)}`)

            output.source = buffer
          }
          catch (error) {
            logger(`   [${color.blue(base)}] ${filePH} ${color.red(error.message)}`)
          }
        }
      }
    },
  }
}
