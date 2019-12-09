export default {
  methods: {
    async wechatInit(url, onReady) {
      const res = await this.$store.dispatch('getWechatSignature', url)

      const { success, params } = res.data

      if (!success) throw new Error('不能成功获取服务器签名！')

      const wx = window.wx

      wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        // debug: true,
        appId: params.appId, // 公众号的唯一标识
        timestamp: params.timestamp, // 生成签名的时间戳
        nonceStr: params.noncestr, // 生成签名的随机串
        signature: params.signature, // 签名
        jsApiList: [
          'previewImage',
          'hideAllNonBaseMenuItem',
          'showMenuItems',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'updateTimelineShareData',
          'updateAppMessageShareData',
          'chooseWXPay'
        ] // 必填，需要使用的 JS 接口列表，所有JS接口列表见附录2
      })

      wx.ready(() => {
        onReady()
        // this.wechtSetMenu()
        // this.wechatShare({})
      })
    }
  }
}
