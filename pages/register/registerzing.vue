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
      .card-column(style='height:26px;')
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 为你推荐
        .card-column(style='height:10px;')
        .card-inner 推荐给你一些优质用户，他们好看又活泼

      
    .card-footer
  .next
    nuxt-link(to='/zing')
      .title 查看资料库

</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      user: {},
      activeGender:0,
      rUsers: []
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
  },
  async mounted() {
    var responseData = await this.$store.dispatch('queryLast9Users')
    if (responseData.success) {
      this.rUsers = data.data
    } else {
      this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
    }
  },
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
