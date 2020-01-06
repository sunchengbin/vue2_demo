<template>
  <div id="app">
    <!-- <keep-alive :include="keepAlive"> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      // keepAlive: []
    }
  },
  created () {
    setTimeout(function () {
      var loading = document.getElementById('loading')
      loading.style.display = 'none'
    }, 1000)
  },
  methods: {
  },
  computed: {
  },
  components: {
  }
}
</script>

<style lang="scss">
html, body {
  height: 100%;
}
#app {
  min-height: 100%;
  height: 100%;
  overflow-x: hidden;
  background: $bottom_color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    &.router-link-exact-active {
      color: $active_font_color;
    }
  }
}
</style>
