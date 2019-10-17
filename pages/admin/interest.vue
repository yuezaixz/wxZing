<template lang="pug">
.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      div 兴趣后台
      //- img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-row
        input(v-model="interest.name" value="interest.name", placeholder='兴趣名')
        input(v-model="interest.aboutInterest" value="interest.aboutInterest", placeholder='兴趣说明')
        div(@click="submit") 提交
      .card-row(v-for='(item, index) in interests')
        div ID：{{item.interestId}}
        div ||兴趣名：{{item.name}}
        div ||兴趣说明：{{item.aboutInterest}}
    .card-footer
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'

export default {
  middleware: 'wechat-admin',
  data() {
    return {
      interest: {},
      interests: [],
      activeGender:0,
      isSignup: true
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    async submit() {
      console.log({...this.interest})
      let { data } = await axios.post('/api/interest', {...this.interest})
      if (data.success) {
        await this.$store.dispatch('showToast', {duration: 3000, str:`操作成功`, toastType:'icon-success-no-circle'})
        this.interest = {}
        let {data} = await axios.get('/api/interests')
        if (data && data.success) {
          this.interests = data.data
        }
      } else {
        this.$store.dispatch('showToast', {duration: 3000, str:data.msg || "操作失败", toastType:'icon-warn'})
      }
    }
  },

  components: {
  },
  async beforeCreate(){
    let {data} = await axios.get('/api/interests')
    if (data && data.success) {
      this.interests = data.data
    }
  }
}
</script>


<style scoped, lang="sass" src='~/static/css/index.sass'></style>