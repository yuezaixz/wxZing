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
        //- .city-control
        div.about-btn(@click='showAbout(true)')
          .title 关于我
          //- input.about-input(v-model="authUser.aboutMe" value="authUser.aboutMe", placeholder='关于我')
        //- .card-column(style='height:30px;')
        //- .city-control
        div.about-btn(@click='showAbout(false)')
          .title 关于另一半
          //- input.about-input(v-model="authUser.aboutOther" value="authUser.aboutOther", placeholder='理想型')

    .card-footer
  .next
    div(@click='next')
      .title 下一步
  
  .apply-modal(:style="showAboutInput?'':'display:none;'")
    .card-row(style="height:60px;")
      div.cancel(@click='cancelAboutInput') 取消
      div(style="flex:1")
      div.save(@click='saveAboutInput') 保存
    .card-row(style="flex:1; overflow:auto;")
      textarea.modal-about-input(
        v-model="aboutInput"
        value="aboutInput", 
        :placeholder='isAboutMe?"请用很酷的姿态描述一下自己...":"请描述一下对另一半的想法..."'
      )

</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      user: {},
      activeGender:0,
      showAboutInput: false,
      isAboutMe: false,
      aboutMe: null,
      aboutOther: null,
      aboutInput: null
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    displayAboutContent() {
      return this.isAboutMe?this.aboutMe:this.aboutOther
    },
    async selectGender(gender) {
      this.$store.dispatch('selectGender', gender)
    },
    async showAbout(isAboutMe) {
      this.isAboutMe = isAboutMe
      this.showAboutInput = true
      this.aboutInput = isAboutMe? this.aboutMe: this.aboutOther
      console.log(isAboutMe)
    },
    async cancelAboutInput() {
      this.showAboutInput = false
    },
    async saveAboutInput() {
      this.showAboutInput = false
      if (this.isAboutMe) {
        this.aboutMe = this.aboutInput
      } else {
        this.aboutOther = this.aboutInput
      }
      this.aboutInput = ''
    },
    async next() {
      if (this.aboutMe && this.aboutOther) {
        var data = await this.$store.dispatch('selectAbout', {
          'aboutMe':this.aboutMe,
          'aboutOther':this.aboutOther
        })
        if (data.success) {
          const visit = '/register/registerdone'
          this.$router.replace(visit)
        }
      } else {
        const visit = '/register/registerdone'
        this.$router.replace(visit)
      }
    }
  },

  components: {
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
