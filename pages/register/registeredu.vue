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
          .city-title {{displayEduStr}}
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
    nuxt-link(to='/register/registerwx'  v-if="registerInfo.degree && registerInfo.birthdayYear && registerInfo.birthdayMonth && registerInfo.birthdayDay")
      .title 下一步
    div(@click='next'  v-else)
      .title 下一步

  vue-picker(
    :show="show"
    :columns="columns"
    :defaultData="defaultData"
    :selectData="pickData"
    :link="selectDate"
    @cancel="close"
    @confirm="confirmFn"
  )
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
      selectDate: false,
      eduPickData: {
        data1:[
          {
            text:'博士及以上',
            value: 1
          },
          {
            text:'研究生',
            value: 2
          },
          {
            text:'本科',
            value: 3
          },
          {
            text:'专科',
            value: 4
          },
          {
            text:'其他',
            value: 5
          },
        ]
      },
      datePickData: {
        // 第一列的数据结构
        data1: yearsData,
        data2: monthsData,
        data3: daysData
      }
    }
  },

  computed: {
    columns() {
      return this.selectDate ? 3 : 1;
    },
    pickData() {
      return this.selectDate ? this.datePickData : this.eduPickData;
    },
    defaultData() {
      if (this.selectDate) {
        return [
          {
            text: ''+this.$store.state.registerInfo.birthdayYear+'年',
            value: this.$store.state.registerInfo.birthdayYear
          },
          {
            text: ''+this.$store.state.registerInfo.birthdayMonth+'月',
            value: this.$store.state.registerInfo.birthdayMonth
          },
          {
            text: ''+this.$store.state.registerInfo.birthdayDay+'日',
            value: this.$store.state.registerInfo.birthdayDay
          }
        ];
      } else {
        return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
          {
            text: ['保密', '博士及以上', '研究生', '本科', '专科', '其他'][this.$store.state.degree],
            value: this.$store.state.registerInfo.degree
          }
        ];
      }
    },
    displayEduStr() {
      return ['请选择', '博士及以上', '研究生', '本科', '专科', '其他'][this.$store.state.registerInfo.degree]
    },
    displayDateStr() {
      if (this.$store.state.registerInfo.birthdayYear) {
        return "" + this.$store.state.registerInfo.birthdayYear + "-" + this.$store.state.registerInfo.birthdayMonth + "-" + this.$store.state.registerInfo.birthdayDay
      } else {
        return "请选择"
      }
    },
    ...mapState([
      'registerInfo'
    ])
  },

  methods: {
    async showCityDialog(type) {
      this.toShow()
      if (type === 1) {
        this.selectDate = false;
      } else {
        this.selectDate = true;
      }
      // this.citySelectType = type
      // this.$store.dispatch('toggleLocal')
    },
    async handleCityPick() {
      this.citySelectType = 0
      // this.$store.dispatch('toggleLocal')
    },
    async next(){
      alert('请选择')
    },
    close() {
      this.show = false
    },
    confirmFn(val, val2, val3) {
      this.show = false
      if (this.selectDate) {
        this.$store.state.registerInfo.birthdayYear = val.select1.value
        this.$store.state.registerInfo.birthdayMonth = val.select2.value
        this.$store.state.registerInfo.birthdayDay = val.select3.value
      } else {
        this.$store.state.registerInfo.degree = val.select1.value
      }
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
