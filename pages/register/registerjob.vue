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
        .page-title 第7页，共12页
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的工作性质
        .card-column(style='height:10px;')
        .card-inner 你目前所在单位的性质
        .card-column(style='height:40px;')
        .card-column
          .card-select-row
            .city-select-flex1(@click='selectJobType(1)', :style="{'background-color': authUser.jobType === 1 ? '#97aef1':''}")
              .city-title 国企
            .city-select-flex1(@click='selectJobType(2)', :style="{'background-color': authUser.jobType === 2 ? '#97aef1':''}")
              .city-title 外企
          .card-select-row
            .city-select-flex1(@click='selectJobType(3)', :style="{'background-color': authUser.jobType === 3 ? '#97aef1':''}")
              .city-title 私企
            .city-select-flex1(@click='selectJobType(4)', :style="{'background-color': authUser.jobType === 4 ? '#97aef1':''}")
              .city-title 事业单位
          .card-select-row
            .city-select-flex1(@click='selectJobType(5)', :style="{'background-color': authUser.jobType === 5 ? '#97aef1':''}")
              .city-title 自由职业
            .city-select-flex1(@click='selectJobType(6)', :style="{'background-color': authUser.jobType === 6 ? '#97aef1':''}")
              .city-title 创业
          .card-select-row
            .city-select-flex1(@click='selectJobType(0)', :style="{'background-color': authUser.jobType === 0 ? '#97aef1':''}")
              .city-title 其他
            .city-select-flex1(style="border:none;")

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
    async selectJobType(jobType) {
      this.$forceUpdate();
      await this.$store.dispatch('selectJobType', jobType)
    },
    async next() {
      if (this.$store.state.authUser.jobType) {
        const visit = '/register/registercareer'
        this.$router.replace(visit)
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'请填写', toastType:'icon-warn'})
      }
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
