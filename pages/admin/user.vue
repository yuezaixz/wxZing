<template lang="pug">
.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      div 用户后台
      img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-row(v-for='(item, index) in users' @click="detailAction(item.userId)")
        div ID：{{item.userId}}
        div ||名：{{item.nickname}}
        div ||电话：{{item.phoneNumber}}
        div ||微信号：{{item.wxcode}}
    .card-footer
</template>
<script>

import { mapState } from 'vuex'
import axios from 'axios'

export default {
  middleware: 'wechat-admin',
  data() {
    return {
      user: {},
      users: []
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    detailAction(userId) {
      this.$router.push({
        path: '/zing/detail',
        query: {
          zingUserId: userId
        }
      })
    }
  },

  components: {
  },
  async beforeCreate(){
    let {data} = await axios.get('/api/users')
    if (data && data.success) {
      this.users = data.data
    }
  }
}
</script>


<style scoped, lang="sass" src='~/static/css/index.sass'></style>