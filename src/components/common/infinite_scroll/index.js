import InfiniteScroll from './infinite-scroll-directive'
import Vue from 'vue'
const install = function (Vue) {
  Vue.directive('InfiniteScroll', InfiniteScroll)
}
if (!Vue.prototype.$isServer && window.Vue) {
  window.infiniteScroll = InfiniteScroll
  Vue.use(install) // eslint-disable-line
}
InfiniteScroll.install = install
export default InfiniteScroll
// 使用方法：直接将指令加在要滚动的组件的上
// <div class="songs order-service"
// :style="style"
// id="scroll"
// v-infinite-scroll="loadMore"
// infinite-scroll-disabled="busy"
// infinite-scroll-distance=50
// infinite-scroll-immediate-check=false></div>
// v-infinite-scroll="loadMore"是滚动执行的函数;
// infinite-scroll-disabled="busy" 是是否可以执行loadMore,busy=false是可以执行，busy=false是不能执行；注意在离开当前页面时设置busy=true;
// infinite-scroll-distance=50距离底部多少时可以加载执行函数；
// infinite-scroll-immediate-check=false 列表未充满页面时，是否继续加载为ture则加载函数至数据充满页面，否则则不加载
