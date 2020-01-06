/*
 * 节流 (固定时间内只能执行一次事件)
 * 应用场景（例如：滚动更新列表scroll事件，元素拖拽，resize）
 * 调用方式
 * throttle(callback, 1000) // 第一次直接执行
 * throttle(callback, 1000, {leading: false}) // 第一次延迟1000毫秒执行
 * throttle(callback, 1000, {trailing: false}) // 不执行最后一次
 */
function throttle (callback, wait = 300, opts = {}) {
  let context, args, result
  let timeout = null
  let previous = 0

  function laterFn () {
    previous = opts.leading === false ? 0 : Date.now()
    timeout = null
    result = callback.apply(context, args)
    context = args = null
  }

  function throttled () {
    context = this
    args = arguments
    const now = Date.now()
    // console.log(`time is ${now}`)
    if (!previous && opts.leading === false) previous = now
    const remaining = wait - (now - previous)
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = callback.apply(context, args)
      context = args = null
    } else if (!timeout && opts.trailing !== false) {
      timeout = setTimeout(laterFn, remaining)
    }
    return result
  }
  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }
  return throttled
}

export default throttle
