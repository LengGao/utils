import Interceptor from './interceptor'
import { BASE_URL, GLOBAL } from './config'

class Service extends Interceptor {
    constructor() {
        super()
        this.__initConfig()
        this.__initInterceptors()
        this.isAbsolute = /^[a-z]+:\/\/\w+\.\w+/i
        this.$header = {}
        this.$requestTask = null
        this.rejectHandler = (e) => { throw e }
    }

    // 初始化拦截器
    __initInterceptors() {
        this.requetInterceptors = []
        this.responseInterceptors = []
    }

    // 初始化配置
    __initConfig() {
        this.$config = {
            prefix: '',
            suffix: '',
            baseUrl: BASE_URL,
            modal: false,
            toast: false,
            loading: false,
            header: this.$header
        }
    }

    /**
     * 创建请求
     * @param {\} options 用户输入请求配置
     * @returns promise 
     */
    request(options) {
        let requetInterceptors = this.requetInterceptors,
            responseInterceptors = this.responseInterceptors,
            rejectHandler = this.rejectHandler,
            config = this.mergeConfig(options),
            promise = Promise.resolve(config);

        // 小程序存在即便服务器返回非200状态码不执行fail的情况
        // interceptor为Function类型会被注入到then回调中所以xx.request响应状态会自动注入interceptor参数中
        const forEach = (interceptors) => {
            let len = interceptors.length
            while (len) {
                let interceptor = interceptors[--len]
                if (interceptor) promise = promise.then(interceptor, rejectHandler)
            }
        }

        forEach(requetInterceptors)
        promise = this.send(config)
        forEach(responseInterceptors)

        return promise
    }

    /**
     * 发送请求
     * @param {*} config 合并后的配置对象
     * @returns promise
     */
    send(config) {
        return new Promise((resolve, reject) => {
            config.success = resolve
            config.fail = reject
            this.$requestTask = GLOBAL.request(config)
        })
    }

    /**
     * 合并配置
     * @param {*} options 用户输入的配置对象
     * @returns 合并后的配置对象
     */
    mergeConfig(options) {
        // Object.assign(target, source) return target 故 config => this.$config
        let url = options.url, config = Object.assign(this.$config, options)
        if (!this.isAbsolute.test(url)) {
            config.url = config.baseUrl + config.prefix + url + config.suffix
        }
        return config
    }
    
    /**
     * 
     * @param {*} handler 
     */
    setRejectHandler(handler) {
        if (typeof header === 'function') {
            this.rejectInterceptor = handler
        } else {
            throw new TypeError('rejectHandler nust be a function')
        }
    }

    /**
     * 设置请求头
     * @param {*} options 用户传递的请求头配置
     */
    setHeader(options) {
        this.$header = options
        this.__initConfig()
    }

    // 获取请求头
    getHeader() {
        return this.$header
    }
}


export default Service
