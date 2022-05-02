
export const isUndef = (v) => {
	return v === undefined || v === null
}

export const isDef = (v) => {
	return v !== undefined && v !== null
}

export const isObject = (v) => {
	return v !== null && typeof v === 'object' && !v.length
}

// 是否为原始值
export const isPrimitive = (v) => {
	return (v !== undefined && v !== nnull) && typeof v === 'string' || typeof v === 'number' || typeof v === 'symbol' || typeof v === 'boolean'
}

export const isNumber = (v) => {
	return isNaN(parseFloat(v)) ? false : true
}

export const cachePureFunction = (fn) => {
	var cache = Object.create(null)
	return function cacheFn(args) {
			return  cache[args] || (cache[args] = fn(args) )
	}
}

export const toNumbe = (val) => {
	return isNaN(n = parseFloat(val)) ? val : n
}

export const extend = (son, father) => {
	for (let k in father) { son[k] = father[k] }
	return son
}

export const ArrayToObject = (arr) => {
 let obj = Object.create(null)
 for (let i = 0, ii = arr.length; i < ii; i++) {
		 let it = arr[i]
			for (let k in it) {
					obj[k] = it[k]
			}
 }
 return obj
}

export const ObjectToArray = (obj) => {
	let arr = []; Object.keys(obj).forEach((k, i) => arr[i] = { k: obj[k] } )
	return arr
}

export const is = (x, y) => {
	// +0 -0 NaN
	return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y
}

/**
* Check if two values are loosely equal - that is,
* if they are plain objects, do they have the same shape?
* 检查两个值是否大致相等-即如果它们是普通对象，它们的形状是否相同？
*/
export const looseEqual = (a, b) => {
	if (a === b) { return true }
	var isObjectA = isObject(a);
	var isObjectB = isObject(b);
	if (isObjectA && isObjectB) {
			try {
			var isArrayA = Array.isArray(a);
			var isArrayB = Array.isArray(b);
			if (isArrayA && isArrayB) {
					return a.length === b.length && a.every(function (e, i) {
					return looseEqual(e, b[i])
					})
			} else if (a instanceof Date && b instanceof Date) {
					return a.getTime() === b.getTime()
			} else if (!isArrayA && !isArrayB) {
					var keysA = Object.keys(a);
					var keysB = Object.keys(b);
					return keysA.length === keysB.length && keysA.every(function (key) {
					return looseEqual(a[key], b[key])
					})
			} else {
					/* istanbul ignore next */
					return false
			}
			} catch (e) {
			/* istanbul ignore next */
			return false
			}
	} else if (!isObjectA && !isObjectB) {
			return String(a) === String(b)
	} else {
			return false
	}
}
	
export const looseIndexOf = (arr, val) => {
	for (var i = 0; i < arr.length; i++) {
		if (looseEqual(arr[i], val)) { return i }
	}
	return -1
}

	
export const once = (fn) => {
	var called = false;
	return function () {
		if (!called) {
			called = true;
			fn.apply(this, arguments);
		}
	}
} 

export const copyDeepth = (val) => {
	let copy = undefined ;
	if (Array.isArray(val)) {
			for (let i = 0, ii = val.length; i < ii; i++) { copy[i] = val[i] }
	} else if (val && typeof val === 'object') {
			for (let k in val) { copy[k] = val[k] }
	} else {
			copy = val
	}
	return copy
}

export const isAbsoluteURL = (url) =>{
	return /^[a-z]+:\/\/\w+\.\w+/i.test(url)
}