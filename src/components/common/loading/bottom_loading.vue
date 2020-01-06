<template>
  <div class="bottom-loading">
    <div class="box">
      <div class="load-wrap">
        <div class="loader-1"></div>
      </div>
      <div class="load-wrap">
        <div class="loader-2"></div>
      </div>
      <div class="load-wrap">
        <div class="loader-3"></div>
      </div>
    </div>
    <div class="tip">努力加载中</div>
  </div>
</template>
<style lang="scss" scoped>
.bottom-loading {
  padding-bottom: 10px;
  width: 100vw;
  position: fixed;
  bottom: 120px;
  left: 0;
}
.tip {
  color: #d9d9d9;
  text-align: center;
  line-height: 46px;
  font-size: 28px;
}
.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 140px;
  margin: 0 auto 10px;
}
.load-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
.loader-1,
.loader-3,
.loader-2 {
  border-radius: 50%;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: loader-2 .45s infinite linear;
  animation: loader-2 .45s infinite linear;
  background: #d9d9d9;
  border-radius: 50%;
  overflow: hidden;
}
.loader-2 {
  color: currentcolor;
  -webkit-animation-delay: .16s;
  animation-delay: .16s;
}
.loader-1 {
  right: 48px;
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.loader-3 {
  left: 48px;
  -webkit-animation-delay: 0.32s;
  animation-delay: 0.32s;
}
@-webkit-keyframes loader-2 {
  0%,
  80%,
  100% {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    overflow: hidden;
  }
  40% {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
  }
}
@keyframes loader-2 {
  0%,
  80%,
  100% {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    overflow: hidden;
  }
  40% {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
