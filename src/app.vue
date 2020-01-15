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
  body {
    font-size: 24px;
  }
  #app {
    font-size: 60px;
    background: $bottom_color;
    color: $one_level_color;
  }
  a {
    color: $link_font_color;
  }
</style>
