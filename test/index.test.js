import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import crypto from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { rollup } from 'rollup'
import styles from 'rollup-plugin-styles'
import fontMinify from '../src/index.js'
import { displaySize, isFontFileByExtension } from '../src/utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getHash(buffer) {
  return crypto.createHash('sha256')
    .update(buffer)
    .digest('hex')
}

/**
 *
 * @param { {size:string;hash:string} } infos
 * @returns array
 */
function getSizeAndHash(infos) {
  const result = []
  for (const info of infos) {
    const size = displaySize(info.source.length)
    const hash = getHash(info.source)
    result.push({ size, hash, name: info.fileName })
  }

  return result
}

const input = join(__dirname, './fixtures/index.js')
const stylesPlugin = styles({ url: { inline: false } })

describe('basic', () => {
  it('default', async () => {
    const bundle = await rollup({
      input,
      plugins: [
        fontMinify(),
        stylesPlugin,
      ],
    })
    const { output } = await bundle.generate({ format: 'umd' })
    const infos = output.filter(item => isFontFileByExtension(item.fileName)).map(item => ({ source: item.source, fileName: item.fileName }))

    expect(getSizeAndHash(infos)).toMatchInlineSnapshot(`
      [
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
        },
        {
          "hash": "78e89cb1959182bff80420e9cb5831c88070658cd1ccc0a291ded5b552d486ee",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "9.38 kB",
        },
        {
          "hash": "9badb8fdac1a822143332e43c302945ff7e41ef319efbcf91bd363c22eac62c5",
          "name": "assets/SmileySans-Oblique.ttf-df33bc0f.woff2",
          "size": "4.65 kB",
        },
      ]
    `)
  })

  it('reserveText basic', async () => {
    const str = 'a'

    const bundle = await rollup({
      input,
      plugins: [
        fontMinify({
          reserveText: str,
        }),
        stylesPlugin,
      ],
    })
    const { output } = await bundle.generate({ format: 'umd' })
    const infos = output.filter(item => isFontFileByExtension(item.fileName)).map(item => ({ source: item.source, fileName: item.fileName }))

    expect(getSizeAndHash(infos)).toMatchInlineSnapshot(`
      [
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
        },
        {
          "hash": "78e89cb1959182bff80420e9cb5831c88070658cd1ccc0a291ded5b552d486ee",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "9.38 kB",
        },
        {
          "hash": "9badb8fdac1a822143332e43c302945ff7e41ef319efbcf91bd363c22eac62c5",
          "name": "assets/SmileySans-Oblique.ttf-df33bc0f.woff2",
          "size": "4.65 kB",
        },
      ]
    `)
  })

  it('filter basic', async () => {
    const str = 'a'

    const bundle = await rollup({
      input,
      plugins: [
        fontMinify({
          filter() { return str },
        }),
        stylesPlugin,
      ],
    })
    const { output } = await bundle.generate({ format: 'umd' })
    const infos = output.filter(item => isFontFileByExtension(item.fileName)).map(item => ({ source: item.source, fileName: item.fileName }))

    expect(getSizeAndHash(infos)).toMatchInlineSnapshot(`
      [
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
        },
        {
          "hash": "658ae1befb2ee7a9a56fa800d8573c8d398ed53b122bfbc614d3dfd90a786921",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "3.36 kB",
        },
        {
          "hash": "d5bccf5d8715dedd2c9d55e4167fc8277ac94199f79c3c981f505950fb1c4610",
          "name": "assets/SmileySans-Oblique.ttf-df33bc0f.woff2",
          "size": "1.30 kB",
        },
      ]
    `)
  })

  it('filter out-order', async () => {
    const str = 'acdb'

    const bundle = await rollup({
      input,
      plugins: [
        fontMinify({
          filter() { return str },
        }),
        stylesPlugin,
      ],
    })

    const { output } = await bundle.generate({ format: 'umd' })
    const infos = output.filter(item => isFontFileByExtension(item.fileName)).map(item => ({ source: item.source, fileName: item.fileName }))

    expect(getSizeAndHash(infos)).toMatchInlineSnapshot(`
      [
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
        },
        {
          "hash": "b0aed3beb8608368f94af2d4524c36c22eb23154993c8b07033891716c513807",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "3.69 kB",
        },
        {
          "hash": "65e09c9c57caee8222db99a121ce2603b1fe94269ad2d853fe5e2e231254945c",
          "name": "assets/SmileySans-Oblique.ttf-df33bc0f.woff2",
          "size": "1.52 kB",
        },
      ]
    `)
  })

  it('filter and reserveText', async () => {
    const str = '这代码写得很优雅 :)'

    const bundle = await rollup({
      input,
      plugins: [
        fontMinify({
          reserveText: str,
          filter(text) { return text },
        }),
        stylesPlugin,
      ],
    })

    const { output } = await bundle.generate({ format: 'umd' })
    const infos = output.filter(item => isFontFileByExtension(item.fileName)).map(item => ({ source: item.source, fileName: item.fileName }))

    expect(getSizeAndHash(infos)).toMatchInlineSnapshot(`
      [
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
        },
        {
          "hash": "446be185a61f756ccbbd59a4214fbd76e4e2c4f75cd2347b8b18bfb8724f1279",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "11.22 kB",
        },
        {
          "hash": "250299dc49b56a3b42131af2932f83f5799dc961f20faacaf3a35c2e160f4f72",
          "name": "assets/SmileySans-Oblique.ttf-df33bc0f.woff2",
          "size": "5.80 kB",
        },
      ]
    `)
  })

  // it('filter CJK (CJK Unified Ideographs)', async () => {
  //   function getCJK(str) {
  //     const reg = /[\u4E00-\u9FA5\u3040-\u30FF\u31F0-\u31FF\uFF00-\uFF9F\u3000-\u303F\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF60\uFFE0-\uFFE6]/g
  //     const cjkChars = str.match(reg)
  //     return cjkChars ? cjkChars.join('') : ''
  //   }

  //   const bundle = await rollup({
  //     input,
  //     plugins: [
  //       fontMinify({
  //         filter(text) { return getCJK(text) },
  //       }),
  //       stylesPlugin,
  //     ],
  //   })

  //   const { output } = await bundle.generate({ format: 'umd' })
  //   const infos = output.filter(item => isFontFileByExtension(item.fileName)).map(item => ({ source: item.source, fileName: item.fileName }))

  //   expect(getSizeAndHash(infos)).toMatchInlineSnapshot(`
  //     [
  //       {
  //         "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
  //         "name": "assets/SmileySans-Oblique-115260f7.otf",
  //         "size": "1.63 MB",
  //       },
  //       {
  //         "hash": "b2f5e81e9f950701b19cc558b5ea452169cb0bf266fd2a9d7d4ab7a2b3376f4c",
  //         "name": "assets/SmileySans-Oblique-b1997b28.ttf",
  //         "size": "2.07 MB",
  //       },
  //       {
  //         "hash": "cbc3d9476a7db342b930c40e901c1bc165f3496cf677b3ac2abfec752aba0d6b",
  //         "name": "assets/SmileySans-Oblique.ttf-df33bc0f.woff2",
  //         "size": "935.16 kB",
  //       },
  //     ]
  //   `)
  // })
})
