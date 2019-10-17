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
        .page-title(@click='next') 跳过
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 关于我，关于你
        .card-column(style='height:10px;')
        .card-inner(style="margin-right:25px;") 好的表达让人印象深刻，大大增加成功概率，填写完成后，我们会把您的资料重点推送给更多的用户。若当下不方便，可以跳过，随后再补充， 
        .city-control
          input.about-input(v-model="authUser.aboutMe" value="authUser.aboutMe", placeholder='关于我')
        .card-column(style='height:10px;')
        .city-control
          input.about-input(v-model="authUser.aboutOther" value="authUser.aboutOther", placeholder='理想型')

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
    async selectGender(gender) {
      this.$store.dispatch('selectGender', gender)
    },
    async next() {
      if (this.$store.state.authUser.aboutMe && this.$store.state.authUser.aboutOther) {
        var data = await this.$store.dispatch('selectAbout', {
          'aboutMe':this.$store.state.authUser.aboutMe,
          'aboutOther':this.$store.state.authUser.aboutOther
        })
        if (data.success) {
          const visit = '/register/registerdone'
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
