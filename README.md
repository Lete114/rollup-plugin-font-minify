# rollup-plugin-font-minify

Remove unused font glyphs from the project during packaging to reduce font file size

## Install

Using npm:

```bash
npm install rollup-plugin-font-minify --save-dev
```

## Usage

If you are using [rollup](https://www.rollupjs.org)

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
// rollup.config.js
import fontmin from 'rollup-plugin-font-minify'

export default {
  input: 'src/index.js',
  output: {
    // ...
  },
  plugins: [fontmin()]
}
```

If you are using [vite](https://vitejs.dev)

Create a `vite.config.js` [configuration file](https://vitejs.dev/config/) and import the plugin:

```js
// vite.config.js
import fontmin from 'rollup-plugin-font-minify'

export default {
  plugins: [fontmin()]
}
```

## Options

### `reserveText`

Type: `String`<br>
Default: `''`

Text to be reserved.<br>
This option can be used in certain scenarios where data obtained by sending a request needs to be displayed on the page and fonts are used.<br>
The reserved font glyphs you specify will be retained during packaging.

### `filter`

Type: `(text: string) => string`<br>
Default: `null`

Filter text to keep only what is needed

This is an example: compress only specified characters, e.g. only [CJK](https://wikipedia.org/wiki/CJK_characters) (CJK Unified Ideographs) characters

```js
function getCJK(str) {
  const reg = /[\u4E00-\u9FA5\u3040-\u30FF\u31F0-\u31FF\uFF00-\uFF9F\u3000-\u303F\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF60\uFFE0-\uFFE6]/g
  const cjkChars = str.match(reg)
  return cjkChars ? cjkChars.join('') : ''
}

plugins: [
  fontmin({
    filter(text) {
      return getCJK(text)
    }
  })
]
```

## Meta

[LICENSE (MIT)](/LICENSE)
