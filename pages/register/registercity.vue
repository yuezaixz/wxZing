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
          .card-title 你的故乡
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 选择籍贯，如果在老家工作，可勾选“土著”
        .city-control(@click='showCityDialog(1)')
          .city-title 城市
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:29px;')
        .card-row(@click='toggleLocal()')
          .check-box(style='margin-left:20px;')
            .check-box-select(v-if='registerInfo.isLocal')
          .check-title(style='margin-left:5px;') 我是土著

      .card-column(style='height:49px;')
      .card-column(v-if='!registerInfo.isLocal')
        .card-row(style='justify-content:flex-start;')
          .card-title 你工作的城市
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 选择你的城市，找到留住你的人
        .city-control(@click='showCityDialog(2)')
          .city-title 城市
          img.card-arrow-down(src='~static/img/arrow_down.png')

    .card-footer
  .next
    nuxt-link(to='/register/registeredu')
      .title 下一步

  transition(name='slide-top')
    .payment-modal(v-if='citySelectType > 0')
      .payment-modal-header
        span(@click='handleCityPick') 确定
        span(@click='citySelectType = 0') 取消
      .payment-modal-body
        div 测试
</template>

<script>

import { mapState } from 'vuex'

export default {
  data() {
    return {
      citySelectType: 0,
      info:{}
    }
  },

  computed: {
    ...mapState([
      'registerInfo'
    ])
  },

  methods: {
    async toggleLocal() {
      this.$store.dispatch('toggleLocal')
    },
    async showCityDialog(type) {
      this.citySelectType = type
      // this.$store.dispatch('toggleLocal')
    },
    async handleCityPick() {
      this.citySelectType = 0
      // this.$store.dispatch('toggleLocal')
    },
    async next() {
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
