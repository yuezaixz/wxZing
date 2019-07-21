<template lang="pug">
.container
  .next
    .title 活动报名
  
</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-info',
  data() {
    return {
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
  },

  components: {
  },

  beforeCreate() {
    // this.$store.dispatch('queryActivityState')
    // this.$store.dispatch('queryLovers')
    // this.$store.dispatch('queryFollowers')
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/apply.sass'></style>
