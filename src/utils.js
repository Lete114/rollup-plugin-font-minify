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
