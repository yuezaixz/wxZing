<template lang="pug">
.container
  .card(style="height: calc(100% - 144px) !important")
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
        .title-16 年龄
      .card-row
        .city-control(@click='showCityDialog(3)' style="margin-top:10px;")
          .city-title {{authUser.filterAge ? ['不限', '20岁以上', '25岁以上', '30岁以上', '35岁以上'][authUser.filterAge] : '不限'}}
          .div(style="flex:1")
          img.card-arrow-down(src='~static/img/arrow_down.png')

      //- div(style='height:23px;')
      //- .card-row(style='margin-bottom:19px;')
      //-   .title-16 身高
      //- .card-row
      //-   .city-control(@click='showCityDialog(1)' style="margin-top:10px;")
      //-     .city-title {{authUser.filterHeight ? (''+authUser.filterHeight+'cm以上') : '不限'}}
      //-     .div(style="flex:1")
      //-     img.card-arrow-down(src='~static/img/arrow_down.png')
      //- div(style='height:29px;')
      //- .card-row
      //-   .solid-line(style="width:100%;height:1px")
      //- div(style='height:23px;')
      //- .card-row(style='margin-bottom:19px;')
      //-   .title-16 学历
      //- .card-row
      //-   .city-control(@click='showCityDialog(2)' style="margin-top:10px;")
      //-     .city-title {{authUser.filterDegree ? ['不限', '博士及以上', '研究生', '本科', '专科'][authUser.filterDegree] : '不限'}}
      //-     .div(style="flex:1")
      //-     img.card-arrow-down(src='~static/img/arrow_down.png')

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
// import { heightDataWithZero } from '~/components/dateData.js'
import vuePicker from '~/components/picker'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      zingUser: null,
      selectDate: 1,
      columns: 1,
      show: false,
      agePickData: {
        data1:[
          {
            text:'不限',
            value: 0
          },
          {
            text:'20岁以上',
            value: 1
          },
          {
            text:'25岁以上',
            value: 2
          },
          {
            text:'30岁以上',
            value: 3
          },
          {
            text:'35岁以上',
            value: 4
          },
        ]
      },
      // eduPickData: {
      //   data1:[
      //     {
      //       text:'不限',
      //       value: 0
      //     },
      //     {
      //       text:'博士及以上',
      //       value: 1
      //     },
      //     {
      //       text:'研究生',
      //       value: 2
      //     },
      //     {
      //       text:'本科',
      //       value: 3
      //     },
      //     {
      //       text:'专科',
      //       value: 4
      //     },
      //     {
      //       text:'其他',
      //       value: 5
      //     },
      //   ]
      // },
      // heightPickData: {
      //   data1: heightDataWithZero
      // }
    }
  },

  computed: {
    pickData() {
      return this.agePickData;
      // return [this.heightPickData, this.eduPickData ][this.selectDate-1];
    },
    defaultData() {
      return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
        {
          text: ['不限', '20岁以上', '25岁以上', '30岁以上', '35岁以上'][this.$store.state.authUser.filterAge],
          value: this.$store.state.authUser.filterAge
        }
      ];
      // if (this.selectDate == 2) {
      //   return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
      //     {
      //       text: ['不限', '博士及以上', '研究生', '本科', '专科'][this.$store.state.authUser.degree],
      //       value: this.$store.state.authUser.degree
      //     }
      //   ];
      // } else {
      //   return [//0 保密 1博士及以上 2研究生 3本科 4专科 5专科以下
      //     {
      //       text: this.$store.state.height? (''+this.$store.state.height+'cm以上'): '不限',
      //       value: this.$store.state.authUser.height
      //     }
      //   ];
      // }
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
        this.toggleFilterHeight(val.select1.value)
        // this.$store.dispatch('selectHeight', val.select1.value)
      } else if (this.selectDate == 3) {
        this.toggleFilterAge(val.select1.value)
        // this.$store.dispatch('selectHeight', val.select1.value)
      } else {
        this.toggleFilterDegree(val.select1.value)
        // this.$store.dispatch('selectDegree', val.select1.value)
      }
    },
    toShow() {
      this.show = true
    },
    commitFilter() {
      
    }, 
    async toggleFilterAge(degree) {
      await this.$store.dispatch('selectFilter', {filterAge: degree, filterDegree:this.$store.state.authUser.filterDegree, filterHeight:this.$store.state.authUser.filterHeight, filterGender: this.$store.state.authUser.filterGender})
    }, 
    async toggleFilterDegree(degree) {
      await this.$store.dispatch('selectFilter', {filterAge: this.$store.state.authUser.filterAge, filterDegree:degree, filterHeight:this.$store.state.authUser.filterHeight, filterGender: this.$store.state.authUser.filterGender})
    }, 
    async toggleFilterHeight(height) {
      await this.$store.dispatch('selectFilter', {filterAge: this.$store.state.authUser.filterAge, filterDegree:this.$store.state.authUser.filterDegree, filterHeight:height, filterGender: this.$store.state.authUser.filterGender})
    }, 
    async toggleFilterGender(filterGender) {
      await this.$store.dispatch('selectFilter', {filterAge: this.$store.state.authUser.filterAge, filterDegree:this.$store.state.authUser.filterDegree, filterHeight:this.$store.state.authUser.filterHeight, filterGender: filterGender})
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
