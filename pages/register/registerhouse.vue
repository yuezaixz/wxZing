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
          .card-title 是否有房产
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 你目前工作的城市，名下是否有房产
        .card-column(style='height:40px;')
        .card-column
          .card-select-row
            .city-select-flex1(@click='selectHouseType(1)', :style="{'background-color': registerInfo.houseType === 1 ? '#97aef1':''}")
              .city-title 无房产,仍在奋斗
            .city-select-flex1(@click='selectHouseType(2)', :style="{'background-color': registerInfo.houseType === 2 ? '#97aef1':''}")
              .city-title 和家人同住
          .card-select-row
            .city-select-flex1(@click='selectHouseType(3)', :style="{'background-color': registerInfo.houseType === 3 ? '#97aef1':''}")
              .city-title 已购房产
            .city-select-flex1(@click='selectHouseType(0)', :style="{'background-color': registerInfo.houseType === 0 ? '#97aef1':''}")
              .city-title 我想保密

    .card-footer
  .next
    nuxt-link(to='/register/registerphoto')
      .title 下一步

</template>

<script>

import { mapState } from 'vuex'

export default {
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

  methods: {
    async selectHouseType(houseType) {
      this.$store.dispatch('selectHouseType', houseType)
    },
    async next() {
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
