<template lang="pug">
</template>
<script>
function getUrlParam (param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)
  return result ? decodeURIComponent(result[2]) : null
}

export default {
  asyncData({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head() {
    return {
      title: '请稍等'
    }
  },
  beforeMount() {
    // 微信公众号测试工具打开链接
    //http://paodong.vipgz1.idcfengye.com/wechat-redirect?visit=about&id=2

    // const wx = window.wx
    const url = window.location.href
    this.$store.dispatch('getWechatOAuth', encodeURIComponent(url)).then(res => {
      const { data } = res
      console.log(data)
      if (data.success) {
        this.$store.dispatch('setAuthUser', data.user)
        // visit=about&id=2 => about_2 看要约定如何拼visit和参数了
        const visit = '/' + getUrlParam('state')
        this.$router.replace(visit)
      } else {
        throw new Error('用户信息获取失败')
      }
    })
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
