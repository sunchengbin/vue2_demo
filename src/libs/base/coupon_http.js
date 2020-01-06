// 封装http请求
import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import {
  util
} from '@/libs/utils'
const http = axios.create({
  baseURL: process.env.VUE_APP_COUPON_BASEURL,
  timeout: 15000
})

http.interceptors.request.use(config => {
  // 请求头里面加入各种判断
  if (config.method === 'post' && config.data && config.data.constructor !== FormData) {
    if (util.getUrlPrem('uploadImg', config.url) !== 'up') {
      config.data = qs.stringify(config.data)
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  if (!util.getUrlPrem('close_loading', config.url)) {
    Vue.$loading.open()
  } else {
    let url = config.url
    config.url = url.split('?close_loading=true')[0]
  }
  return config
}, error => {
  // 拦截请求错误
  Vue.$toast(error.errmsg)
  Promise.reject(error)
})

http.interceptors.response.use(response => {
  const res = response.data
  Vue.$loading.close()
  if (res.errcode === 200 || res.errcode === 21001) {
    return res
  } else {
    let urlArr = ['//kcms.ktvsky.com/song_feedback/add', '/vod/appmusic/add', '/c/lsk/sign_up', '/c/lsk/score/free', 'https://qncweb.ktvsky.com', '/vod/vip/order/v2']
    for (var i in urlArr) {
      if (response.config.url.indexOf(urlArr[i]) >= 0) {
        return res
      }
    }
    if (res.code === 200) {
      return res
    } else if (res.errcode === 10002 && (res.errmsg === 'room_id is null' || res.errmsg === 'room is null')) {
      return res
    } else {
      // 根据不同错误码进行提示
      Vue.$toast(res.errmsg)
      // return Promise.reject(res.errmsg)
    }
  }
}, error => {
  Vue.$loading.close()
  if (axios.isCancel(error)) {
    console.log('Rquest canceled', error.message) // 请求如果被取消，这里是返回取消的message
  } else {
    // 调用一个错误提醒dialog
    Vue.$toast(error.errmsg)
    return Promise.reject(error)
  }
})

export default http
