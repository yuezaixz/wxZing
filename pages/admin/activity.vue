<template lang="pug">
.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      div 活动后台
      //- img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-row
        input(v-model="activity.activityName" style="width:90px;" value="activity.activityName", placeholder='活动名')
        input(v-model="activity.memo" style="width:90px;" value="activity.memo", placeholder='活动说明')
        input(v-model="activity.interestId" style="width:90px;" value="activity.interestId", placeholder='兴趣ID')
        div(@click="submit") 提交
      .card-row(v-for='(item, index) in activitys')
        div ID：{{item.activityId}}
        div ||名：{{item.activityName}}
        div ||说明：{{item.memo}}
    .card-footer
</template>
<script>

import { mapState } from 'vuex'
import axios from 'axios'

export default {
  middleware: 'wechat-admin',
  data() {
    return {
      activity: {},
      activitys: [],
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
      console.log({...this.activity})
      let { data } = await axios.post('/api/activity', {...this.activity})
      if (data.success) {
        await this.$store.dispatch('showToast', {duration: 3000, str:`操作成功`, toastType:'icon-success-no-circle'})
        this.activity = {}
        let {data} = await axios.get('/api/activitys')
        if (data && data.success) {
          this.activitys = data.data
        }
      } else {
        this.$store.dispatch('showToast', {duration: 3000, str:data.msg || "操作失败", toastType:'icon-warn'})
      }
    }
  },

  components: {
  },
  async beforeCreate(){
    let {data} = await axios.get('/api/activitys')
    if (data && data.success) {
      this.activitys = data.data
    }
  }
}
</script>


<style scoped, lang="sass" src='~/static/css/index.sass'></style>