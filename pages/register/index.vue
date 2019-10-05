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
        .page-title 第1页，共10页
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 你的性别
          //- img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:5px;')
        .card-inner 请选择你的性别，选择后不可更改 
      .card-column(style='height:89px;')
      .card-column
        .card-row(style='justify-content:center;')
          .card-block(@click='selectGender(1)')
            img.card-gender(v-if='authUser.gender===1' src='~static/img/male_selected_icon.png')
            img.card-gender(v-else src='~static/img/male_icon.png')
            .card-prompt(style="margin-top:26px;") 男生
            //- img(v-if='activeRoute !== item.name' src='~/static/images/home.png')
            //- img(v-else src='~/static/images/home-selected.png')
          .card-block(style="width:56px;")
          .card-block(@click='selectGender(2)')
            img.card-gender(v-if='authUser.gender===2' src='~static/img/female_selected_icon.png')
            img.card-gender(v-else src='~static/img/female_icon.png')
            .card-prompt(style="margin-top:26px;") 女生

    .card-footer
  .next
    nuxt-link(to='/register/registercity')
      .title 下一步
</template>

<script>

import { mapState } from 'vuex'
import { setTimeout } from 'timers';

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
  beforeMount() {
    
  },

  methods: {
    async selectGender(gender) {
      this.$store.dispatch('selectGender', gender)
    },
    async next() {
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
