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
          .card-title 你的微信号
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 注意：
        .card-inner 填对微信号，才能找到对的人
        .city-control
          .city-title(style='width:60px;') 微信号
          input.city-input(v-model="authUser.wxcode" value="authUser.wxcode")

    .card-footer
  .next
    div(@click='next')
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
