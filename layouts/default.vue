<template lang="pug">
  #app
    #main
      nuxt
    v-nav
    
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
      'showToast'
    ])
  },
}
</script>
