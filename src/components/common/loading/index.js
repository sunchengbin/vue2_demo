import loading from './loading'
import Vue from 'vue'
const LoadingConstructor = Vue.extend(loading)
const getAnintance = () => {
  return new LoadingConstructor({
    el: document.createElement('div')
  })
}
const intance = getAnintance()
LoadingConstructor.prototype.open = (options = {}) => {
  document.body.appendChild(intance.$el)
  intance.message = typeof options !== 'object' ? options : options.message || '数据加载中'
  intance.iconType = options.iconType || 'dash'
  // if (!document.getElementById('loading-toast')) {
  //   let loadingEle = document.createElement('div')
  //   loadingEle.setAttribute('id', 'loading')
  //   document.body.appendChild(loadingEle)
  //   intance.$mount('#loading')
  // }
  Vue.nextTick(function () {
    intance.visible = true
  })
}
LoadingConstructor.prototype.close = () => {
  Vue.nextTick(function () {
    if (intance) {
      intance.visible = false
    }
  })
}
export default intance
// 用法
// 已经绑定到Vue原型上
// 1、 this.$loading.open() //显示loading
// 2、 this.$loading,open({
//  message: '数据加载'，可选
//  iconType: 'dash' || 'cycle' //两种loading效果 可选
// })
// 3、this.$loading.open('传入提示信息')
// loading.close() //关闭loading
