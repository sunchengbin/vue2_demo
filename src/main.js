import Vue from 'vue'
import App from './app.vue'
import Router from 'vue-router'
import store from './store'
import SvgIcon from '@/components/common/svg_icon/svg'
import lazyload from '@/components/common/lazy_load'
import Toast from '@/components/common/toast'
import Loading from '@/components/common/loading'
import MessageBox from '@/components/common/message_box'
import FastClick from 'fastclick'
import RouterGuard from '@/router'
import {
  util
} from '@/libs/utils'

// 添加fastclick
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

// 插件
Vue.use(lazyload)
Vue.use(Router)
// vue全局变量
Vue.$toast = Vue.prototype.$toast = Toast
Vue.$loading = Vue.prototype.$loading = Loading
Vue.$messageBox = Vue.prototype.$messageBox = MessageBox
// 组件
Vue.component(SvgIcon.name, SvgIcon)

;(async function () {
  let routes = [{
    path: '/',
    name: 'index',
    redirect: '/action/home'
  }]
  let newRoutes = await util.getAsyncRoutes()
  routes = routes.concat(newRoutes)
  let router = new Router({
    mode: process.env.NODE_ENV === 'development' ? 'hash' : 'history',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return {
          x: 0,
          y: 0
        }
      }
    },
    routes
  })
  router.beforeEach((to, from, next) => {
    // 每次切换路由更新一次
    next()
  })
  router.afterEach((to, from, next) => {
  })
  RouterGuard(router)
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})()
