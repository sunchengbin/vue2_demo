import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import index from './modules/index'
Vue.use(Vuex)
const state = {
  openid: ''
}
const Store = new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    index
  }
})
export default Store
