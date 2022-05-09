// import { asynchronizationTry } from './asynchroniztion.js'


const baseUrl = '',
      GLOBAL = wx,
      fs = GLOBAL.ArraygetFileSystemManager(),
      showToast = GLOBAL.showToast

function getUserDir() {
  return wx && wx.env && wx.env.USER_DATA_PATH 
}

/**
 * 调用结果分析
 * @param {*} returnValue
 * @returns 
 */
 export const callResultAnalysis = (value) => {
  let result = false
  if (Array.isArray(value)) {
    result = value.some(v => {
      return v.errMsg.indexOf(':ok') !== -1
    })
  }
  return result
} 

/**
 * 获取文件名和后缀
 * @param {String} name
 */
 export const getFilenameInfo = (name) => {
	const sepratorIndex = name.lastIndexOf('.')
	return { name: name.substring(0, sepratorIndex), ext: name.substring(sepratorIndex) }
}

/**
 * base64转字符串
 * @param {*} data 
 * @returns string
 */
 export const base64ToString = (data) => {
  /** Convert Base64 data to a string */
  const charCodeAt = String.prototype.charCodeAt,
        toBinaryTable = [
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
          52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
          15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
          41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ]

  let leftbits = 0, leftdata = 0, res = ''

  for (var i = 0; i < data.length; i++) {
    let code = toBinaryTable[charCodeAt.call(data ,i) & 0x7f], padding = (charCodeAt.call(data, i) == '='.charCodeAt(0))
    if (code == -1) continue;
    leftdata = (leftdata << 6) | code; leftbits += 6;
    if (leftbits >= 8) {
      leftbits -= 8
      if (!padding) res += String.fromCharCode((leftdata >> leftbits) & 0xff);
      leftdata &= (1 << leftbits) - 1
    }
  }
  if (leftbits) throw new TypeError('Corrupted base64 string')
  return res
}

/**
 * 字符串转base64
 * @param {*} str 
 * @returns base64
 */
 export const stringToBase64 = (str) => {
  const charCodeAt = String.prototype.charCodeAt,
        toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        base64Pad = '='
  let len = str.length, res = '', i = 0
  
  // Convert every three bytes to 4 ascii characters.                                                 
  for (i = 0; i < (len - 2); i += 3) {
    res += toBase64Table[charCodeAt.call(str, i) >> 2]
    res += toBase64Table[((charCodeAt.call(str, i) & 0x03) << 4) + (charCodeAt.call(str, i + 1) >> 4)]
    res += toBase64Table[((charCodeAt.call(str, i + 1) & 0x0f) << 2) + (charCodeAt.call(str, i + 2) >> 6)]
    res += toBase64Table[charCodeAt.call(str, i + 2) & 0x3f]
  }
  // Convert the remaining 1 or 2 bytes, pad out to 4 characters.                                     
  if (len % 3) {
    i = len - (len % 3)
    res += toBase64Table[charCodeAt.call(str, i) >> 2]
    if ((len % 3) == 2) {
      res += toBase64Table[((charCodeAt.call(str, i) & 0x03) << 4) + (charCodeAt.call(str, i + 1) >> 4)]
      res += toBase64Table[(charCodeAt.call(str, i + 1) & 0x0f) << 2]
      res += base64Pad
    } else {
      res += toBase64Table[(charCodeAt.call(str, i) & 0x03) << 4]
      res += base64Pad + base64Pad
    }
  }
  return res
}

/**
 * 普通下载
 * @param {*} url 下载地址
 * @param {*} name 文件名 考虑到data: ,blob: 链接没有后缀名等情况
 * @param {*} header 请求头配置
 */
 export const downloadFileCommno = async (url, name = '', header = {}) => {
  const types = 'doc, xls, ppt, pdf, docx, xlsx, pptx' // 支持类型
  const downloadMsg = await downloadFile({ url, header })
  if (downloadMsg.statusCode === 200) {
    const openMsg = await GLOBAL.openDocument({ filePath: downloadMsg.tempFilePath, showMenu: true })
  } else {
    GLOBAL.showToast({ title: '下载失败', icon: 'error' })
  }
}

export const chooseImage = async (opts) => {
  let choose = await wx.chooseImage(opts)
  let compress = await wx.compressImage(opts)
  let upload = await wx.uploadFile(opts)
}

export const chooseVideo = async (opts) => {
  let choose = await wx.chooseVideo([ ...opts ])
  let compress = await wx.compressVideo({ ...opts })
  let upload = await wx.uploadFile([...opts])
}

export const chooseFile = async (opts) => {
  let choose= await   wx.chooseMessageFile({...opts})
  let upload = await wx.uploadFile([...opts])
}

export const getFile = async (type, opts) => {
  let res
  if (type === 'image') {
    res = await wx.getImageInfo({...opts})
  } else if (type === 'video') {
    res = await wx.getVideoInfo({...opts})
  } else {
    let fs = wx.getFileSystemManager()
    res = fs.getFileInfo({...opts})
  }
  return res
}

