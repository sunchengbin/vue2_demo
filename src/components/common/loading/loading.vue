<template>
  <transition name="loading">
    <div class="loading-toast"
         id="loading-toast"
         v-show="visible">
      <div class="loading-toast-container">
        <img src="./loading.png"
             alt="">
        <p class="loading-toast__content">努力加载中</p>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'loading',
  props: {
    message: {
      type: String,
      default: '加载中...'
    },
    iconType: {
      type: String,
      default: 'dash'
    }
  },
  data () {
    return {
      visible: true
    }
  },
  computed: {
    iconClass () {
      if (this.iconType) {
        return 'loading-toast__icon_' + this.iconType
      }
      return 'loading-toast__icon_dash'
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-enter,
.loading-leave-active {
  opacity: 0;
}
.loading-toast {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: $z_index_important;
  .loading-toast-container {
    width: 200px;
    height: 200px;
    border-radius: 20px;
    overflow: hidden;
    background: #000;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 86px;
      height: 86px;
      -webkit-transition-property: -webkit-transform;
      -webkit-transition-duration: 1s;
      -moz-transition-property: -moz-transform;
      -moz-transition-duration: 1s;
      -webkit-animation: rotate 1s linear infinite;
      -moz-animation: rotate 1s linear infinite;
      -o-animation: rotate 1s linear infinite;
      animation: rotate 1s linear infinite;
    }
    .loading-toast__content {
      color: #fff;
      text-shadow: 0px 15px 3px #000;
      margin-top: 20px;
    }
  }
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(359deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(359deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
