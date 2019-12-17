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
        .page-title 第12页，共12页
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的昵称
        .card-column(style='height:10px;')
        .card-inner 建议和微信昵称一致
        .city-control
          input.about-input(v-model="authUser.nickname" value="authUser.nickname", placeholder='点击在此输入')

    .card-footer
  div(style="flex:1;")
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
    async next() {
      if (this.$store.state.authUser.nickname) {
        var data = await this.$store.dispatch('selectName', this.$store.state.authUser.nickname)
        if (data.success) {
          const visit = '/register/registerabout'
          this.$router.push({path: visit})
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
