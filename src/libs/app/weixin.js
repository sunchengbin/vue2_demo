import wx from 'weixin-js-sdk'
import {
  utils,
  apis,
  http
} from '@/libs/interfaces'
import store from '@/store'
import Cookies from 'js-cookie'
import Vue from 'vue'
const weixin = {
  // wxLoginUrl: '', // 授权登录url
  wxLoginUrl (page, query) {
    const appid = process.env.VUE_APP_APPID
    let queryString = ''
    for (const key in query) {
      queryString += key + '=' + query[key] + '&'
    }
    return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=&response_type=code&scope=snsapi_userinfo&state=/' + page + '?' + queryString + '&connect_redirect=1#wechat_redirect'
  },
  // 判断是否授权
  getOpenID (page, query, callback) {
    // 用户openid，只跟当前公众号相关
    let openid = utils.util.getUrlPrem('openid') || Cookies.get('openid') || store.state.openid
    // 用户unionid，用户唯一ID，不随公众号变化
    let unionid = utils.util.getUrlPrem('unionid') || Cookies.get('unionid') || store.state.unionid
    if (openid && unionid) {
      Cookies.set('openid', openid, {
        expires: 30
      })
      Cookies.set('unionid', unionid, {
        expires: 30
      })
      // utils.cookie.setCookie(openid, 30)
      // utils.cookie.setCookie(unionid, 30, 'tunionid')
      store.commit('SAVE_OPENID', openid)
      store.commit('SAVE_UNIONID', unionid)
    }
  },
  isWxWebView () {
    const arr = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
    if (arr && arr.length > 0 && arr[0] === 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  isXcxWebView () {
    return utils.util.getUrlPrem('browser') === 'xcx' || window.__wxjs_environment === 'miniprogram'
  },
  init (callback) {
    let req = {
      // 'action': 'js_signature',
      'type': 'thunder',
      'url': window.location.href.replace(/#.*$/, '')
    }
    http.get(apis.initWx, {
      params: req
    }).then(function (res) {
      try {
        wx.config({
          debug: false,
          appId: res.appId,
          timestamp: parseInt(res.timestamp),
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'chooseImage',
            'uploadImage',
            'scanQRCode',
            'startRecord',
            'stopRecord',
            'chooseWXPay',
            'getLocation',
            'openLocation',
            'getLocalImgData'
          ]
        })
        wx.ready(function () {
          wx.checkJsApi({
            jsApiList: [
              'chooseImage',
              'scanQRCode',
              'chooseWXPay',
              'getLocation',
              'getLocalImgData'
            ],
            success: function (res) {
              callback && callback()
            },
            failed: function (err) {
              console.log('失败', err)
            },
            complete: function () { }
          })
        })
        wx.error(res => {
        })
      } catch (g) {
      }
      let loading = document.getElementById('loading')
      loading.style.display = 'none'
      store.commit('CHANGE_HOME_BOTTOM_AD', true)
    }).catch(function (error) {
      console.log(error)
    })
  },
  updateShare (conf) {
    let settings = 'onMenuShareTimeline onMenuShareAppMessage'
    settings.split(' ').forEach(e => {
      try {
        wx[e](conf)
      } catch (g) {
        alert(g)
      }
    })
  },
  shareTimeLine (config, callback) {
    wx.onMenuShareTimeline({
      title: config.title, // 分享标题
      link: config.link || window.location.href, // 分享链接
      imgUrl: config.imgUrl, // 分享图标
      desc: config.desc,
      success: function () {
        callback && callback()
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
  },
  shareAppMessage (config, callback) {
    wx.onMenuShareAppMessage({
      title: config.title, // 分享标题
      desc: config.desc, // 分享描述
      link: config.link || window.location.href, // 分享链接
      imgUrl: config.imgUrl, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        callback && callback()
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
  },
  previewImage (current, urls) {
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  chooseImage (num, callback) {
    let localIds
    wx.chooseImage({
      count: num, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        // callback && callback(res)
        localIds = res.localIds ? res.localIds : []
        uploadToWeiXin(localIds, callback)
      }
    })
    function uploadToWeiXin (ids, callback) {
      if (!ids.length) {
        return false
      }
      let length = ids.length
      let serverIds = []
      let i = 0
      upload()
      function upload () {
        wx.uploadImage({
          localId: ids[i],
          success: function (res) {
            serverIds.push(res.serverId)
            i++
            if (i < length) {
              upload()
            } else {
              callback && callback(serverIds)
            }
          },
          fail: function (res) {
            console.log(JSON.stringify(res))
          }
        })
      }
    }
  },
  uploadedImgs: [],
  uploadSuccessed: true,
  uploadImages (localIds, callback) {
    if (!localIds.length) return
    let localId = localIds.pop()
    let _this = this
    if (!_this.callback) {
      _this.callback = callback
    }
    wx.uploadImage({
      localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success (res) {
        let serverId = res.serverId
        _this.uploadedImgs.push(serverId)
        if (res.errMsg !== 'uploadImage:ok') {
          _this.uploadSuccessed = false
        }
        if (localIds.length > 0) {
          _this.uploadImages(localIds)
        } else {
          if (!_this.uploadSuccessed) return
          try {
            _this.callback(_this.uploadedImgs)
          } catch (e) {
            alert(e)
          }
        }
      }
    })
  },
  getLocalImgData (i, localIds, callback) {
    wx.getLocalImgData({
      localId: localIds[i],
      success: function (res) {
        callback && callback(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  uploadImgsFn (num, callback) {
    let _this = this
    // 选图
    _this.chooseImage(num, (chooseRes) => {
      if (chooseRes.errMsg === 'chooseImage:ok') {
        _this.uploadImages(
          chooseRes.localIds,
          (uploadImages) => {
            _this.imgServerDownload(uploadImages, (downloadRes) => {
              callback(downloadRes)
            })
          })
      }
    })
  },
  imgServerDownload (uploadImages, callback) {
    // 服务器端图片下载
  },
  scanQRCode (callback, type) {
    wx.scanQRCode({
      desc: 'scanQRCode desc',
      needResult: type === 1 ? type : 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        let result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
        callback && callback(result)
      }
    })
  },
  wxPay (params, url, elseData, type) {
    http.post(url, params).then(res => {
      res.errcode = parseInt(res.errcode)
      if (res.errcode === 200) {
        store.commit('SAVE_ORDER_ID', res.oid)
        wx.chooseWXPay({
          timestamp: res.pay.jspay.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: res.pay.jspay.nonceStr, // 支付签名随机串，不长于 32 位
          package: res.pay.jspay.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: res.pay.jspay.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: res.pay.jspay.paySign, // 支付签名
          fail: function (res) {
            Vue.$messageBox.alert('支付失败', '')
          },
          success: function (res) {
            // 支付成功后的回调函数
            if (res.errMsg === 'chooseWXPay:ok') {
              store.commit('CLOSE_PAY_PANEL')
              // 国庆活动查单
              if (type === 'blessv1') {
                store.dispatch('nationalQueryOrder', '/c1/bless/wxpay/old/v1')
              } else if (type === 'blessv4') {
                store.dispatch('nationalQueryOrder', '/c1/bless/wxpay/new/v1')
              } else if (type === 'gift') {
                store.dispatch('nationalQueryOrder', '/vod/gift/wxpay')
              } else if (type === 'photo') {
                store.dispatch('nationalQueryOrder', '/c1/photo/wxpay/old/v1')
              } else if (type === 'photov2') {
                store.dispatch('nationalQueryOrder', '/c1/photo/wxpay/new/v1')
              }
              elseData.callback() === 'function' && elseData.callback()
            } else {
              Vue.$messageBox.alert('支付失败', '')
            }
          },
          cancel: function (res) {
            // 支付取消回调函数
            Vue.$messageBox.alert('支付取消', '')
          }
        })
      } else if (res.errcode === 52000) {
        Vue.$toast(res.errmsg)
      } else {
        Vue.$toast('支付失败')
      }
    }).catch(err => {
      console.log(err)
      Vue.$toast('支付失败')
    })
  },
  startRecord (e) {
    wx.startRecord()
  },
  stopRecord (_this) {
    wx.stopRecord({
      success (res) {
        return wx.translateVoice({
          localId: res.localId, // 需要识别的音频的本地Id，由录音相关接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            _this.setWord(res.translateResult)
          },
          fail: function () {
            alert('识别失败')
          }
        })
      }
    })
  },
  getLocation (that, callback) {
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        that.latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
        that.longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
        typeof callback === 'function' && callback()
      },
      fail: function (err) {
        if (err.errMsg.indexOf('getLocation:fail') >= 0) {
          location.reload()
        } else {
          console.log(err)
        }
      },
      cancel: function () {
        typeof callback === 'function' && callback()
      }
    })
  }
}

export default weixin
