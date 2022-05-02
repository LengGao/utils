if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    let p = this.constructor
    return this.then(
      value => p.resolve(callback()).then(() => value),
      reason => p.resolve(callback()).then(() => { throw reason })
    )
  }
}

/**
 * 获取API风格，这里只考虑当前页面的promise对象所以使用 instanceof Promise
 * @param {*} global 该i在了api的全局对象
 * @returns 结构对象
 */
const getApiStyle = (global) => {
  let promiseApi = [], callbackApi = []  
  for (let arr = Object.keys(global), i = arr.length - 1; i >= 0; i--) {    
    let key = arr[i], fn = global[key]
    if (typeof fn === 'function' && !key.endsWith('Sync')) {
      if (fn() instanceof Promise) {
        promiseApi.push(key)
      } else {
        callbackApi.push(key)
      }
    }
  }
  return { promiseApi, callbackApi }
}

/**
 * 异步化全局API，同步方法同步执行，异步方法异步执行，
 * ps: 小程序此方法作废，小程序同步方法被设置为了常量，没法被拦截，
 * @param {*} stack 异步化方法名栈
 * @param {*} global 携带API的全局对象
 */
const asynchronizationApis = (stack, global) => {  
  for (let i = stack.length - 1; i >= 0; i--) {
    let fn = global[i]
    global[i] = async (args) => fn(args)
  }
  return global
}

/**
 * 异步化函数
 * @param {*} fn 函数
 * @returns Promise
 */
const asynchronizationTry = async (fn) => {
  let args = [].slice.call(arguments, 1)
  return args.length ? fn.apply(this, args) : fn.call(this)
}

export {
  getApiStyle,
  asynchronizationApis,
  asynchronizationTry
}