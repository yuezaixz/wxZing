<template lang="pug">

.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .card-flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      //- img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-column(style='height:45px;')
        .page-title 第4页，共12页
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的微信号
        .card-column(style='height:10px;')
        .card-inner 这是对方联系你的唯一方式，请务必填写正确
        .city-control
          .city-title.title-sftext(style='width:60px;') 微信号
          input.city-input(v-model="authUser.wxcode" placeholder="请在此填写" value="authUser.wxcode")
        .card-column(style='height:10px;')
        .card-inner(style="font-size: 12px;-webkit-transform-origin-x: 0;-webkit-transform: scale(0.83);") 请务必确认微信号是正确的，若填写错误，则管理人员 无法与您取得联系，从而无法参与活动。

    .card-footer
  .next
    div.link(@click='next')
      .title 下一步

</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      user: {},
      activeGender:0
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    async selectGender(gender) {
      this.$store.dispatch('selectGender', gender)
    },
    async next() {
      // /register/registertel
      if (this.$store.state.authUser.wxcode) {
        var data = await this.$store.dispatch('selectWxcode', this.$store.state.authUser.wxcode)
        if (data.success) {
          if (!this.$store.state.authUser.tel) {
            const visit = '/register/registertel'
            this.$router.replace(visit)
          } else {
            const visit = '/register/registerjob'
            this.$router.replace(visit)
          }
        }
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'请填写', toastType:'icon-warn'})
      }
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
