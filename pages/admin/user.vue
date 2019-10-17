<template lang="pug">
.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      div 用户后台
      //- img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-row
        input(v-model="searchName" style="width:90px;" value="searchName", placeholder='用户名')
        input(v-model="searchId" style="width:90px;" value="searchId", placeholder='ID')
        div(@click="search") 搜索
      .card-row(v-for='(item, index) in displayUsers' @click="detailAction(item.userId)")
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
      users: [],
      displayUsers:[],
      searchId: null,
      searchName: null
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
    },
    search() {
      this.displayUsers = this.users.filter(user => (!this.searchName || ~user.nickname.indexOf(this.searchName)) && (!this.searchId || ~(''+user.userId).indexOf(this.searchId)) )
    }
  },

  components: {
  },
  async beforeCreate(){
    let {data} = await axios.get('/api/users')
    if (data && data.success) {
      this.searchId = null
      this.searchName = null
      this.users = data.data
      this.displayUsers = this.users
    }
  }
}
</script>


<style scoped, lang="sass" src='~/static/css/index.sass'></style>