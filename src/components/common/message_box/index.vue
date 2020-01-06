<template>
  <div class="msgbox-wrapper"
       v-show="value"
       @click="doClose">
    <transition name="fade">
      <div class="rankwindow" v-if="rank=='rank'">
        <div class="alert_window window_text">
          <h3>该歌曲正在进行比赛</h3>
          <p>您可以为本次演唱录音<br />演唱后报名参赛哦~</p>
          <p class="more" @click="join">查看比赛详情></p>
          <button @click="handleAction('cancel')">不了</button>
          <button class="rank_btn" @click="handleAction('confirm')">录音</button>
        </div>
      </div>
      <div class="msgbox" v-else>
        <div class="msgbox-top">
          <div class="msgbox-title"
              v-if="title">
            <div class="title" v-html="title"></div>
          </div>
          <div class="msgbox-content"
              v-if="message !== ''"
              :class="title !== ''?'msgbox-content content_pad_yt':'msgbox-content content_pad_nt'">
            <div class="content"
                v-html="message"
                :class="message&&title?'sub-title':''"></div>
          </div>
        </div>
        <div class="msgbox-btns">
          <button :class="[ cancelButtonClasses ]"
                  v-show="showCancelButton"
                  @click="handleAction('cancel')">{{ cancelButtonText }}</button>
          <button :class="[ confirmButtonClasses ]"
                  v-show="showConfirmButton"
                  @click="handleAction('confirm')">{{ confirmButtonText }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/babel">
import weixin from '@/libs/app/weixin.js'
let CONFIRM_TEXT = '确定'
let CANCEL_TEXT = '取消'
export default {
  props: {
    modal: {
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      default: true
    },
    closeOnPressEscape: {
      default: true
    },
    inputType: {
      type: String,
      default: 'text'
    }
  },
  computed: {
    confirmButtonClasses () {
      let classes = 'msgbox-btn msgbox-btn-confirm ' + this.confirmButtonClass
      if (this.confirmButtonHighlight) {
        classes += ' msgbox-confirm-highlight'
      }
      return classes
    },
    cancelButtonClasses () {
      let classes = 'msgbox-btn msgbox-btn-cancel ' + this.cancelButtonClass
      if (this.cancelButtonHighlight) {
        classes += ' mmsgbox-cancel-highlight'
      }
      return classes
    }
  },
  methods: {
    doClose () {
      this.value = false
      this._closing = true
      this.onClose && this.onClose()
      setTimeout(() => {
        if (this.modal && this.bodyOverflow !== 'hidden') {
          document.body.style.overflow = this.bodyOverflow
          document.body.style.paddingRight = this.bodyPaddingRight
        }
        this.bodyOverflow = null
        this.bodyPaddingRight = null
      }, 200)
      this.opened = false
    },
    handleAction (action) {
      if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
        return
      }
      if (this.message === '请扫码绑定房台' && action === 'confirm') {
        weixin.scanQRCode()
      }
      var callback = this.callback
      if (typeof callback !== 'function') {
        return
      }
      this.value = false
      callback(action)
    },
    validate () {
      if (this.$type === 'prompt') {
        var inputPattern = this.inputPattern
        if (inputPattern && !inputPattern.test(this.inputValue || '')) {
          this.editorErrorMessage = this.inputErrorMessage || '输入的数据不合法!'
          this.$refs.input.classList.add('invalid')
          return false
        }
        var inputValidator = this.inputValidator
        if (typeof inputValidator === 'function') {
          var validateResult = inputValidator(this.inputValue)
          if (validateResult === false) {
            this.editorErrorMessage = this.inputErrorMessage || '输入的数据不合法!'
            this.$refs.input.classList.add('invalid')
            return false
          }
          if (typeof validateResult === 'string') {
            this.editorErrorMessage = validateResult
            return false
          }
        }
      }
      this.editorErrorMessage = ''
      this.$refs.input.classList.remove('invalid')
      return true
    },
    handleInputType (val) {
      if (val === 'range' || !this.$refs.input) return
      this.$refs.input.type = val
    },
    join () {
      window.location.href = '/action/rank/song_rank'
    }
  },
  watch: {
    inputValue () {
      if (this.$type === 'prompt') {
        this.validate()
      }
    },
    value (val) {
      this.handleInputType(this.inputType)
      if (val && this.$type === 'prompt') {
        setTimeout(() => {
          if (this.$refs.input) {
            this.$refs.input.focus()
          }
        }, 500)
      }
    },
    inputType (val) {
      this.handleInputType(val)
    }
  },
  data () {
    return {
      title: '',
      message: '',
      value: '',
      type: '',
      rank: '',
      showInput: false,
      inputValue: null,
      inputPlaceholder: '',
      inputPattern: null,
      inputValidator: null,
      inputErrorMessage: '',
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: CONFIRM_TEXT,
      cancelButtonText: CANCEL_TEXT,
      confirmButtonClass: '',
      confirmButtonDisabled: false,
      cancelButtonClass: '',
      editorErrorMessage: null,
      callback: null
    }
  }
}
</script>
<style lang="scss" scoped>
.msgbox-wrapper {
  z-index: $z_index_important;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
.msgbox {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  background: #fff;
  background-size: 100%;
  width: 540px;
  font-size: 36px;
  border-radius: 14px;
  padding-top: 42px;
  font-weight: 500;
  -webkit-user-select: none;
  backface-visibility: hidden;
  transition: 0.2s;
  .msgbox-top {
    padding-bottom: 26px;
    min-height: 100px;
  }
  .msgbox-title {
    .title {
      text-align: center;
      padding-left: 0;
      margin-bottom: 0;
      font-weight: bold;
      color: #333;
      & > * {
        line-height: 50px;
      }
    }
  }
  .msgbox-content {
    display: flex;
    align-items: center;
    position: relative;
    color: $one_level_color;
    margin: 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .sub-title {
      font-size: 30px;
      color: $three_level_color;
      margin-top: 16px;
    }
  }
}
.msgbox-title, .msgbox-content {
  padding: 0 22px;
}
.msgbox-btns {
  width: 100%;
  border-top: 1px solid #DDDDDD;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    width: 50%;
    height: 100%;
    font-size: 36px;
  }
  .msgbox-btn-cancel {
    border-right: 1px solid #DDDDDD;
  }
}
.fade-enter {
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.7);
}
.fade-leave-active {
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.9);
}
.confirm-btn-class {
  color: #997EFF;
}
.alert_window {
  width: 620px;
  background: url(./imgs/rank_window_bg.png) no-repeat center center;
  background-size: contain;
  border-radius: 30px;
  color: $rank_title_color;
}
.window_text {
  padding: 60px 34px;
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  h3 {
    font-size: 50px;
    text-shadow:0px 5px 0px #C216B7;
    text-align: center;
  }
  p{
    margin-top: 60px;
    font-size: 32px;
    line-height: 60px;
    text-align: center;
  }
  .more {
    margin-top: 20px;
    color: $rank_score_color;
    font-size: 34px;
  }
  button {
    width: 220px;
    height: 90px;
    font-size: 40px;
    font-weight: 700;
    border-radius: 45px;
    margin: 70px 25px 0;
    letter-spacing: 4px;
    color: $rank_btn_color;
    border: 4px solid $rank_btn_color;
  }
}
</style>
