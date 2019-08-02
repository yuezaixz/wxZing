<template lang="pug">
.container
  .card(class="card-mini")
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      img.card-close(src='~static/img/banner_close.png')

    .card-body(style="align-items: flex-start; justify-content: flex-start;")
      .day-user-list
        .day-title-row
          .day-dd 09
          .day-mm /5月
          .flex-1
          .day-all-user 全部 >
        .user-list-row
          .user-block
            img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
            .user-title 用户的名称
            .user-sub-title 23岁
            .user-sub-title 平面设计师
            .user-sub-title 10万以内
          .user-block
            img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
            .user-title 用户的名称
            .user-sub-title 23岁
            .user-sub-title 平面设计师
            .user-sub-title 10万以内
          .user-block
            img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
            .user-title 用户的名称
            .user-sub-title 23岁
            .user-sub-title 平面设计师
            .user-sub-title 10万以内
          .user-block
            img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
            .user-title 用户的名称
            .user-sub-title 23岁
            .user-sub-title 平面设计师
            .user-sub-title 10万以内
          .user-block
            img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
            .user-title 用户的名称
            .user-sub-title 23岁
            .user-sub-title 平面设计师
            .user-sub-title 10万以内

          .user-block
      .day-user-list
        .day-title-row
          .day-dd 09
          .day-mm /5月
          .flex-1
          .day-all-user 全部 >
        .user-list-row
          .user-block
            img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
            .user-title 用户的名称
            .user-sub-title 23岁
            .user-sub-title 平面设计师
            .user-sub-title 10万以内
          .user-block
            img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
            .user-title 用户的名称
            .user-sub-title 23岁
            .user-sub-title 平面设计师
            .user-sub-title 10万以内
          .user-block

      

    .card-footer
  .next(@click="lookOther")
    .title 查看其他会员资料
</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      userGroups: [],
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
    lookOther() {
      this.$router.push({
        path: '/zing'
      })
    }
  },

  components: {
  },

  async beforeCreate() {
    let isFollow = this.$route.query.isFollow
    let data
    if (isFollow) {
      data = await this.$store.dispatch('queryFollowUsers', zingUserId)
    } else {
      data = await this.$store.dispatch('queryZingUsers', zingUserId)
    }
    
    if (data.success) {
      this.userGroups = data.data
    } else {
      this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
    }
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/index.sass'></style>
