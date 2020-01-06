
// message-box的使用说明
// 1> 在main.js中引入 import MessageBox from '@/components/message_box/index'
// 2> 挂载到vue实例 Vue.$messageBox = Vue.prototype.$messageBox = MessageBox
// 3> 在组件所需处直接调用 例如：
//     alert弹框：          this.$messageBox.alert('操作成功', '', { confirmButtonText: '去冠名呀', cancelButtonText: '继续点歌' })
//     关闭弹框：            this.$messageBox.close()
//     初始化弹框按钮内容：    this.$messageBox.setDefaults({ confirmButtonText: '去冠名呀', cancelButtonText: '继续点歌' })
//     带回调的confirm弹框：
//     this.$messageBox.confirm('要去冠名吗？', '').then(confirm => {
//       console.log(confirm)
//     }).catch(cancel => {
//       console.log(cancel)
//     })
//     this.$messageBox.alert('标题', '内容')
//     带输入框的弹框：
//     this.$messageBox.prompt(' ', '请输入姓名').then(({ value }) => {
//       if (value) {
//         this.$messageBox.alert(`你的名字是 ${value}`, '输入成功');
//       }
//     });

import Vue from 'vue'
import msgboxVue from './index.vue'

var CONFIRM_TEXT = '确定'
var CANCEL_TEXT = '取消'
var defaults = {
  title: '',
  message: '',
  type: '',
  rank: null,
  showInput: false,
  showClose: true,
  modalFade: true,
  lockScroll: false,
  closeOnClickModal: true,
  inputValue: null,
  inputPlaceholder: '',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: CONFIRM_TEXT,
  cancelButtonText: CANCEL_TEXT,
  confirmButtonClass: '',
  cancelButtonClass: ''
}

// 一个遍历参数的合集
var merge = function (target) {
  for (var i = 1, j = arguments.length; i < j; i++) {
    var source = arguments[i]
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        var value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }
  return target
}

var MessageBoxConstructor = Vue.extend(msgboxVue) // 创造一个构造器，为了创建可复用组件
var currentMsg, instance
var msgQueue = []

const defaultCallback = action => {
  if (currentMsg) {
    var callback = currentMsg.callback
    // if (typeof callback !== 'function') {
    //   callback = MessageBox.close
    // }
    if (typeof callback === 'function') {
      if (instance.showInput) {
        callback(instance.inputValue, action)
      } else {
        callback(action)
      }
    }
    if (currentMsg.resolve) {
      var $type = currentMsg.options.$type
      if ($type === 'confirm' || $type === 'prompt') {
        if (action === 'confirm') {
          if (instance.showInput) {
            currentMsg.resolve({
              value: instance.inputValue, action
            })
          } else {
            currentMsg.resolve(action)
          }
        } else if (action === 'cancel' && currentMsg.reject) {
          if (currentMsg.options.message === '请扫码绑定房台') {
            Vue.$messageBox.close()
          } else {
            currentMsg.reject(action)
          }
        }
      } else {
        currentMsg.resolve(action)
      }
    }
  }
}
var initInstance = function () {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  })

  instance.callback = defaultCallback
}

var showNextMsg = function () {
  if (!instance) {
    initInstance()
  }

  if (!instance.value || instance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift()

      var options = currentMsg.options
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop]
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback
      }
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(prop => {
        if (instance[prop] === undefined) {
          instance[prop] = true
        }
      })
      document.body.appendChild(instance.$el)
      Vue.nextTick(() => {
        instance.value = true
      })
    }
  }
}
var MessageBox = function (options, callback) {
  if (typeof options === 'string') {
    options = {
      title: options
    }
    if (arguments[1]) {
      options.message = arguments[1]
    }
    if (arguments[2]) {
      options.type = arguments[2]
    }
  } else if (options.callback && !callback) {
    callback = options.callback
  }
  if (typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) { // eslint-disable-line
      msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults || {}, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      })
      showNextMsg()
    })
  } else {
    msgQueue.push({
      options: merge({}, defaults, MessageBox.defaults || {}, options),
      callback: callback
    })
    showNextMsg()
  }
}

MessageBox.setDefaults = function (defaults) {
  MessageBox.defaults = defaults
}

MessageBox.alert = function (message, title, options) {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  let cancelButtonText = ''
  let confirmButtonText = ''
  if (typeof options === 'object') {
    cancelButtonText = options.cancelButtonText
    confirmButtonText = options.confirmButtonText
  }
  return MessageBox(merge({
    title: title,
    message: message,
    $type: 'alert',
    closeOnPressEscape: false,
    closeOnClickModal: false,
    cancelButtonText: cancelButtonText || '取消',
    confirmButtonText: confirmButtonText || '确认'
  }, options))
}
MessageBox.confirm = function (message, title, options, rank) {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  let cancelButtonText = ''
  let confirmButtonText = ''
  let confirmButtonClass = ''
  if (typeof options === 'object') {
    cancelButtonText = options.cancelButtonText
    confirmButtonText = options.confirmButtonText
    confirmButtonClass = options.confirmButtonClass
  }
  return MessageBox(merge({
    title: title,
    message: message,
    $type: 'confirm',
    rank: rank,
    showCancelButton: true,
    cancelButtonText: cancelButtonText || '取消',
    confirmButtonText: confirmButtonText || '确认',
    confirmButtonClass: confirmButtonClass || ''
  }, options))
}
MessageBox.prompt = function (message, title, options) {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  return MessageBox(merge({
    title: title,
    message: message,
    showCancelButton: true,
    showInput: true,
    $type: 'prompt'
  }, options))
}
MessageBox.close = function () {
  if (!instance) return
  instance.value = false
  msgQueue = []
  currentMsg = null
}
export default MessageBox
export { MessageBox }
