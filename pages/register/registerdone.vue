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
      .card-column(style='height:60px;')
      .card-column(style="display:flex;")
        img.done-start(src='~static/img/done_start.png')
      .card-column
        .card-column(style='height:20px;')
        .card-row(style='justify-content:center;')
          .done-title 注册成功
        .card-column(style='height:55px;')
        .card-done-inner(style='text-align:center;padding-left: 0px;') 办公室计划只计划偶遇，不计划爱情， 
        .card-done-inner(style='text-align:center;padding-left: 0px;') 因为她会自然发生。
      div(style="flex:1")

    .card-footer
  .next
    nuxt-link.link(to='/register/registerzing')
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
