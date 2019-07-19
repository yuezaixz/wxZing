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
      .card-column(style='height:25px;')
      .card-column
        .card-row(style='justify-content:center;')
          .big_avatar_container
            img.big_avatar(:src='authUser.avatarUrl')
            .big_avatar_vip VIP
      .card-column(style='height:20px;')
        .card-row(style='justify-content:center;')
          .title {{authUser.nickname}}
        .card-row(style='justify-content:center;')
          .sub-title 办公室编号:
          .sub-title(style='text-decoration:underline;') {{displayUserId}}

    .card-footer
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import randomToken from 'random-token'
import Uploader from 'qiniu-web-uploader'

export default {
  middleware: 'wechat-info',
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

<style scoped, lang="sass" src='~/static/css/index.sass'></style>
