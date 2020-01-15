<template>
  <div class="main">
    <div class="">
      hello world
      <div class="box">
        <div v-on:click="goList">list页面</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    goList () {
      this.$router.push('/action/list')
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="scss">
  @svg square {
    @rect {
        fill: var(--color, black);
        width: 100%;
        height: 2px;
    }
  }

  .box {
      background: white svg(square param(--color #00b1ff));
  }
</style>
