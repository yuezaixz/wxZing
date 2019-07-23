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
      .apply-success-title 报名成功
      .apply-success-sub-title 已报名活动：表情包与段子手
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
      div(style="height:20px;")

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
      user: {},
      activeGender:0
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

    },
    async next() {
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
<style scoped, lang="sass" src='~/static/css/apply_success.sass'></style>
