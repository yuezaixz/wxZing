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
          .city-title 1990-01-01

    .card-footer
  .next
    nuxt-link(to='/register/registerwx')
      .title 下一步

  vue-picker(
    :show="show"
    :columns="columns"
    :defaultData="defaultData"
    :selectData="pickData"
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
import vuePicker from '~/components/picker'

export default {
  data() {
    return {
      citySelectType: 0,
      info:{},
      show: false,
      columns: 2,
      defaultData: [
        {
          text: 1999,
          value: 1999
        },
        {
          text: 11,
          value: 11
        }
      ],
      pickData: {
        // 第一列的数据结构
        data1: [
          {
            text: 1999,
            value: 1999
          },
          {
            text: 2001,
            value: 2001
          }
        ],
        data2: [
          {
            text: 11,
            value: 11
          },
          {
            text: 12,
            value: 12
          },
          {
            text: 13,
            value: 13
          },
          {
            text: 14,
            value: 14
          },
          {
            text: 15,
            value: 15
          },
          {
            text: 12,
            value: 12
          }
        ]
      }
    }
  },

  computed: {
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
    confirmFn(val, val2) {
      this.show = false
      this.defaultData = [val.select, val2.select]
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
