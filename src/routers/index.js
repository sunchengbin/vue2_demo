// 首页和帮助提示页面

export default [
  {
    path: '/action/home',
    name: 'home',
    component: () => import('@/views/index'),
    meta: {
      title: '雷石K歌'
    }
  }
]
