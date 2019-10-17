<template lang="pug">

.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .card-flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      //- //- img.card-close(src='~static/img/banner_close.png')

    .card-body
      .card-column(style='height:45px;')
        .page-title 第8页，共12页
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的职业或领域
        .card-column(style='height:10px;')
        .card-inner 请填写你工作中的主要岗位
        .city-control
          //- .city-titl(v-if='!authUser.career') 请在此输入
          input.city-input(v-model="authUser.career" value="authUser.career" , placeholder='请在此填写')

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
    async next() {
      if (this.$store.state.authUser.career) {
        var data = await this.$store.dispatch('selectCareer', this.$store.state.authUser.career)
        if (data.success) {
          const visit = '/register/registerincome'
          this.$router.replace(visit)
        }
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
