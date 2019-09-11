<template lang="pug">

.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .card-flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      img.card-close(src='~static/img/banner_close.png')

    .card-body(style="align-items:center;")
      .apply-success-title {{!activityApply?'--':(!activityApply.isHandle?'审核中':(activityApply.isSuccess? '报名成功':'报名失败'))}}
      .apply-success-sub-title 已报名活动：{{activityName}}
      div(style="height:34px;")
      .card-row(style="justify-content:center;")
        .apply-cancel-button 
          .apply-cancel-button-text(@click="cancel_apply") 取消报名
      div(style="height:28px;")
      .apply-success-sub-title 工作人员会将您拉入相应的活动群组，请主动添加工作人员微信号，请留意相关活动信息
      div(style="height:8px;")
      .card-row(style="justify-content:center;")
        img.apply-office-qrcode(src='~static/img/office_qrcode.png')
      .apply-success-qrcode-title 请主动添加工作人员微信
      div(style="height:40px;")

    .card-footer
  .next
    div(@click='next')
      .title 继续浏览
</template>

<script>

import { mapState } from 'vuex'
import { setTimeout } from 'timers';

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      activityName:null,
      activityId:null,
      activityApply: null
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },
  beforeMount() {
    
  },

  methods: {
    async cancel_apply() {
      if (!this.activityId) {
        this.$store.dispatch('showToast', {duration: 2000, str:"activityId不存在", toastType:'icon-warn'})
      } else {
        let data = await this.$store.dispatch('cancelApply', {activityId: this.activityId})
        if (data.success) {
          this.$store.dispatch('showToast', {duration: 2000, str:"取消成功", toastType:'icon-success-no-circle'})
          setTimeout(()=>this.$router.push({
            path: '/apply'
          }), 1600)
        } else {
          this.$store.dispatch('showToast', {duration: 2000, str:data.msg || "取消失败", toastType:'icon-warn'})
        }
      }
    },
    async next() {
      this.$router.push({
        path: '/apply'
      })
    }
  },

  components: {
  },

  async beforeCreate () {
    let activityApplyId = this.$route.query.activityId
    let data = await this.$store.dispatch('queryActivityApply', {activityApplyId})
    if (data.success) {
      this.activityApply = data.data
    }  else {
      this.$store.dispatch('showToast', {duration: 3000, str:data.msg || "数据错误", toastType:'icon-warn'})
    }
  },
  mounted() {
    this.activityId = this.$route.query.activityId
    this.activityName = this.$route.query.activityName
    console.log(this.activityId , this.activityName)
    if (!this.activityName) {
      // this.$route.
      this.$store.dispatch('showToast', {duration: 2000, str:"非法访问", toastType:'icon-warn'})
      setTimeout(()=>this.$router.push({
        path: '/apply'
      }), 1600)
      
      return;
    }
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
<style scoped, lang="sass" src='~/static/css/apply_success.sass'></style>
