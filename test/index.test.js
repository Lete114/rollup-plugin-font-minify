import { fileURLToPath } from 'node:url'
import { dirname, extname, join } from 'node:path'
import crypto from 'node:crypto'
import { Font } from 'fonteditor-core'
import { describe, expect, it } from 'vitest'
import { rollup } from 'rollup'
import styles from 'rollup-plugin-styles'
import fontmin from '../src/index.js'
import { displaySize, isFontFileByExtension } from '../src/utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getExt(path, rmDot) {
  const ext = extname(path)
  return rmDot ? ext.replace('.', '') : ext
}

/**
 * @param { import('fonteditor-core').TTF.TTFObject } font
 * @param { string } str
 */
function isIncludesGlyf(font, str) {
  const array = ['.notdef', ...str.split('')].sort()
  const glyfs = font.glyf.map(item => item.name).sort()
  return array.length === glyfs.length && array.every((value, index) => value === glyfs[index])
}

function getHash(buffer) {
  return crypto.createHash('sha256')
    .update(buffer)
    .digest('hex')
}

const input = join(__dirname, './fixtures/index.js')
const stylesPlugin = styles({ url: { inline: false } })

describe('basic', () => {
  it('default', async () => {
    const bundle = await rollup({
      input,
      plugins: [
        fontmin(),
        stylesPlugin,
      ],
    })
    const { output } = await bundle.generate({ format: 'umd' })
    const info = output.find(item => isFontFileByExtension(item.fileName))

    expect(displaySize(info.source.length)).toMatchInlineSnapshot(`"9.23 kB"`)
    expect(getHash(info.source)).toMatchInlineSnapshot(`"f0f13d957758067a59400a55ea21d929cbf001789c059568b35729c154351f8e"`)
  })

  it('reserveText basic', async () => {
    const str = 'a'

    const bundle = await rollup({
      input,
      plugins: [
        fontmin({
          reserveText: str,
        }),
        stylesPlugin,
      ],
    })
    const { output } = await bundle.generate({ format: 'umd' })
    const info = output.find(item => isFontFileByExtension(item.fileName))

    expect(getHash(info.source)).toMatchInlineSnapshot(`"f0f13d957758067a59400a55ea21d929cbf001789c059568b35729c154351f8e"`)
  })

  it('filter basic', async () => {
    const str = 'a'

    const bundle = await rollup({
      input,
      plugins: [
        fontmin({
          filter() { return str },
        }),
        stylesPlugin,
      ],
    })
    const { output } = await bundle.generate({ format: 'umd' })
    const info = output.find(item => isFontFileByExtension(item.fileName))
    const font = Font.create(info.source, { type: getExt(info.fileName, true) })

    const fontObject = font.get()
    const isInclude = isIncludesGlyf(fontObject, str)
    expect(isInclude).toBeTruthy()

    expect(getHash(info.source)).toMatchInlineSnapshot(`"658ae1befb2ee7a9a56fa800d8573c8d398ed53b122bfbc614d3dfd90a786921"`)
  })

  it('filter out-order', async () => {
    const str = 'acdb'

    const bundle = await rollup({
      input,
      plugins: [
        fontmin({
          filter() { return str },
        }),
        stylesPlugin,
      ],
    })

    const { output } = await bundle.generate({ format: 'umd' })
    const info = output.find(item => isFontFileByExtension(item.fileName))
    const font = Font.create(info.source, { type: getExt(info.fileName, true) })

    const fontObject = font.get()
    const isInclude = isIncludesGlyf(fontObject, str)
    expect(isInclude).toBeTruthy()

    expect(getHash(info.source)).toMatchInlineSnapshot(`"b0aed3beb8608368f94af2d4524c36c22eb23154993c8b07033891716c513807"`)
  })

  it('filter and reserveText', async () => {
    const str = '这代码写得很优雅 :)'

    const bundle = await rollup({
      input,
      plugins: [
        fontmin({
          reserveText: str,
          filter(text) { return text },
        }),
        stylesPlugin,
      ],
    })

    const { output } = await bundle.generate({ format: 'umd' })
    const info = output.find(item => isFontFileByExtension(item.fileName))

    expect(displaySize(info.source.length)).toMatchInlineSnapshot(`"11.08 kB"`)
    expect(getHash(info.source)).toMatchInlineSnapshot(`"6ff1689b8652f28a58a8177120e1bb9a941475ee6739abc5c4a56e2b9ea47c1f"`)
  })

  it('filter CJK (CJK Unified Ideographs)', async () => {
    function getCJK(str) {
      const reg = /[\u4E00-\u9FA5\u3040-\u30FF\u31F0-\u31FF\uFF00-\uFF9F\u3000-\u303F\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF60\uFFE0-\uFFE6]/g
      const cjkChars = str.match(reg)
      return cjkChars ? cjkChars.join('') : ''
    }

    const bundle = await rollup({
      input,
      plugins: [
        fontmin({
          filter(text) { return getCJK(text) },
        }),
        stylesPlugin,
      ],
    })

    const { output } = await bundle.generate({ format: 'umd' })
    const info = output.find(item => isFontFileByExtension(item.fileName))

    expect(displaySize(info.source.length)).toMatchInlineSnapshot(`"2.07 MB"`)
    expect(getHash(info.source)).toMatchInlineSnapshot(`"b2f5e81e9f950701b19cc558b5ea452169cb0bf266fd2a9d7d4ab7a2b3376f4c"`)
  })
})
