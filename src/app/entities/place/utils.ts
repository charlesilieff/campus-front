export const toBase64 = (file: File, cb: (v: string) => void) => {
  const fileReader: FileReader = new FileReader()
  fileReader.readAsDataURL(file)
  fileReader.onload = e => {
    // @ts-expect-error normal
    const base64Data = e.target['result'].toString().substr(
      // @ts-expect-error normal
      e.target['result'].toString().indexOf('base64,') + 'base64,'.length
    )
    cb(base64Data)
  }
}
export const setFileData = (
  event: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
  callback: (type: string, v: string) => void
) => {
  const target = event?.target
  if (target && target.files && target.files[0]) {
    const file = target.files[0]

    toBase64(file, base64Data => {
      callback(file.type, base64Data)
    })
  } else {
    callback('', '')
  }
}
export const openFile = (contentType: string, data: string) => () => {
  const fileURL = `data:${contentType};base64,${data}`
  const win = window.open()
  if (win) {
    win.document.write(
      '<iframe src="'
        + fileURL
        + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
    )
  }
}
const paddingSize = (value: string): number => {
  if (value.endsWith('==')) {
    return 2
  }
  if (value.endsWith('=')) {
    return 1
  }
  return 0
}
const formatAsBytes = (sizeValue: number): string =>
  sizeValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes'
export const size = (value: string): number => (value.length / 4) * 3 - paddingSize(value)
export const byteSize = (base64String: string) => formatAsBytes(size(base64String))
