<template lang="pug">
.container
  .next(@click="apply")
    .title 活动报名
  
  div.apply-modal(:style="showApply?'':'display:none;'")
    div.weui-mask(@click="hideApply")
    div.bottom-apply-bg
    img.bottom-astronauts(src='~/static/img/astronauts2.png')
    div.bottom-apply-container
      .apply-row(style="margin-top:35px;margin-left:23px;")
        .apply-container-title 请选择感兴趣的群聊
        img.apply-container-title-img(src='~static/img/arrow_down.png')
      .apply-container-sub-title(style="margin-left:23px;margin-bottom:14px;") 选择你感兴趣的话题，进行一段奇妙的探索之旅
      .apply-wrap(style="margin-left:10px;-webkit-transform-origin-x: 0;-webkit-transform: scale(0.85);")
        .apply-select(v-for='(item, index) in activitys' @click="choseActivity(item.activityId)" :class="item.activityId === activityId ? 'apply-select-chose':''")
          .apply-select-title  {{item.activityName}}
      .flex-1
      .apply-bottom-button(@click="submit") 确定


</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      showApply: false,
      activityId: null,
      activitys: []
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    apply() {
      this.showApply = true
    },
    hideApply() {
      this.showApply = false
    },
    choseActivity(activityId) {
      this.activityId = activityId
      console.log(this.activityId)
    },
    async submit() {
      if (this.activityId) {
        let data = await this.$store.dispatch('applyActivity', {activityId:this.activityId})
        if (data) {
          //TODO 
          console.log('报名成功')
        }
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'请选择群聊', toastType:'icon-warn'})
      }
    }
  },

  components: {
  },

  async beforeCreate() {
    this.activitys = await this.$store.dispatch('queryActivity')
    // this.$store.dispatch('queryActivityState')
    // this.$store.dispatch('queryLovers')
    // this.$store.dispatch('queryFollowers')
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/apply.sass'></style>
