import {
  util
} from '../utils'
import store from '@/store'
const statistics = {
  fromWay: util.getUrlPrem('fromWay') || 'default',
  // category： 要监控的目标的类型名称， 通常是同一组目标的名字， 比如 "视频"等等。 该项必填， 不填、 填 "-"的事件会被抛弃。
  // action： 用户跟目标交互的行为， 如 "播放"等等。 该项必填， 不填、 填 "-"的事件会被抛弃。
  // optLabel： 事件的一些额外信息， 通常可以是歌曲的名称、 软件的名称、 链接的名称等等。 该项选填， 不填、 填 "-"代表此项为空。
  // optValue： 事件的一些数值信息， 比如权重、 时长、 价格等等， 在报表中可以看到其平均值等数据。 该项可选。
  push ({ category, action, optLabel = 'thunder', optValue }) {
    _hmt.push(['_trackEvent', category, action, optLabel, optValue])
  },

  // 推送fromWay相关的事件，action是动态的
  pushFromWay ({ action, optValue }) {
    let obj = {
      category: store.state.statistics.fromWay,
      action
    }
    if (optValue) {
      obj['optValue'] = optValue
    }
    this.push(obj)
  },

  // 入口页面初始化记录fromWay事件
  pageLoad (optValue) {
    let obj = {
      category: 'fromWay',
      action: this.fromWay
    }
    if (optValue) {
      obj['optValue'] = optValue
    }
    this.push(obj)
    store.commit('SAVE_FROM_WAY', {
      fromWay: this.fromWay
    })
  }
}

export default statistics
// 用例
// import {
//   utils
// } from '@/libs/interfaces'
// console.log(this.$store.state.statistics.fromWay)
// utils.statistics.pageLoad()
// utils.statistics.pushFromWay({
//   action: '支付'
// })
// console.log(this.$store.state.statistics.fromWay)
