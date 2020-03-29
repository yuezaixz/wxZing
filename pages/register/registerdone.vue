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
      .card-column(style='height:80px;')
      .card-column(style="display:flex;")
        img.done-start(src='~static/img/done_start_2.png')
      .card-column
        .card-column(style='height:32px;')
        .card-row(style='justify-content:center;')
          .done-title 注册成功!
      div(style="flex:1")
      .card-column
        .card-done-inner(style='text-align:center;padding-left: 0px;') 办公室计划只计划偶遇，不计划爱情， 
        .card-done-inner(style='text-align:center;padding-left: 0px;') 因为它会自然发生。

      .card-column(style='height:30px;')
      .card-column(style='width:120%;margin-left:-10%;-webkit-transform-origin-x: 50%;-webkit-transform: scale(0.8);')
        .card-private(style='text-align:center;padding-left: 0px;') 点击下一步代表你已同意我们的《隐私政策》以及《服务条款》。
      .card-column(style='height:10px;')

    .card-footer
  div(style="flex:1;")
  .next
    //- nuxt-link.link(to='/register/registerzing') //因为不用互赞了，所以跳过
    nuxt-link.link(to='/apply')
      .title 立即报名

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
    displayUserId() {
      return (Array(6).join(0) + this.$store.state.authUser.userId).slice(-6)
    },
    ...mapState([
      'authUser'
    ])
  },

  methods: {
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
