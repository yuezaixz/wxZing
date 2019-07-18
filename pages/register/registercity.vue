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
          .city-title {{displayHometown}}
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:29px;')
        .card-row(@click='toggleLocal()')
          .check-box(style='margin-left:20px;')
            .check-box-select(v-if='authUser.isLocal')
          .check-title(style='margin-left:5px;') 我是土著

      .card-column(style='height:49px;')
      .card-column(v-if='!authUser.isLocal')
        .card-row(style='justify-content:flex-start;')
          .card-title 你工作的城市
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 选择你的城市，找到留住你的人
        .city-control(@click='showCityDialog(2)')
          .city-title {{displayCity}}
          img.card-arrow-down(src='~static/img/arrow_down.png')

    .card-footer
  .next
    nuxt-link(to='/register/registeredu'  v-if="(authUser.isLocal && authUser.hometown) || (authUser.hometown && authUser.city)")
      .title 下一步
    div(@click='next'  v-else)
      .title 下一步

  vue-picker(
    :show="show"
    :columns="columns"
    :defaultData="defaultData"
    :selectData="cityPickData"
    link=true
    @cancel="close"
    @confirm="confirmFn"
  )
</template>

<script>

import { mapState } from 'vuex'
import { provsData, citysData } from '~/components/areaData.js'
import vuePicker from '~/components/picker'

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      citySelectType: 0,
      selectCity: false,
      info:{},
      show: false,
      cityPickData: {
        data1:provsData,
        data2:citysData
      },
      columns: 2,
    }
  },

  computed: {
    displayHometown() {
      var code = this.$store.state.authUser.hometown
      return this.displayName(code) || "请选择城市"
    },
    displayCity() {
      var code = this.$store.state.authUser.city
      return this.displayName(code) || "请选择城市"
    },
    defaultData() {
      // 防止错误的数据，读取微信数据后就先要转换成city code

      var code = this.selectCity?this.$store.state.authUser.city : this.$store.state.authUser.hometown
      var provCode = code && code.length == 6 ? (code.substr(0,2)+'0000'):null
      return code ? [
        {
          text: provsData[provCode],
          value: provCode
        },
        {
          text: citysData[provCode][code],
          value: code
        }
      ]:[
        {
          text: '',
          value: ''
        },
        {
          text: '',
          value: ''
        }
      ]
      
    },
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    displayName(code) {
      var provCode = code && code.length == 6 ? (code.substr(0,2)+'0000'):null
      var cityName
      var provName
      for (const key in citysData[provCode]) {
        if (citysData[provCode].hasOwnProperty(key)) {
          const element = citysData[provCode][key];
          if (element.value === code) {
            cityName = element.text
          }
        }
      }
      for (const key in provsData) {
        const element = provsData[key];
        if (element.value === provCode) {
          provName = element.text
        }
      }
      return cityName && provName ? (provName + cityName) : cityName;
    },
    async toggleLocal() {
      this.$store.dispatch('toggleLocal')
    },
    async showCityDialog(type) {
      this.toShow()
      if (type === 1) {
        this.selectCity = false;
      } else {
        this.selectCity = true;
      }
      // this.citySelectType = type
      // this.$store.dispatch('toggleLocal')
    },
    async handleCityPick() {
      this.citySelectType = 0
      // this.$store.dispatch('toggleLocal')
    },
    async next() {
        this.$store.dispatch('showToast', {duration: 2000, str:'请选择', toastType:'icon-warn'})
    },
    close() {
      this.show = false
    },
    async confirmFn(val, val2) {
      this.show = false
      if (this.selectCity) {
        await this.$store.dispatch('selectCity', val.select2.value)
        // this.$store.state.authUser.city = val.select2.value
      } else {
        await this.$store.dispatch('selectHometown', val.select2.value)
        // this.$store.state.authUser.hometown = val.select2.value
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
