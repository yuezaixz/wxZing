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
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的性别
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 性别选择后不可更改，却不限于肉体或灵魂 
      .card-column(style='height:89px;')
      .card-column
        .card-row(style='justify-content:center;')
          .card-block(@click='selectGender(1)')
            img.card-gender(v-if='registerInfo.gender===1' src='~static/img/male_selected_icon.png')
            img.card-gender(v-else src='~static/img/male_icon.png')
            .card-prompt(style="margin-top:36px;") 我是男生
            //- img(v-if='activeRoute !== item.name' src='~/static/images/home.png')
            //- img(v-else src='~/static/images/home-selected.png')
          .card-block(style="width:56px;")
          .card-block(@click='selectGender(2)')
            img.card-gender(v-if='registerInfo.gender===2' src='~static/img/female_selected_icon.png')
            img.card-gender(v-else src='~static/img/female_icon.png')
            .card-prompt(style="margin-top:36px;") 我是女生

    .card-footer
  .next
    nuxt-link(to='/register/registercity')
      .title 下一步

</template>

<script>

import { mapState } from 'vuex'

var weui
if (process.BROWSER_BUILD) {
  weui = require('weui.js')
}

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
      'registerInfo'
    ])
  },
  beforeMount() {
    const wx = window.wx
    const url = window.location.href

    this.$store.dispatch('getWechatSignature', url).then(res => {
      if (res.data.success) {
        const params = res.data.params
        wx.config({
          // debug: true, // 调试模式
          appId: params.appId, // 公众号的唯一标识
          timestamp: params.timestamp, // 生成签名的时间戳
          nonceStr: params.noncestr, // 生成签名的随机串
          signature: params.signature, // 签名
          jsApiList: [
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'onMenuShareTimeline',
            'showMenuItems',
            'hideAllNonBaseMenuItem'
          ]
        })
        wx.ready(() => {
          setTimeout(() => {
            weui.toast('权限成功', 3000);
          }, 10000)
        })
      }
    })
  },

  methods: {
    async selectGender(gender) {
      this.$store.dispatch('selectGender', gender)
    },
    async next() {
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
