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
          .card-title 关于我，关于你
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 介绍下自己和你的理想型， 
        .card-column(style='height:2px;')
        .card-inner 优秀的介绍能让ta更快找到你
        .city-control
          input.about-input(v-model="authUser.aboutMe" value="authUser.aboutMe", placeholder='关于我')
        .card-column(style='height:10px;')
        .city-control
          input.about-input(v-model="authUser.aboutOther" value="authUser.aboutOther", placeholder='理想型')

    .card-footer
  .next
    nuxt-link(to='/register/registername')
      .title 下一步

</template>

<script>

import { mapState } from 'vuex'

export default {
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
