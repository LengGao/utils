
/**
 * 通过Canvas下载图片pdf等，同时解决a标签点击事件被屏蔽问题
 * @param {
 *  url: 
 *  name, 
 *  type = 'image/png', 
 *  encoderOptions = 0.95, 
 *  crossOrigin = 'anonymous'
 * } opts  配置对象
 */
const downloadUseCanvas = (opts) => {
  const nameReg = /[A-z]+\:\/\/|\//i

  let { url, name, type = 'image/png', encoderOptions = 0.95, crossOrigin = 'anonymous' } = opts,
    a, canvas, image, event, filename = name

  if (!filename) filename = url.split(nameReg).pop()
  if (type.split('/').pop() !== filename.split('.').pop()) throw new Error('扩展名必须与类型一致');

  a = document.createElement('a')
  canvas = document.createElement('canvas')
  image = new Image()
  event = new MouseEvent('click')

  image.setAttribute('crossOrigin', crossOrigin)
  image.onload = function (ee) {
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    a.href = canvas.toDataURL(type, encoderOptions)
    a.download = filename // 必须同源
    a.dispatchEvent(event)
  }

  image.src = url
}

/**
 * 通过a标签下载 同事处理H5 a标签点击事件被屏蔽
 * a 的 download 属性一旦设置则必须采用同源策略，因此blob: 与 data: 类型Url则不设置 download
 * @param {*} url 
 * @param {*} name 
 */
const downloadUseA = (url, name = '') => {
  const nameReg = /[A-z]+\:\/\/|\//i,
    urlReg = /^data:|blob:/i,
    a = document.createElement('a'),
    e = new MouseEvent('click')

  if (!name) name = url.split(nameReg).pop()
  if (!url.match(urlReg)) a.download = name
  a.href = url
  a.dispatchEvent(e)
}

/**
 * 通过流来下载，请求后获取文件流，生成URl
 * @param {*} response 请求响应
 */
const downloadUseBlob = (response) => {
  let disposition = response.headers['content-disposition'],
    nameReg = /filename=([^;]+\\.[^\\.;]+);*/,
    filename = disposition.match(nameReg)[1],
    blob = new Blob(res.data.datq),
    link = URL.createObjectURL(blob)

  downloadUseA(link, filename)
}


export {
  downloadUseA,
  downloadUseBlob,
  downloadUseCanvas,
}