<template lang="pug">
.container
  .user
    .user-header
      .user-header-text {{ authUser.nickname }}
      img(:src="authUser.avatarUrl")
    .user-address
      cell(title='收获地址' iconName='place')
      .user-content {{ authUser.userAddress || authUser.city }}
    .user-phone
      cell(title='电话' iconName='phone_iphone')
      .user-content {{ authUser.phoneNumber }}
    .user-name
      cell(title='姓名' iconName='account_box')
      .user-content {{ authUser.name }}
</template>

<script>
import cell from '~/components/cell.vue'
import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  head () {
    return {
      title: '个人中心'
    }
  },
  beforeMount() {
    console.log('beforeMount', this.authUser)
    this.$store.dispatch('fetchFollowers')
  },
  computed: {
    ...mapState([
      'authUser'
    ])
  },
  methods: {},
  beforeCreate () {
    
  },
  components: {
    cell
  }
}
</script>

<style lang="sass" scoped src='~/static/sass/user.sass'></style>
