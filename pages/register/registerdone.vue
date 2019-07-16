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
        .card-column(style='height:20px;')
        .card-row(style='justify-content:center;')
          .done-title 注册成功！
        .card-column(style='height:10px;')
        .card-inner(style='text-align:center;padding-left: 0px;') 欢迎加入办公室计划，编号0000001是您的专属号码
        .card-inner(style='text-align:center;padding-left: 0px;') 由这串数字开始，
        .card-inner(style='text-align:center;padding-left: 0px;') 让有趣的灵魂遇见好看的皮囊~

    .card-footer
  img.astronauts(src='~static/img/astronauts.png')
  .next
    nuxt-link(to='/register/registercode')
      .title 查看会员

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
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
