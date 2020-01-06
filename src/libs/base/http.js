// 封装http请求
import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import {
  util
} from '@/libs/utils'

const http = axios.create({
  baseURL: process.env.VUE_APP_KTV_BASEURL,
  timeout: 15000
})
http.interceptors.request.use(config => {
  // 请求头里面加入各种判断
  if (config.method === 'post' && config.data && config.data.constructor !== FormData) {
    config.data = qs.stringify(config.data)
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  // 接口url中添加BaseUrlType查询字段。如：/login?BaseUrlType=coupon
  // 自动切换http请求的BaseUrl为coupon域名
  if (util.getUrlPrem('BaseUrlType', config.url) === 'other') {
    const index = config.url.indexOf('?')
    config.url = config.url.substring(0, index)
  }
  // 上传图片的域名
  if (util.getUrlPrem('BaseUrlType', config.url) === 'upyun') {
    config.baseURL = process.env.VUE_APP_UPYUN_BASEURL
  }
  if (util.getUrlPrem('BaseUrlType', config.url) === 'coupons') {
    config.baseURL = 'http://coupon.ktvsky.com'
  }
  if (!util.getUrlPrem('close_loading', config.url)) {
    Vue.$loading.open()
  }
  return config
}, error => {
  // 拦截请求错误
  Promise.reject(error)
})

http.interceptors.response.use(response => {
  const res = response.data
  Vue.$loading.close()
  if (res.errcode === 200 || res.errcode === 21001 || res.errcode === 0) {
    return res
  } else {
    if (res.code === 200) {
      return res
    } else {
      // 根据不同错误码进行提示
      if (res.total) {
        return res
      }
      if (response.config.url.indexOf('//ad.ktvsky.com/ad/config/') >= 0) {
        return res
      }
      Vue.$toast(res.errmsg)
      return Promise.reject(res.errmsg)
    }
  }
}, error => {
  // 调用一个错误提醒dialog
  Vue.$toast(error.errmsg)
  return Promise.reject(error)
})

export default http
