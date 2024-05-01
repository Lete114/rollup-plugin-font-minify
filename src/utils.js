/**
 * Check if the file is a font file (by file extension)
 * @param { string } fileName file name
 * @returns is font
 */
export function isFontFileByExtension(fileName) {
  return /\.(ttf|woff|woff2|otf|eot)$/i.test(fileName)
}

const numberFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

/**
 * calculation of size
 * @param { number } byte
 * @returns display size
 */
export function displaySize(byte) {
  const ONE_MILLION = 1000000
  const ONE_THOUSAND = 1000

  if (byte >= ONE_MILLION) {
    const size = `${numberFormatter.format(byte / ONE_MILLION)} MB`
    return size
  }

  return `${numberFormatter.format(byte / ONE_THOUSAND)} kB`
}

export const color = {
  /**
   * @param { string } string
   * @returns color string
   */
  red(string) {
    return `\x1B[31m${string}\x1B[39m`
  },
  /**
   * @param { string } string
   * @returns color string
   */
  green(string) {
    return `\x1B[32m${string}\x1B[39m`
  },
  /**
   * @param { string } string
   * @returns color string
   */
  blue(string) {
    return `\x1B[34m${string}\x1B[39m`
  },
  /**
   * @param { string } string
   * @returns color string
   */
  yellow(string) {
    return `\x1B[33m${string}\x1B[39m`
  },
  /**
   * @param { string } string
   * @returns color string
   */
  cyan(string) {
    return `\x1B[36m${string}\x1B[39m`
  },
}
