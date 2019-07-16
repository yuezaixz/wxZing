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
          .card-title 你的昵称
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 美丽的人类， 
        .card-column(style='height:2px;')
        .card-inner 请给自己取一个好听的名字吧
        .city-control
          input.about-input(v-model="authUser.nickname" value="authUser.nickname", placeholder='点击在此输入')

    .card-footer
  .next
    //- nuxt-link(to='/register/registerdone')
    //-   .title 下一步
    div(@click='done')
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
    async done() {
      var registerInfo = this.$store.state.registerInfo
      if (authUser.openid) {

      } else {
        this.$store.dispatch('signin', {
          openid,
          unionid,
          code,
          nickname,
          wxcode,
          gender,
          degree,
          birthday,
          city,
          tel,
          hometown,
          career,
          income,
          jobType,
          photos,
          houseType,
          aboutMe,
          aboutOther,
          smscode
        })
      }
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
