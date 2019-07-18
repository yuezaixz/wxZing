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
      div {{authUser.nickname}}

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
