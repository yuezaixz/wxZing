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

    .zing-card-body
      .card-row(style='margin-bottom:19px;margin-top:50px;')
        .title-16 性别
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
      div(style='height:29px;')
      .card-row
        .solid-line(style="width:100%;height:1px")
      div(style='height:23px;')
      .card-row(style='margin-bottom:19px;')
        .title-16 身高
      .card-row
        .city-control(@click='showCityDialog(1)' style="margin-top:10px;")
          .city-title {{height ? (''+height+'cm') : '不限'}}
          .div(style="flex:1")
          img.card-arrow-down(src='~static/img/arrow_down.png')
      div(style='height:29px;')
      .card-row
        .solid-line(style="width:100%;height:1px")
      div(style='height:23px;')
      .card-row(style='margin-bottom:19px;')
        .title-16 学历
      .card-row
        .city-control(@click='showCityDialog(2)' style="margin-top:10px;")
          .city-title {{edu ? ['不限', '博士及以上', '研究生', '本科', '专科'][edu] : '不限'}}
          .div(style="flex:1")
          img.card-arrow-down(src='~static/img/arrow_down.png')

    .card-footer
  .next
    div(@click='next')
      .title 确定

  vue-picker(
    :show="show"
    :columns="columns"
    :defaultData="defaultData"
    :selectData="pickData"
    link=false
    @cancel="close"
    @confirm="confirmFn"
  )
</template>

<script>

import { mapState } from 'vuex'
import { heightDataWithZero } from '~/components/dateData.js'
import vuePicker from '~/components/picker'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      zingUser: null,
      selectDate: 1,
      columns: 1,
      show: false,
      height: null,
      edu: null,
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
      heightPickData: {
        data1: heightDataWithZero
      }
    }
  },

  computed: {
    pickData() {
      return [this.heightPickData, this.eduPickData ][this.selectDate-1];
    },
    defaultData() {
      if (this.selectDate == 2) {
        return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
          {
            text: ['不限', '博士及以上', '研究生', '本科', '专科'][this.$store.state.degree],
            value: this.$store.state.authUser.degree
          }
        ];
      } else {
        return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
          {
            text: this.$store.state.height || '不限',
            value: this.$store.state.authUser.height
          }
        ];
      }
    },
    ...mapState([
      'authUser',
    ])
  },

  methods: {
    async showCityDialog(type) {
      this.toShow()
      this.selectDate = type
      // this.citySelectType = type
      // this.$store.dispatch('toggleLocal')
    },
    close() {
      this.show = false
    },
    confirmFn(val, val2, val3) {
      this.show = false
      if (this.selectDate == 1) {
        // this.$store.dispatch('selectHeight', val.select1.value)
      } else {
        // this.$store.dispatch('selectDegree', val.select1.value)
      }
    },
    toShow() {
      this.show = true
    },
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
    vuePicker
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/zing.sass'></style>
