import weixin from '@/libs/app/weixin'
function setTitle (to) {
  to.matched.some(record => {
    document.title = record.meta.title || process.env.VUE_APP_TITLE
  })
}
export default function (router) {
  router.beforeEach(async (to, from, next) => {
    // 设置title
    setTitle(to)
    // 判断是否授权,如果未授权则跳到授权
    if (process.env.NODE_ENV !== 'development') {
      weixin.getOpenID(to.path, to.query)
    }
    next()
  })
  router.afterEach((to, from) => {
  })
}
