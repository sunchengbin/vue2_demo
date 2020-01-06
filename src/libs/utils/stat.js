/**
 * 上报组件
 * 只有在正式环境下才会上报
 * 避免上报数据不准确
 */
import Cookies from 'js-cookie'
function Stat (data) {
  let statdata = JSON.parse(localStorage.getItem('statInfo'))
  let params = {
    openid: Cookies.get('openid'),
    unionid: Cookies.get('unionid'),
    ktvid: statdata.ktvid,
    roomid: statdata.room_id,
    roomip: statdata.room_ip,
    fr: statdata.user_scan_fr,
    tp: data.tp,
    desc: data.desc
  }
  let code = ''
  for (var key in params) {
    code += key + '=' + params[key] + '&'
  }
  if (process.env.NODE_ENV === 'production') {
    try {
      var img = new Image(1, 1)
      img.src = process.env.VUE_APP_STATURL + '?' + code + '_r=' + Math.random()
      img.onload = function () {
        img = null
      }
    } catch (err) {
      console.log(err)
    }
  }
}
export default Stat
