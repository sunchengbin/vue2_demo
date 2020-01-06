<!-- svg-icon 组件，业务组件中直接使用该组件展示 icon -->
<template>
  <svg :class="svgClass"
       aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
// 引入所有的svg的文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./icons', false, /\.svg$/)
const simpleReq = require.context('./icons/simple_icon', false, /\.svg$/)
const controlPadReq = require.context('./icons/control__pad', false, /\.svg$/)
const vipReq = require.context('./icons/vip', false, /\.svg$/)
const homeReq = require.context('./icons/home', false, /\.svg$/)
const mineReq = require.context('./icons/mine', false, /\.svg$/)
requireAll(req)
requireAll(simpleReq)
requireAll(controlPadReq)
requireAll(vipReq)
requireAll(homeReq)
requireAll(mineReq)
export default {
  name: 'svg-icon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    },
    svgClass () {
      if (this.className) {
        return `svg-icon ${this.className}`
      }
      return 'svg-icon'
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 42px;
  height: 76px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
