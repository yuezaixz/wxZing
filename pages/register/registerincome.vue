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
          .card-title 你的年收入
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 只有四个区间选择，贫穷限制了我的想象
        .card-column(style='height:40px;')
        .card-column
          .card-select-row
            .city-select-flex1(@click='selectIncome(1)', :style="{'background-color': authUser.income === 1 ? '#97aef1':''}")
              .city-title 10W内
            .city-select-flex1(@click='selectIncome(2)', :style="{'background-color': authUser.income === 2 ? '#97aef1':''}")
              .city-title 10-20W
          .card-select-row
            .city-select-flex1(@click='selectIncome(3)', :style="{'background-color': authUser.income === 3 ? '#97aef1':''}")
              .city-title 20-50W
            .city-select-flex1(@click='selectIncome(4)', :style="{'background-color': authUser.income === 4 ? '#97aef1':''}")
              .city-title 50W以上

    .card-footer
  .next
    div(@click='next')
      .title 下一步

</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      user: {},
      activeGender:0
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    async selectIncome(income) {
      this.$forceUpdate();
      await this.$store.dispatch('selectIncome', income)
    },
    async next() {
      if (this.$store.state.authUser.income) {
        const visit = '/register/registerhouse'
        this.$router.replace(visit)
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'请选择', toastType:'icon-warn'})
      }
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
