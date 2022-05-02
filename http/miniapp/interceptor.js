// interceptor
class Interceptor {
    constructor() {
        this.requetInterceptors = []
        this.responseInterceptors = []
    }

    /**
     * 快捷组测
     * @param {[{request, response}]} options 
     */
    use(options) {
        options.forEach(option => {
          this.useRequestInterceptor(option.request)
          this.useResponseInterceptor(option.response)
        })

        return [this.requetInterceptors, this.responseInterceptors]
    }


    /**
     * 注销拦截器
     * @param {*} requestId 请求拦截器索引
     * @param {*} responseId 响应拦截器索引
     */
    eject(requestId, responseId) {
        if (typeof requestId === 'number') {
            this.requetInterceptors[requestId] = undefined
        }
        if (typeof responseId === 'number') {
            this.responseInterceptors[responseId] = undefined
        }
    }

    /**
     * 
     * @param {*} option
     */
    modify(option) {
        if (option && typeof option.interceptor == 'function') {
            if (option.type === 'request') {
                this.requetInterceptors[id] = option.interceptor
            } else {
                this.responseInterceptors[id] = option.interceptor
            }
        }
    }

    /**
     * 单独注册请求拦截
     * @param { Array | Function } interceptor fn1, fn2...
     */
    useRequestInterceptor(interceptor) {
        const interceptors = Array.prototype.slice.call(arguments);
        if (this.checkType(interceptors)) {
            this.registerInterceptors('request', interceptors);
        } else {
            throw new TypeError('we expect Function of Array <Function>')
        }
        return  interceptors
    }

    /**
     * 单独注册响应拦截
     * @param { Array | Function } interceptor fn1, fn2...
     */
    useResponseInterceptor(interceptor) {
        const interceptors = Array.prototype.slice.call(arguments);
        if (this.checkType(interceptors)) {
            this.registerInterceptors('response', interceptors);
        } else {
            throw new TypeError('we expect Function of Array <Function>')
        }
        return  interceptors
    }

    /**
     * 注册拦截器统一方式
     * @param { String }  type request | response
     * @param { Array } interceptors [ [fn1, fn2] ] | [ fn1, fn2 ]
     */
    registerInterceptors(type, interceptors) {
        for (let i = 0, ii = interceptors.length; i < ii; i++) {
            const interceptor = interceptors[i]
            if (interceptor instanceof Array) {
                this.registerInterceptors(type, interceptor)
            } else if (type === 'request') {
                this.requetInterceptors.push(interceptor)
            } else if (type === 'response') {
                this.responseInterceptors.push(interceptor)
            }
        }
    }
    
    /**
     * 检查当前要注册的拦截器， 注销的是之前已经注册过的
     * @param {*} val 
     * @returns 
     */
    checkType(val) {
        let pass = false
        if (typeof val === 'function' ) {            
            pass = true
        } else if (val instanceof Array) {
            pass = val.length ? val.every(v => this.checkType(v)) : false
        } else {
            pass = false
        }
        return pass
    }

    logger() {
        console.log('Interceptor', this)
    }
}

export default Interceptor