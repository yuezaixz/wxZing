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
        .page-title 第3页，共12页
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的学历
        .card-column(style='height:10px;')
        .card-inner 请选择你的最高学历
        .city-control(@click='showCityDialog(1)' style="margin-top:10px;")
          .city-title.title-sftext(v-if="displayEduStr(authUser)") {{displayEduStr(authUser)}}
          .city-title.title-prompt(v-else) 请选择
          .div(style="flex:1")
          img.card-arrow-down(src='~static/img/arrow_down.png')

      .card-column(style='height:30px;')
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的身高
        .card-column(style='height:10px;')
        .card-inner 请选择你身体成熟后的身高
        .city-control(@click='showCityDialog(3)' style="margin-top:10px;")
          .city-title.title-sftext(v-if="displayHeightStr(authUser)") {{displayHeightStr(authUser)}}
          .city-title.title-prompt(v-else) 请选择
          .div(style="flex:1")
          img.card-arrow-down(src='~static/img/arrow_down.png')

      .card-column(style='height:30px;')
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的生日
        .card-column(style='height:10px;')
        .card-inner 填写出生年月将为您匹配合适的对象
        .city-control(@click='showCityDialog(2)' style="margin-top:10px;")
          .city-title.title-sftext(v-if="displayDateStr(authUser)") {{displayDateStr(authUser)}}
          .city-title.title-prompt(v-else) 请选择
          .div(style="flex:1")
          img.card-arrow-down(src='~static/img/arrow_down.png')

    .card-footer
  div(style="flex:1;")
  .next
    nuxt-link.link(to='/register/registerwx'  v-if="authUser.degree && authUser.birthday")
      .title 下一步
    div.link(@click='next'  v-else)
      .title 下一步

  vue-picker(
    :show="show"
    :columns="columns"
    :defaultData="defaultData"
    :selectData="pickData"
    :link="selectDate==2"
    @cancel="close"
    @confirm="confirmFn"
  )
</template>

<script>

import { mapState } from 'vuex'
import { yearsData, monthsData, daysData, heightData } from '~/components/dateData.js'
import vuePicker from '~/components/picker'

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      citySelectType: 0,
      info:{},
      show: false,
      selectDate: 1,
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
      },
      heightPickData: {
        data1: heightData
      }
    }
  },

  computed: {
    columns() {
      return this.selectDate == 2 ? 3 : 1;
    },
    pickData() {
      return [this.eduPickData, this.datePickData, this.heightPickData,][this.selectDate-1];
    },
    defaultData() {
      if (this.selectDate == 2) {
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
      } else if (this.selectDate == 1) {
        return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
          {
            text: ['保密', '博士及以上', '研究生', '本科', '专科', '其他'][this.$store.state.degree],
            value: this.$store.state.authUser.degree
          }
        ];
      } else {
        return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
          {
            text: this.$store.state.authUser.height || '160cm',
            value: this.$store.state.authUser.height || 160
          }
        ];
      }
    },
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    displayEduStr(authUser) {
      return authUser.degree ? ['请选择', '博士及以上', '研究生', '本科', '专科', '其他'][authUser.degree] : authUser.degree
    },
    displayDateStr(authUser) {
      return authUser.birthday
    },
    displayHeightStr(authUser) {
      return authUser.height ? authUser.height+'cm' : ''
    },
    async showCityDialog(type) {
      this.toShow()
      this.selectDate = type
      // this.citySelectType = type
      // this.$store.dispatch('toggleLocal')
    },
    async handleCityPick() {
      this.citySelectType = 0
      // this.$store.dispatch('toggleLocal')
    },
    async next(){
        this.$store.dispatch('showToast', {duration: 2000, str:'请选择', toastType:'icon-warn'})
    },
    close() {
      this.show = false
    },
    confirmFn(val, val2, val3) {
      this.show = false
      if (this.selectDate == 2) {
        this.$store.dispatch('selectDate', `${val.select1.value}-${val.select2.value}-${val.select3.value}`)
      } else if (this.selectDate == 1) {
        this.$store.dispatch('selectDegree', val.select1.value)
      } else {
        this.$store.dispatch('selectHeight', val.select1.value)
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
