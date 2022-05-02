import Interceptor from './interceptor'

// bases-uytrew 
const BASE_URL = process.env.VUE_APP_BASE_URL,
      PREFIX = '',
      SUFFIX = '',
      GLOBAL = wx;


// main
class Request extends Interceptor {

    constructor() {
        super()
        this.__initConfig()
        this.__initInterceptors()
        this.isAbsolute = /^[a-z]+:\/\/\w+\.\w+/i
    }

    // 初始化拦截器
    __initInterceptors() {
        this.requetInterceptors = []
        this.responseInterceptors = []
    }

    // 初始化配置
    __initConfig() {
        this.$config = {
            prefix: PREFIX,
            suffix: SUFFIX,
            baseUrl: BASE_URL,
            confirm: false,
            toast: false,
            loading: false
        }
    }

    // 创建请求
    request(options) {
        let requetInterceptors = this.requetInterceptors,
            responseInterceptors = this.responseInterceptors,
            config = this.mergeConfig(options),
            promise = Promise.resolve(config);

        const forEach = (interceptors) => { 
            let len = interceptors.length, index = 0
            while (index < len) {
                let interceptor = interceptors[index++]
                if (interceptor) promise = promise.then(interceptor);
            }
        }
        
        forEach(requetInterceptors)
        promise = this.send(config)
        forEach(responseInterceptors)

        return promise
    }

    // 发送请求
    send(config) {
        console.log("config", config)
        return new Promise((resolve, reject) => {
            config.success = resolve
            config.fail = reject
            GLOBAL.request(config)
        })
    }

    // 合并配置
    mergeConfig(options) {
        let url = options.url, config = Object.assign(this.$config, options)
        if (!this.isAbsolute.test(url)) {
            config.url = config.baseUrl + config.prefix + url + config.suffix 
        }
        return config
    }
    
    getToken() {

    }

    setToken() {

    }
}

const request = new Request()

request.useRequestInterceptor(() => {

})
request.useRequestInterceptor(() => {
    console.log("useRequestInterceptor", this, request)
})


export default request.request.bind(request)