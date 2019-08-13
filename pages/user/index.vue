<template lang="pug">
.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-column(style='height:30px;')
      .card-column
        .card-row(style='justify-content:center;')
          .big_avatar_container
            img.big_avatar(:src='authUser.avatarUrl')
            .big_avatar_vip VIP
      .card-column(style='height:25px;')
      .card-column
        .card-row(style='justify-content:center;')
          .title {{authUser.nickname}}
        .card-row(style='justify-content:center;-webkit-transform-origin-x: 50%;-webkit-transform: scale(0.75);')
          .sub-title 办公室编号：
          .sub-title(style='text-decoration:underline;') {{displayUserId}}
      .card-column(style='height:25px;')
      .card-item-container
        .card-row(style='justify-content:center;')
          .card-column(style='display:flex;align-items: center;flex:1;')
            img.index_item_img(src='~static/img/index_good_img.png')
            .index-item-sub-title 互赞即可显示微信号
            .index-item-title {{loversCount}}，赞我
          .v-divider(style="height:73px;")
          .card-column(style='display:flex;align-items: center;flex:1;')
            img.index_item_img(src='~static/img/index_love_img.png')
            .index-item-sub-title 本期活动进入你的微信群
            .index-item-title {{followersCount}}，为我而来
        .card-row(style='height:25px;')
      .flex-1
      .index-bottom( v-if="activityState")
        .index-signup-success 已经报名本期活动！
        .card-row(style='justify-content:center;-webkit-transform-origin-x: 90px;-webkit-transform: scale(0.75);')
          .sub-title 您已成功报名本期活动，请主动添加
          .sub-title(style='text-decoration:underline;margin-left:10px;') 工作人员微信号
      .index-bottom( v-if="!activityState")
        .index-item-sub-title(style="left:28px;") 您尚未报名任何活动
        .signup-btn(@click='applyAction') 立即报名
    .card-footer
</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      user: {},
      activeGender:0,
      isSignup: true
    }
  },

  computed: {
    displayUserId() {
      return (Array(6).join(0) + this.$store.state.authUser.userId).slice(-6)
    },
    ...mapState([
      'authUser',
      'followersCount',
      'loversCount',
      'activityState'
    ])
  },

  methods: {
    applyAction() {
      this.$router.replace('/apply')
    }
  },

  components: {
  },

  beforeCreate() {
    this.$store.dispatch('queryActivityState')
    this.$store.dispatch('queryLovers')
    this.$store.dispatch('queryFollowers')
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/index.sass'></style>
