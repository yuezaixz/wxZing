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
      div(style="height:45px;")
      img.apply-office-qrcode(src='~static/img/apply_success_top_img.png' style="height:58px;width:50px;")
      .apply-success-title {{!activityApply?'--':(!activityApply.isHandle?'审核中':(activityApply.isSuccess? '报名成功':'报名失败'))}}
      .apply-success-sub-title( v-if="!activityApply || !activityApply.fellowUserId" style='white-space:pre;') 
                                                        | 你已报名参加办公室计划第2期活动，请添加工作人员微信
                                                        | 若已经添加，则无需重复添加
                                                        | 工作人员将在2019/08/18日前把你加进
      .apply-success-sub-title( v-else style='white-space:pre;') 
                                                        | 你已申请与 <em style="text-decoration:underline" ><em style="font-weight: bold; font-size:15px;" >用户的ID</em>({{activityApply.fellowUserId}})</em>进入同一群聊，
                                                        | 请添加工作人员微信，若已经添加，
                                                        | 则无需重复添加
                                                        | 工作人员将在2019/11/18前把你加进相关群聊
      div(style="height:21px;")
      img.apply-office-qrcode(src='~static/img/office_qrcode.png')
      div(style="height:4px;")
      .apply-success-qrcode-title 长按识别二维码，添加工作人员微信
      div(style="height:20px;")
      .apply-cancel-button 
        .apply-cancel-button-text(@click="cancel_apply") 取消报名

    .card-footer
  .next
    div(@click='next')
      .title 查看更多会员
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

<style scoped, lang="sass" src='~/static/css/apply_success.sass'></style>
