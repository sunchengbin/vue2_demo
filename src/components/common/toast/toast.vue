<template>
  <transition name="pop">
    <div class="toast"
         :class="costomClass"
         v-show="visible">
      <svg-icon :iconClass='Icon'
                :className='toastSvg'
                v-show="iconName!==''" />
      <p :class="message&&message.length>10?'long':''">{{message}}</p>
      <p class='tip' v-show="tip">{{tip}}</p>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'toast',
  props: {
    message: String,
    tip: String,
    className: {// 样式
      type: String,
      default: ''
    },
    iconName: {// 图标信息
      type: String,
      default: ''
    },
    position: {// 位置
      type: String,
      default: ''
    },
    toastSvg: {
      type: String,
      default: 'toast-svg'
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    costomClass () {
      let classes = ''
      switch (this.position) {
        case 'top':
          classes += 'placeTop '
          break
        case 'bottom':
          classes += 'placeBottom '
          break
        default:
          classes += 'placeMiddle '
      }
      switch (this.type) {
        case 'simple':
          classes += ' simple'
          break
        case 'simple_null':
          classes += ' simple simple_null'
          break
        default:
          break
      }
      classes += this.className
      return classes
    },
    Icon () {
      if (this.iconName) {
        return this.iconName
      }
      return ''
    }

  }
}
</script>
<style lang="scss" scoped>
.toast {
  padding: 30px 38px;
  border-radius: 15px;
  font-size: 30px;
  box-sizing: content-box;
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  color: #fff5e7;
  text-align: justify;
  z-index: $z_index_important;
  transition: opacity 0.5s linear;
  .toast-svg {
    width: 40px;
    height: 40px;
    vertical-align: middle;
    margin-right: 10px;
  }
  p {
    line-height: 42px;
    text-align: center;
  }
  .tip {
    color: #e86f2b;
    font-size: 26px;
  }
  .long {
    width: 338px;
  }
}

.placeTop {
  top: 50px;
  left: 50%;
  transform: translate(-50%, 0);
}
.placeBottom {
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
}
.placeMiddle {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.pop-enter,
.pop-leave-active {
  opacity: 0;
}
.simple {
  background: #62c989;
  width: 330px;
  height: 90px;
  line-height: 90px;
  padding: 0 !important;
  font-size: 36px;
  font-family: "pingfangsc-medium";
}
.simple_null {
  width: 422px;
  height: 73px;
  line-height: 73px;
  font-size: 30px;
}
</style>
