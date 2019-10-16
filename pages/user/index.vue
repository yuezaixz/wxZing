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
      .card-vip-top
        .vip-eslap-time 会员到期时间：2019-09-18
        div(style="flex:1")
        img.user-edit(src='~static/img/icon_edit.png' @click='editUser')
      .card-column
        .card-row(style='justify-content:center;')
          .big_avatar_container
            img.big_avatar(:src='authUser.avatarUrl')
            .big_avatar_vip VIP
      .card-column(style='height:15px;')
      .card-column
        .card-row(style='justify-content:center;')
          .user-name-title {{authUser.nickname}}
        .card-row(style='justify-content:center;-webkit-transform-origin-x: 50%;-webkit-transform: scale(0.75);')
          .user-name-sub-title 办公室编号：
          .user-name-sub-title(style='text-decoration:underline;-webkit-transform-origin-x: 0%;') {{displayUserId(authUser)}}
      .card-column(style='height:15px;')
      .card-item-container
        .card-row(style='justify-content:center;')
          .card-column(@click="gotoLoveList" style='display:flex;align-items: center;flex:1;')
            img.index_item_img(src='~static/img/index_good_img.png')
            .index-item-sub-title 互赞即可查看微信号
            .index-item-title {{loversCount}}，赞我
          .v-divider(style="height:73px;")
          .card-column(@click="gotoFellowList" style='display:flex;align-items: center;flex:1;')
            img.index_item_img(src='~static/img/index_love_img.png')
            .index-item-sub-title 对方将出现在你的群组
            .index-item-title {{followersCount}}，为你而来
        .card-row(style='height:15px;')
      .flex-1( v-if="!activityState")
      .card-column(style='height:20px;')
      .index-bottom( v-if="activityState")
        .index-signup-success 您已报名成功!
        .card-column(style='height:15px;')
        .index-signup-success-content( v-if="activityFellowUser" @click="jumpToWxAction") 你已申请与 <em style="text-decoration:underline">${activityFellowUser.nickname}(ID{{displayUserId(activityFellowUser)}})</em>进入同一群聊，<em style="text-decoration:underline">请添加工作人员微信</em>，若已经添加，则无需重复添加，工作人员将在2019<em style="text-decoration:underline">请添加工作人员微信</em>，若已经添加，则无需重复添加，工作人员将在2019/11/18日前把你加进相关群聊
        .index-signup-success-content( v-else @click="jumpToWxAction") 你已报名参加办公室计划第2期活动，<em style="text-decoration:underline">请添加工作人员微信</em>，若已经添加，则无需重复添加，工作人员将在2019/11/18日前把你加进相关群聊
      .index-bottom( v-if="!activityState")
        .bottom-sub-title 您尚未报名活动
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
    ...mapState([
      'authUser',
      'followersCount',
      'loversCount',
      'activityState',
      'activityFellowUser'
    ])
  },

  methods: {
    displayUserId(userItem) {
      if (!userItem || !userItem.userId) {displayUserId
        return "--";
      }
      return (Array(6).join(0) + userItem.userId).slice(-6)
    },
    applyAction() {
      this.$router.replace('/apply')
    },
    editUser() {
      this.$router.replace('/register/registercity')
    },
    jumpToWxAction() {
      this.$router.replace('/apply/success')
    },
    gotoFellowList() {
      if (this.$store.state.followersCount > 0) {
        this.$router.push({
          path: '/user/lovelist',
          query: {
            isFollow: true
          }
        })
      }
    },
    gotoLoveList() {
      if (this.$store.state.loversCount > 0) {
        this.$router.push({
          path: '/user/lovelist',
          query: {
            isFollow: false
          }
        })
      }
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
