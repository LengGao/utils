/**
 * rules: [{ key: 'id', type: 'required' [, regexp: RegExp, validator: (val, key) => { true || false }, type: 'required' ] }]
 * message [{ key: 'id', message: '请输入id }]
 */
 class Validator {
  constructor(rules = [], messages = []) {
    this.rules = rules
    this.messages = messages
    this.init()
  }

  init() {
    this.errorList = []
    this.defaultRule()
  }

  defaultRule() {
    const defaultRules = {
      "required": (val, key) => {
        return `${val}`.length > 0 && val !== undefined && val !== null
      }
    }
    this.defaultRules = defaultRules
  }


  checkFrom(form) {
    let rules = this.rules, errorList = [], messages = this.messages, defaultRules = this.defaultRules
    for (let i = rules.length - 1; i >= 0; i--) {
      let rule = rules[i], key = rule.key, val = form[key], message = messages[i].message, type = rule.type
      if (rule.validator) {
        if (!rule.validator(val, key, errorList)) {
          errorList.push({ key: key, msg: message })
        }
      } else if (rule.regexp) {
        if (!rule.regexp.test(val)) {
          errorList.push({ key: key, msg: message })
        }
      } else if (!!type) {
        if (!defaultRules[type](val, key)) {
          // console.log("type", type, val ,key);
          errorList.push({ key: key, msg: message })
        }
      }
    }

    this.errorList = errorList
    return errorList.length <= 0
  }

  showToast() {
    const errorList = this.errorList
    if (errorList.length > 0) {
      let err = errorList[0]
      uni.showToast({ icon: 'none', title: `${err.msg}` })
      // console.log("%c from validator:", err.key, err.msg, "color: orange;");
    }
  }
}

export default Validator