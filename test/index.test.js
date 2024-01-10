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
          "hash": "485be4c26a97e1252b597a7addde87439c70c21fb7d2ff86d34111805c8a4d11",
          "name": "assets/SmileySans-Oblique-5eb23155.eot",
          "size": "9.94 kB",
        },
        {
          "hash": "43bee61ae0f9442d375c02b7d8f16adebf4705c381324fdf2104e66fc966554d",
          "name": "assets/SmileySans-Oblique-74237fa4.woff2",
          "size": "4.79 kB",
        },
        {
          "hash": "5344bc8553c47356ad8851868501c28dc0aec38057d2a988186f0a08c7ff9a1f",
          "name": "assets/SmileySans-Oblique-19b76555.woff",
          "size": "9.81 kB",
        },
        {
          "hash": "45f3051985c856de9f7d85a71053406b358ddbf86f83b284f5767b2f0a0d1d07",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "9.74 kB",
        },
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
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
          "hash": "485be4c26a97e1252b597a7addde87439c70c21fb7d2ff86d34111805c8a4d11",
          "name": "assets/SmileySans-Oblique-5eb23155.eot",
          "size": "9.94 kB",
        },
        {
          "hash": "43bee61ae0f9442d375c02b7d8f16adebf4705c381324fdf2104e66fc966554d",
          "name": "assets/SmileySans-Oblique-74237fa4.woff2",
          "size": "4.79 kB",
        },
        {
          "hash": "5344bc8553c47356ad8851868501c28dc0aec38057d2a988186f0a08c7ff9a1f",
          "name": "assets/SmileySans-Oblique-19b76555.woff",
          "size": "9.81 kB",
        },
        {
          "hash": "45f3051985c856de9f7d85a71053406b358ddbf86f83b284f5767b2f0a0d1d07",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "9.74 kB",
        },
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
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
          "hash": "53111d5c4291d640d4d4f73573cd7cfd4ee26ef6954d154fbe23a75efd7979fe",
          "name": "assets/SmileySans-Oblique-5eb23155.eot",
          "size": "3.57 kB",
        },
        {
          "hash": "d5bccf5d8715dedd2c9d55e4167fc8277ac94199f79c3c981f505950fb1c4610",
          "name": "assets/SmileySans-Oblique-74237fa4.woff2",
          "size": "1.30 kB",
        },
        {
          "hash": "d94b2fddb926d7aedf900e9a22875235bb29f0c91fab50dce5052c78025753ec",
          "name": "assets/SmileySans-Oblique-19b76555.woff",
          "size": "3.44 kB",
        },
        {
          "hash": "658ae1befb2ee7a9a56fa800d8573c8d398ed53b122bfbc614d3dfd90a786921",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "3.36 kB",
        },
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
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
          "hash": "7f1cf943a4d3b7f8768cc74ecc58ebb5e6e26e8b920bde1b98f5cd9496d2c536",
          "name": "assets/SmileySans-Oblique-5eb23155.eot",
          "size": "3.89 kB",
        },
        {
          "hash": "65e09c9c57caee8222db99a121ce2603b1fe94269ad2d853fe5e2e231254945c",
          "name": "assets/SmileySans-Oblique-74237fa4.woff2",
          "size": "1.52 kB",
        },
        {
          "hash": "e2c79797bd938705078d7ea1993d8a617edb1b958fbc6710661dc80bd4f5c7e1",
          "name": "assets/SmileySans-Oblique-19b76555.woff",
          "size": "3.76 kB",
        },
        {
          "hash": "b0aed3beb8608368f94af2d4524c36c22eb23154993c8b07033891716c513807",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "3.69 kB",
        },
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
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
          "hash": "80a8e49d006edaef57d4f347184699195c10e09bbb34037667b3bd8a19487d00",
          "name": "assets/SmileySans-Oblique-5eb23155.eot",
          "size": "11.79 kB",
        },
        {
          "hash": "2a18c149c4c5dbeea01f49cc42d35b781b090c70314f6e85095a2a376e4a72d3",
          "name": "assets/SmileySans-Oblique-74237fa4.woff2",
          "size": "6.00 kB",
        },
        {
          "hash": "b9e64f455dbb664473608f93f4606f88e26c03b7f6ce08d58340befd33a65283",
          "name": "assets/SmileySans-Oblique-19b76555.woff",
          "size": "11.66 kB",
        },
        {
          "hash": "a87ff822017ed12948e6c548e019ce7d6130996af9b3f41a16ea22dc8edb394a",
          "name": "assets/SmileySans-Oblique-b1997b28.ttf",
          "size": "11.58 kB",
        },
        {
          "hash": "4c3e31d8b022113ad6784e560a8672be982e9ee197a36996b0d7887a71d6cb12",
          "name": "assets/SmileySans-Oblique-115260f7.otf",
          "size": "1.63 MB",
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
