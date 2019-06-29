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
          .card-title 请添加你的照片
          img.card-arrow-down(src='~static/img/arrow_down.png')
        .card-column(style='height:10px;')
        .card-inner 上传一些生活照，首张将作为封面展示
        .card-column(style='height:40px;')
        .card-select-row(style='flex-wrap: wrap; margin-right: 20px;')
          .city-photo-flex1(v-for='(item, index) in registerInfo.photos' @click='selectPhoto(index)')
            img.card-photo(src='~static/img/sample_photo.png')
          .city-photo-flex1(@click='selectPhoto(registerInfo.photos.length+1)')
            img.add-photo(src='~static/img/add.png')
            .add-title 点击添加照片

    .card-footer
  .next
    nuxt-link(to='/register/registerabout')
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
      'registerInfo'
    ])
  },

  methods: {
    async selectHouseType(houseType) {
      this.$store.dispatch('selectHouseType', houseType)
    },
    async next() {
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
