function dataURLToBlob(dataURL) {
  const [header, base64Data] = dataURL.split(',')
  const mimeType = header.match(/:(.*?);/)[1] // Extract MIME type (e.g., "image/jpeg")
  const binaryData = atob(base64Data) // Decode base64
  const byteArray = new Uint8Array(binaryData.length)
  for (let i = 0; i < binaryData.length; i++) {
    byteArray[i] = binaryData.charCodeAt(i)
  }
  return new Blob([byteArray], { type: mimeType })
}

export default dataURLToBlob