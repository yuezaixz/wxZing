<template lang="pug">
  #app
    #main
      nuxt
    v-nav
    div#dialog(:style="showDialog?'':'display:none;'")
      div.weui-mask(@click="dismissDialog")
      div.weui-dialog
        div.weui-dialog__hd
          strong.weui-dialog__title {{dialogTitle}}
        div.weui-dialog__bd {{dialogContent}}
        div.weui-dialog__ft
          div.weui-dialog__btn.weui-dialog__btn_default(@click="defaultClick" style="font-size:15px;") {{dialogDefault}}
          div.weui-dialog__btn.weui-dialog__btn_primary(@click="primaryClick" style="font-size:15px;") {{dialogPrimary}}

    div#toast(:style="showToast?'':'display:none;'")
      div.weui-mask_transparent
      div.weui-toast
        i.weui-icon_toast(:class="toastType")
        p.weui-toast__content {{toastStr}}
</template>

<script>

import { mapState } from 'vuex'
import vNav from '~/components/nav.vue'

export default {
  components: {
    vNav
  },

  computed: {
    ...mapState([
      'toastType',
      'toastStr',
      'showToast',
      'showDialog',
      'dialogTitle',
      'dialogContent',
      'dialogPrimary',
      'dialogDefault',
      'dialogDefaultFn',
      'dialogPrimaryFn',
    ])
  },

  methods: {
    dismissDialog() {
      this.$store.dispatch('dismissDialog')
    },
    defaultClick() {
      if (this.dialogDefaultFn) {
        this.dialogDefaultFn()
      }
      this.$store.dispatch('dismissDialog')
    },
    primaryClick() {
      if (this.dialogPrimaryFn) {
        this.dialogPrimaryFn()
      }
      this.$store.dispatch('dismissDialog')
    },
  }
}
</script>
