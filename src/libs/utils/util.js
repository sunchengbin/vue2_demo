export default class util {
  static scrollToBottom (dom, scrollTop) {
    this.listenAndroidKeyboardToggle(() => {
      document.querySelector(dom).scrollTop = scrollTop || 9999
    }, () => {
      document.querySelector(dom).scrollTop = scrollTop || 9999
    })
  }

  static listenAndroidKeyboardToggle (onShow, onHide) {
    // 针对 android 机型
    // 通过窗口高度的变化来监听键盘的收起和出现
    let windowInnerHeightNoKeyboard = window.innerHeight
    let windowInnerHeightHasKeyboard = windowInnerHeightNoKeyboard
    if ((/(Android)\s+([\d.]+)/i).test(window.navigator.userAgent)) {
      window.addEventListener('resize', () => {
        if (window.innerHeight < windowInnerHeightNoKeyboard) {
          onShow && onShow(windowInnerHeightNoKeyboard)
        }
        if (window.innerHeight >= windowInnerHeightHasKeyboard) {
          onHide && onHide()
        }
      })
    }
  }

  static isAndroid () {
    if ((/(Android)\s+([\d.]+)/i).test(window.navigator.userAgent)) {
      return true
    }
    return false
  }

  static getUrlPrem (key, url) {
    const search = url || window.location.href
    const pattern = new RegExp(`[?&]${key}=([^&]+|\\w+)`, 'g')
    const matcher = pattern.exec(search)
    let items = null
    if (matcher !== null) {
      try {
        items = decodeURIComponent(decodeURIComponent(matcher[1]))
      } catch (e) {
        try {
          items = decodeURIComponent(matcher[1])
        } catch (e) {
          items = matcher[1]
        }
      }
    }
    return items
  }

  static async getAsyncRoutes () {
    let routes = []
    const allRouters = require.context('@/routers', true, /.js$/).keys()
    for (let i in allRouters) {
      let fileName = allRouters[i]
      if (/.\//.test(fileName)) {
        fileName = fileName.replace('./', '')
      }
      let file = await import(`@/routers/${fileName}`)
      routes = routes.concat(file.default)
    }
    routes.push({
      path: '*',
      redirect: '/action/home'
    })
    return routes
  }

  static loadJS (url, callback) {
    const head = document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.src = url
    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        callback && callback()
      }
    }
    head.appendChild(script)
  }
}
