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
      .card-column(style='height:45px;')
        .page-title 第2页，共10页
      .card-column(v-if='!authUser.isLocal')
        .card-row(style='justify-content:flex-start;')
          .card-title 你工作的城市
          //- img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:5px;')
        .card-inner 选择你所在的城市，找到和你相遇的人
        .city-control(@click='showCityDialog(2)')
          .city-title(:style="{'color': authUser.city ? '#313131':'#8e8e8e'}") {{displayCity(authUser)}}
          .div(style="flex:1")
          img.card-arrow-down(src='~static/img/arrow_down.png')
        //- .tip-content tips：因为我们接下来主要做厦门城市， 所以这个工作城市可以是默认厦门，本段删除。

      .card-column(style='height:49px;')
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的故乡
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:5px;')
        .card-inner 我们会推荐一些和你相同故乡的人
        .city-control(@click='showCityDialog(1)')
          .city-title(:style="{'color': authUser.hometown ? '#313131':'#8e8e8e'}") {{displayHometown(authUser)}}
          .div(style="flex:1")
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
    displayHometown(authUser) {
      var code = authUser.hometown
      return this.displayName(code) || "请选择城市"
    },
    displayCity(authUser) {
      var code = authUser.city
      return this.displayName(code) || "请选择城市"
    },
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
      provName = provName.replace('省', ' ')
      cityName = cityName.replace('市', ' ')
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
      this.$forceUpdate();
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
