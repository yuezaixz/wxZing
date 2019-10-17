<template lang="pug">
.container
  .card(style="height: calc(100% - 144px)")
    .card-header
      //- img.card-close(src='~static/img/banner_close.png' style="margin-left:10px;margin-right:5px;")
      img.card-bgsjh(src='~static/img/banner_bgsjh.png' style="margin-left:10px;")
      img.card-op(src='~static/img/banner_office_planning.png')
      .flex-1
      .card-header-filter(style="padding-right:20px;" )
        .card-header-filter-title 筛选条件

    .card-body
      div(style='height:20px;')
      .card-row(style='margin-bottom:8px;')
        .title-12 发现范围
        img.card-arrow-down(src='~static/img/arrow_down.png')
      .card-row(style='margin-bottom:17px;')
        .sub-title-9 请选择展示的人
      .card-row(style='margin-bottom:17px;')
        .check-box(@click='toggleOnlyCurr(false)')
          .check-box-select(v-if='!authUser.onlyCurrActivity')
        .check-title(style='margin-left:5px;') 全部
        .check-box(style='margin-left:20px;' @click='toggleOnlyCurr(true)')
          .check-box-select(v-if='authUser.onlyCurrActivity')
        .check-title(style='margin-left:5px;') 只看报名本期活动
      .card-row
        .dash-line(style="width:100%;height:1px")
      .card-row(style='margin-bottom:8px;margin-top:17px;')
        .title-12 性别
        img.card-arrow-down(src='~static/img/arrow_down.png')
      .card-row(style='margin-bottom:17px;')
        .sub-title-9 请选择资料展示的性别
      .card-row
        .card-gender-item(@click="toggleFilterGender(1)" :class="authUser.filterGender === 1?'card-gender-item-select':''")
          img.card-gender-img(src='~static/img/male_mini_icon.png')
          .card-gender-title 男性
        .card-gender-item(@click="toggleFilterGender(2)" :class="authUser.filterGender === 2?'card-gender-item-select':''")
          img.card-gender-img-female(src='~static/img/female_mini_icon.png')
          .card-gender-title 女性
        .card-gender-item(@click="toggleFilterGender(0)" :class="authUser.filterGender === 0?'card-gender-item-select':''")
          img.card-gender-img-unknow(src='~static/img/unknow_gender_mini_icon.png')
          .card-gender-title 不限
    .card-footer
  .next
    div(@click='next')
      .title 确定
</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      zingUser: null
    }
  },

  computed: {
    ...mapState([
      'authUser',
    ])
  },

  methods: {
    commitFilter() {
      
    }, 
    async toggleOnlyCurr(onlyCurrActivity) {
      await this.$store.dispatch('selectFilter', {onlyCurrActivity, filterGender: this.$store.state.authUser.filterGender})
    }, 
    async toggleFilterGender(filterGender) {
      await this.$store.dispatch('selectFilter', {onlyCurrActivity: this.$store.state.authUser.onlyCurrActivity, filterGender})
    },
    async next() {
      this.$router.push({
        path: '/zing'
      })
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/zing.sass'></style>
