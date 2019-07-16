<template lang="pug">

.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .card-flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 请输入您的验证码
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 请填写您手机收到的验证码
        .card-code-container(@click="foucusInput")
          input(type="tel" v-model="code" id='vcode' ref="vcode" maxlength="4" @focus="focused = true" @blur="focused = false" :disabled="telDisabled")
          label.border(v-for='(item, index) in 4' :class="{'animated': focused && cursorIndex === index}" :key='index' v-text="codeArr[index]")
          label.retry-prompt(@click="sendSmsCode") {{retrySeconds > 0?''+retrySeconds+'s':'重发'}}

    .card-footer
  .next
    div(@click='next')
      .title 下一步

</template>

<script>

import { mapState } from 'vuex'
import { setTimeout } from 'timers';

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      telDisabled: false,
      focused: false,
      code:'',
      retrySeconds: 0
    }
  },

  computed: {
    ...mapState([
      'authUser',
      'registerInfo'
    ]),
    codeArr() {
      return this.code.split('')
    },
    cursorIndex() {
      return this.code.length
    }
  },

  watch: {
    code(newVal) {
      this.code = newVal.replace(/[^\d]/g,'')
      if (newVal.length > 5) {
        // this.telDisabled = true
        console.log(newVal)
        this.$refs.vcode.blur()
        setTimeout(() => {
          alert(`vcode: ${this.code}`)
        }, 500)
      }
    }
  },

  methods: {
    async foucusInput() {
      this.$refs.vcode.focus()
    },
    async startCountRetry() {
      if (this.retrySeconds == 0) {
        this.retrySeconds = 60
        this.countDown()
      }
    },
    async countDown() {
      this.retrySeconds--
      if (this.retrySeconds > 0) {
        setTimeout(this.countDown, 1000)
      }
    },
    async sendSmsCode() {
      if ((await this.$store.dispatch('sendSmscode', {tel: this.$store.state.registerInfo.tel})).success ) {
        this.startCountRetry()
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'无法发送验证码', toastType:'icon-warn'})
      }
    },
    async next() {
      if (this.code && this.code.length == 4) {
        var data = await this.$store.dispatch('checkSmsCode', {tel: this.$store.state.registerInfo.tel, smscode: this.code})
        if (data.success) {
          const visit = '/register/registerjob'
          this.$router.replace(visit)
        } else {
          this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
        }
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'请填写验证码', toastType:'icon-warn'})
      }
    }
    
  },

  components: {
  },
  async mounted() {
    if (this.$store.state.registerInfo.tel) {
      var responseData = await this.$store.dispatch('sendSmscode', {tel: this.$store.state.registerInfo.tel})
      console.log(responseData)
      if (responseData.success ) {
        this.startCountRetry()
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'无法发送验证码', toastType:'icon-warn'})
      }
    } else {
      const visit = '/register/registertel'
      this.$router.replace(visit)
    }
  },
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
