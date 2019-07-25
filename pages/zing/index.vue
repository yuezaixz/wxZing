<template lang="pug">
.container
  .card
    .card-header
      img.card-close(src='~static/img/banner_close.png' style="margin-left:10px;margin-right:5px;")
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      .flex-1
      .card-header-filter(@click="filter" style="padding-right:20px;" )
        .card-header-filter-title 筛选
        img.card-arrow-down(src='~static/img/arrow_down.png')

    .card-body
      .card-column(style='height:30px;')

    .card-footer
</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      zingUser: null
    }
  },

  computed: {
    ...mapState([
      'authUser',
    ])
  },

  methods: {
    displayUserId(userId) {
      return (Array(6).join(0) + userId).slice(-6)
    },
    filter() {
      this.$router.push({
        path: '/zing/filter'
      })
    }
  },

  components: {
  },

  async beforeCreate() {
    let data = await this.$store.dispatch('randomZing')
    if (data.success) {
      this.zingUser = data.data
    } else {
      this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
    }
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/zing.sass'></style>
