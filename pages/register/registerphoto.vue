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
        .page-title 第11页，共12页
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 请添加一些你的照片
        .card-column(style='height:10px;')
        .card-inner 首张作为封面展示，点击图片可重新上传
        .card-column(style='height:40px;')
        .card-select-row(style='flex-wrap: wrap; margin-right: 20px;')
          .city-photo-flex1(v-for='(item, index) in authUser.photos')
            img.card-photo(:src='"http://wxzing.podoon.cn/"+item')
            input(type='file', @change='uploadImg(index, $event)')
          .city-photo-flex1(v-if='authUser.photos.length < 6')
            .add-title(style="font-size:23px;") +
            .add-title 添加照片
            input(type='file', @change='uploadImg(authUser.photos.length, $event)')

    .card-footer
  div(style="flex:1;")
  .next
    div.link(@click='next')
      .title 下一步
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import randomToken from 'random-token'
import Uploader from 'qiniu-web-uploader'

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
    async selectPhoto(photoIndex) {
      console.log(photoIndex)
      // this.$store.dispatch('selectHouseType', houseType)
    },

    async getUptoken (key) {
      let res = await axios.get('/api/qiniu/token', {
        params: {
          key: key
        }
      })

      return res.data.token
    },

    async uploadImg (index, e) {
      console.log('authUser', this.$store.state.authUser)
      this.$store.dispatch('showToast', {str:'上传中'})
      let file = e.target.files[0]
      let key = randomToken(32)

      key = `products/${key}`
      let token = await this.getUptoken(key)

      let uptoken = {
        uptoken: token,
        key: Buffer.from(key).toString('base64')
      }
      console.log(uptoken)
      Uploader.QINIU_UPLOAD_URL = 'http://up-z2.qiniu.com/'

      let uploader = new Uploader(file, uptoken) 

      uploader.on('progress', () => {
        console.log(uploader.percent)
        // let dashoffset = this.upload.dasharray * (1 - uploader.percent)
        // this.upload.dashoffset = dashoffset
      })

      let res = await uploader.upload()

      uploader.cancel()
      console.log(res)
      this.$store.state.authUser.photos.push(res.key)

      this.$store.dispatch('showToast', {duration: 2000, str:'上传成功', toastType:'icon-success-no-circle'})
      // this.edited.images.push(res.key)
    },
    async next() {
      if (this.$store.state.authUser.photos) {
        var data = await this.$store.dispatch('selectPhoto', this.$store.state.authUser.photos)
        if (data.success) {
          const visit = '/register/registername'
          this.$router.push({path: visit})
        }
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
