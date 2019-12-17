<template lang="pug">

.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .card-flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      //- img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-column(style='height:45px;')
        .page-title 第10页，共12页
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 工作城市是否有房产
        .card-column(style='height:10px;')
        .card-inner 请填写你目前工作城市的房产情况
        .card-column(style='height:40px;')
        .card-column
          .card-select-row
            .city-select-flex1(@click='selectHouseType(1)', :style="{'justify-content':'flex-start', 'padding-left': '16px', 'background-color': authUser.houseType === 1 ? '#97aef1':''}")
              .city-title 无房产,仍在奋斗
          .card-select-row
            .city-select-flex1(@click='selectHouseType(2)', :style="{'justify-content':'flex-start', 'padding-left': '16px', 'background-color': authUser.houseType === 2 ? '#97aef1':''}")
              .city-title 和家人同住
          .card-select-row
            .city-select-flex1(@click='selectHouseType(3)', :style="{'justify-content':'flex-start', 'padding-left': '16px', 'background-color': authUser.houseType === 3 ? '#97aef1':''}")
              .city-title 已购房产
          .card-select-row
            .city-select-flex1(@click='selectHouseType(0)', :style="{'justify-content':'flex-start', 'padding-left': '16px', 'background-color': !authUser.houseType ? '#97aef1':''}")
              .city-title 我想保密

    .card-footer
  .next
    div.link(@click='next')
      .title 下一步

</template>

<script>

import { mapState } from 'vuex'

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

  methods: {
    async selectHouseType(houseType) {
      this.$forceUpdate();
      await this.$store.dispatch('selectHouseType', houseType)
    },
    async next() {
      if (!this.$store.state.authUser.houseType) {
        this.$store.state.authUser.houseType = 0
      }
      const visit = '/register/registerphoto'
      this.$router.replace(visit)
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
