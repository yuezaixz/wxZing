<template lang="pug">
.apply-container
  .apply-next(v-if="!isFull || isShare" @click="apply")
    .title(v-if="!isFull") 点击立即报名活动 {{activitys.length > 0 && activitys[0] ? ('第'+(parseInt(activitys[0].activityId) + 1)+'期'):''}}
    .title(v-else) 分享成功，点击报名
  .detail-next-disable(v-else @click="apply")
    .title() 活动已满员
  div(style="flex:1")
  .tip-container
    .tip-title TIP:
    div(style="flex:1;") 
    .tip-content 点击报名后，未来一周你将会有一段奇妙的相遇之旅，在随机组建的微信群里（周日晚间组建）你将会结识来自不同领域的人，有纹身师、电影编剧、服装设计师、歌手、创业者......在这里，你会遇到相见恨晚的soul挚友，也可能会遇到牵手相爱的亲密伴侣，当然，这一切的前提，是你一直在保持着真诚又善良的自己。
  
  div.apply-modal(:style="showApply?'':'display:none;'")
    div.weui-mask(@click="hideApply")
    div.bottom-apply-bg
    img.bottom-astronauts(src='~/static/img/astronauts2.png')
    div.bottom-apply-container
      .apply-row(style="margin-top:35px;margin-left:23px;")
        .apply-container-title 请选择感兴趣的群聊
        img.apply-container-title-img(src='~static/img/arrow_down.png')
      .apply-container-sub-title(style="margin-left:23px;margin-bottom:14px;") 选择你感兴趣的话题，进行一段奇妙的探索之旅
      .apply-wrap(style="margin-left:10px;-webkit-transform-origin-x: 0;-webkit-transform: scale(0.85);")
        .apply-select(v-for='(item, index) in activitys' @click="choseActivity(item.activityId, item.activityName)" :class="item.activityId === activityId ? 'apply-select-chose':''")
          .apply-select-title  {{item.activityName}}
      .flex-1
      .apply-bottom-button(@click="submit") 确定


</template>

<script>

import { mapState } from 'vuex'
import { setTimeout } from 'timers';

export default {
  middleware: 'wechat-oauth',
  data() {
    return {
      showApply: false,
      activityId: null,
      activityName: null,
      activitys: [],
      isFull: false,
      isShare: false
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    async apply() {
      if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
        const visit = '/register'
        this.$router.replace(visit)
        // this.$store.dispatch('showToast', {duration: 2000, str:'未注册', toastType:'icon-warn'})
        return;
      }

      if (this.isFull && !this.isShare) {
        this.$store.dispatch('showToast', {duration: 2000, str:'分享后三名好友点击即可获得加入', toastType:'icon-warn'})
      } else if (this.activitys) {
        let activity = this.activitys[0]
        let data = await this.$store.dispatch('applyActivity', {activityId:activity.activityId})
        if (data.success) {
          this.$store.dispatch('showToast', {duration: 2000, str:"报名成功", toastType:'icon-success-no-circle'})
          setTimeout(()=>this.$router.push({
            path: '/apply/success',
            query: {
              activityId: data.data.activityApplyId,
              activityName: activity.activityName
            }
          }), 1000)
        } else {
          this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
        }
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'活动报名未开始', toastType:'icon-warn'})
      }
      

      // this.showApply = true
    },
    hideApply() {
      this.showApply = false
    },
    choseActivity(activityId, activityName) {
      this.activityId = activityId
      this.activityName = activityName
    },
    async submit() {
      if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
        const visit = '/register'
        this.$router.replace(visit)
        // this.$store.dispatch('showToast', {duration: 2000, str:'未注册', toastType:'icon-warn'})
        return;
      }
      if (this.activityId || this.activityId === 0) {
        let data = await this.$store.dispatch('applyActivity', {activityId:this.activityId})
        if (data.success) {
          this.$router.push({
            path: '/apply/success',
            query: {
              activityId: data.data.activityApplyId,
              activityName: this.activityName
            }
          })
          // this.$store.dispatch('showToast', {duration: 2000, str:"报名成功", toastType:'icon-success-no-circle'})
        } else {
          this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
        }
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'请选择群聊', toastType:'icon-warn'})
      }
    }
  },

  components: {
  },

  async beforeCreate() {
    let data = await this.$store.dispatch('queryActivityings')
    console.log(data)
    if (data.success) {
      this.activitys = data.data
      this.isFull = data.isFull
      this.isShare = data.isShare
    } else if (data.code === 106) {
      setTimeout(()=>this.$router.push({
        path: '/apply/success',
        query: {
          activityId: data.data.activityId,
          activityName: data.data.activityName
        }
      }), 1000)
    } else {
      this.$store.dispatch('showToast', {duration: 3000, str:data.msg || "数据错误", toastType:'icon-warn'})
    }
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/apply.sass'></style>
