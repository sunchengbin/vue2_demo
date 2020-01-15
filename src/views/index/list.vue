<template>
  <div class="list-box">
    <div>{{message}}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      message: 'this page is list'
    }
  }
}
</script>
<style lang="scss">
  .list-box {
    font-size: 100px;
  }
</style>
