// import WebService from './web'
import MiniService from './miniapp'
import { GLOBAL } from './config'
import { isObject } from './utils'

const service = new MiniService()

// 交互配置
const interactiveMap = {
  loading: { open: GLOBAL.showLoading, close: GLOBAL.hideLoading, option: { title: '加载中' } },
  toast: { open: GLOBAL.showToast, class: GLOBAL.hideToast, option: { title: '', icon: 'none', position: 'center' } },
  modal: { open: GLOBAL.showModal, option: { title: '', content: '' } },
}

/**
 * 基础请求栈
 */
service.useRequestInterceptor((config) => {
  const handler = (_config) => {
    let { loading, toast, modal } = _config
    let actions = { loading, toast, modal } // 同时控制着交互触发顺序
    for (let k in actions) {
      let action = actions[k]
      if (action && interactiveMap.hasOwnProperty(k)) {
        let interactive = interactiveMap[k]
        isObject(action)
          ? interactive.open(Object.assign(interactive.option, action))
          : interactive.open(interactive.option)
      }
    }
  }

  try {
    handler(config)
  } catch (e) {
    service.$requestTask.abort()
    throw e // 测试环境需要打印具体错误
  }

  return config
})


/**
 * 基础响应拦截
 */
service.useResponseInterceptor((response) => {
  if (!response) throw TypeError('response error: check your response')
  let { data } = response
  for (let k in interactiveMap) {
    interactiveMap[k].close && interactiveMap[k].close()
  }
  return data
})

/**
 * 用户自定义拦截器
 * 住：用户自定义拦截器不应该添加在基础拦截器之前，因为拦截器被设计为栈结构
 * 拦截完后需移交控制权给底部的拦截器，即return response || return config;
 * 栈底的拦截器会对response中的data做解构处理，解构处理所部不要在前面的拦截器里返回response.data做解构处理
 */
const responseStact = [
  {
    request: (config) => {
      // console.log('批量测试request', config);
      return config
    },
    response: (response) => {
      // console.log('批量测试response', response);
      return response
    }
  },
]

service.use(responseStact)

export default service.request.bind(service)