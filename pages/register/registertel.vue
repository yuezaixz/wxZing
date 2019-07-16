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
          .card-title 你的手机号
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 手机号码隐私保护，无任何营销电话骚扰
        .city-control
          .city-title +86
          .city-title |
          input.city-input(v-model="registerInfo.tel" value="registerInfo.tel")

    .card-footer
  .next
    div(@click='next')
      .title 下一步

</template>

<script>

import { mapState } from 'vuex'

export default {
  data() {
    return {
      user: {},
      activeGender:0
    }
  },

  computed: {
    ...mapState([
      'authUser',
      'registerInfo'
    ])
  },

  methods: {
    async next() {
      if (this.$store.state.registerInfo.tel) {// TODO 验证下手机号
        //手机号正则
        var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        if (!phoneReg.test(this.$store.state.registerInfo.tel)) {
          this.$store.dispatch('showToast', {duration: 2000, str:'错误的手机号码', toastType:'icon-warn'})
        } else {
          const visit = '/register/registercode'
          this.$router.replace(visit)
        }
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'请填写手机号', toastType:'icon-warn'})
      }
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
