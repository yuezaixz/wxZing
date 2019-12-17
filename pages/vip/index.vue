<template lang="pug">
.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      //- img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-row-left23
        .title 关于会员的权限
      .card-row-left23
        .sub-title 关于购买VIP会员权限的一些说明与功能
      div(style="height:20px;")
      .card-row-left23
        img.body-item-img(src='~static/img/Love.png')
        .card-column(style="flex:1;")
          .body-item-title 精准加群
          .body-item-sub-title 精准加入心仪对象微信群，和ta一起参与活动
      .dash-line
      .card-row-left23
        img.body-item-img(src='~static/img/Shopping Bag.png')
        .card-column(style="flex:1;")
          .body-item-title 无限看资料库
          .body-item-sub-title 非会员每天有限制看30个资料
      .dash-line
      .card-row-left23
        img.body-item-img(src='~static/img/Gift.png')
        .card-column(style="flex:1;")
          .body-item-title 8倍展示机会
          .body-item-sub-title 得到普通会员8倍的曝光率
      .dash-line
      .sub-mini-title 如果选择购买订阅，费用将从你的账户收取。当前缴费期结束前，系统会提前24小时从你的账户扣费。点击购买即表示你同意我们的《隐私政策》以及《服务条款》
      .flex-1
      .card-body-bottom
        .card-body-bottom-block-left(@click="selectAction(1)" :class="selectIndex === 1 ?'card-body-bottom-selected':''")
          .card-row
            .card-body-bottom-digital 1
            .card-body-bottom-digital-follow 个月
          .card-body-bottom-price ¥60/月
          .card-body-bottom-total ¥60

        .card-body-bottom-block(@click="selectAction(2)" :class="selectIndex === 2 ?'card-body-bottom-selected':''")
          .card-row
            .card-body-bottom-digital 3
            .card-body-bottom-digital-follow 个月
          .card-body-bottom-price ¥46/月
          .card-body-bottom-total ¥138

        .card-body-bottom-block-right(@click="selectAction(3)" :class="selectIndex === 3 ?'card-body-bottom-selected':''")
          .card-row
            .card-body-bottom-digital 12
            .card-body-bottom-digital-follow 个月
          .card-body-bottom-price ¥34.9/月
          .card-body-bottom-total ¥418


    .card-footer
  .next(@click="payAction")
    .title 获取VIP
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      selectIndex: 2,
      user: {},
    }
  },

  computed: {
    ...mapState([
      'authUser',
      'followersCount',
      'loversCount',
    ])
  },

  methods: {
    selectAction(selectIndex) {
      this.selectIndex = selectIndex
    },
    async payAction() {
      if (this.selectIndex <= 0) {
        return
      }
      let { data } = await axios.post('/wechat-pay', {
        vipType: [0, 1, 3, 12][this.selectIndex]
      })
      if (data.success) {
        WeixinJSBridge.invoke('getBrandWCPayRequest', data.data, function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok"){
            this.$store.dispatch('showToast', {duration: 2000, str:"支付成功", toastType:'icon-success-no-circle'})
            setTimeout(()=>{
              let user = await this.$store.dispatch('autologin')
              if (!user) {
                this.$store.dispatch('showToast', {duration: 2000, str:"VIP用户", toastType:'icon-success-no-circle'})
              } else {
                this.$store.dispatch('showToast', {duration: 2000, str:"用户信息获取失败", toastType:'icon-warn'})
              }
            }, 1000)
            // 这里可以跳转到订单完成页面向用户展示
          }else{
            this.$store.dispatch('showToast', {duration: 2000, str:"支付失败，请重试", toastType:'icon-warn'})
          }
        });
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg || "支付失败", toastType:'icon-warn'})
      }
    }
  },

  components: {
  },

  beforeCreate() {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/vip.sass'></style>
