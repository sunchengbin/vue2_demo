import toast from './toast.vue'
import Vue from 'vue'
const ToastConstructor = Vue.extend(toast)
let toastTool = []
const getIntance = () => {
  if (toastTool.length > 0) {
    const intance = toastTool[0]
    // console.log(toastTool.splice(0, 1))
    return intance
  }
  return new ToastConstructor({
    el: document.createElement('div')
  })
}
const removeDom = (e) => {
  if (e.target.parentNode) {
    e.target.parentNode.removeChild(e.target)
  }
}
ToastConstructor.prototype.close = function () {
  // console.log(this)
  this.visible = false
  this.closed = true
  this.$el.addEventListener('transitionend', removeDom)
  toastTool.push(this)
  // console.log(toastTool)
}
const Toast = (options = {}) => {
  const intance = getIntance()
  document.body.appendChild(intance.$el)
  intance.message = typeof options !== 'object' ? options : options.message || '网络异常'
  intance.tip = typeof options !== 'object' ? '' : options.tip
  intance.duration = options.duration || 1500
  intance.className = options.className || ''
  intance.iconName = options.iconName || ''
  intance.position = options.position || ''
  intance.type = options.type || ''
  intance.toastSvg = options.toastSvg || 'toast-svg'
  intance.closed = false
  intance.$el.removeEventListener('transitionend', removeDom)
  clearTimeout(intance.timer)
  Vue.nextTick(function () {
    intance.visible = true
    intance.duration && (intance.timer = setTimeout(function () {
      if (intance.closed) {
        return false
      }
      intance.close()
    }, intance.duration))
  })
  return intance
}
export default Toast
// 使用方法
// 已经绑定到Vue原型上
// this.$toast({
//   message: '操作成功', // 显示提示文字 可选
//   iconName: 'vip', // 图标 可选
//   position: 'bottom',// 位置信息 可选
//   duration: 3000 // 显示时间
// })
// 或者this.$toast('message')
