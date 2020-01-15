// 首页和帮助提示页面

export default [
  {
    path: '/action/home',
    name: 'home',
    component: () => import('@/views/index'),
    meta: {
      title: '新版vue'
    }
  },
  {
    path: '/action/list',
    name: 'list',
    component: () => import('@/views/index/list'),
    meta: {
      title: '新版vue的list页'
    }
  }
]
