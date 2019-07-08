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
          .card-title 你的学历
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 学历是部分的实力
        .city-control(@click='showCityDialog(1)')
          .city-title 本科
          img.card-arrow-down(src='~static/img/arrow_down.png')

      .card-column(style='height:89px;')
      .card-column(v-if='!registerInfo.isLocal')
        .card-row(style='justify-content:flex-start;')
          .card-title 你的生日
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 从此记得你生日的人又多了一个
        .city-control(@click='showCityDialog(2)')
          .city-title {{displayDateStr}}

    .card-footer
  .next
    nuxt-link(to='/register/registerwx')
      .title 下一步

  vue-picker(
    :show="show"
    :columns="columns"
    :defaultData="defaultData"
    :selectData="pickData"
    link=true
    @cancel="close"
    @confirm="confirmFn"
  )

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
import { yearsData, monthsData, daysData } from '~/components/dateData.js'
import vuePicker from '~/components/picker'

export default {
  data() {
    return {
      citySelectType: 0,
      info:{},
      show: false,
      columns: 3,
      defaultData: [
        {
          text: '2000年',
          value: 2000
        },
        {
          text: '11月',
          value: 11
        },
        {
          text: '14日',
          value: 14
        }
      ],
      pickData: {
        // 第一列的数据结构
        data1: yearsData,
        data2: monthsData,
        data3: daysData
      }
    }
  },

  computed: {
    displayDateStr() {
      return "" + this.defaultData[0].value + "-" + this.defaultData[1].value + "-" + this.defaultData[2].value
    },
    ...mapState([
      'registerInfo'
    ])
  },

  methods: {
    async showCityDialog(type) {
      this.toShow()
      // this.citySelectType = type
      // this.$store.dispatch('toggleLocal')
    },
    async handleCityPick() {
      this.citySelectType = 0
      // this.$store.dispatch('toggleLocal')
    },
    close() {
      this.show = false
    },
    confirmFn(val, val2, val3) {
      this.show = false
      this.defaultData = [val.select, val2.select, val3.select]
    },
    toShow() {
      this.show = true
    }
  },
  components: {
    vuePicker
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
