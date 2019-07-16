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
          .city-title {{displayEduStr || '请选择'}}
          img.card-arrow-down(src='~static/img/arrow_down.png')

      .card-column(style='height:89px;')
      .card-column(v-if='!authUser.isLocal')
        .card-row(style='justify-content:flex-start;')
          .card-title 你的生日
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 从此记得你生日的人又多了一个
        .city-control(@click='showCityDialog(2)')
          .city-title {{displayDateStr || '请选择'}}

    .card-footer
  .next
    nuxt-link(to='/register/registerwx'  v-if="authUser.degree && authUser.birthday")
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
        if (this.$store.state.authUser.birthday) {
          var splits = this.$store.state.authUser.birthday.split('-')
          return [
            {
              text: ''+splits[0]+'年',
              value: parseInt(splits[0])
            },
            {
              text: ''+splits[1]+'月',
              value: parseInt(splits[1])
            },
            {
              text: ''+splits[2]+'日',
              value: parseInt(splits[2])
            }
          ];
        } else {
          return [
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
          ];
        }
      } else {
        return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
          {
            text: ['保密', '博士及以上', '研究生', '本科', '专科', '其他'][this.$store.state.degree],
            value: this.$store.state.authUser.degree
          }
        ];
      }
    },
    displayEduStr() {
      return this.$store.state.authUser.degree ? ['请选择', '博士及以上', '研究生', '本科', '专科', '其他'][this.$store.state.authUser.degree] : this.$store.state.authUser.degree
    },
    displayDateStr() {
      return this.$store.state.authUser.birthday
    },
    ...mapState([
      'authUser'
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
      if (this.$store.state.authUser.degree) {
        alert('请选择出生日期')
      } else {
        alert('请选择学位')
      }
    },
    close() {
      this.show = false
    },
    confirmFn(val, val2, val3) {
      this.show = false
      if (this.selectDate) {
        this.$store.dispatch('selectDate', `${val.select1.value}-${val.select2.value}-${val.select3.value}`)
      } else {
        this.$store.dispatch('selectDegree', val.select1.value)
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
