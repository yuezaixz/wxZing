<template lang="pug">
.container
  .card
    .card-header
      //- img.card-close(src='~static/img/banner_close.png' style="margin-left:10px;margin-right:5px;")
      img.card-bgsjh(src='~static/img/banner_bgsjh.png' style="margin-left:10px;")
      img.card-op(src='~static/img/banner_office_planning.png')
      .flex-1
      .card-header-filter(@click="filter" style="padding-right:20px;" )
        .card-header-filter-title 筛选
        img.card-arrow-down(src='~static/img/arrow_down.png')

    .zing-card-body(v-if="zingUser")
      .whole-card-photo-container
        img.whole-card-photo( v-if="zingUser.photos && zingUser.photos.length > 0" @click="zingDetail" :src='"http://wxzing.podoon.cn/"+zingUser.photos[0]+"?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100"')
        div.whole-card-photo(v-else style="background-color:black;" @click="zingDetail")
      .index-apply-block(v-if="zingUser.isApply") 已报名
      .index-info-block
        .index-info-title {{zingUser.nickname}}
        .index-info-sub-title(style="margin:5px 0 7px 0;") {{displayEduStr(zingUser)}} / {{['其他', '国企', '外企', '私企', '事业单位', '自由职业', '创业'][zingUser.jobType]}} / {{zingUser.career}} / {{['未知', '10w内', '10-20W', '20-50W', '50W以上'][zingUser.income]}}
        .card-row(style="justify-content: flex-start; align-items: flex-start;margin:0 0;width:100%;display: flex;")
          .info-info-item-career 
            img.info-info-item-img-male( v-if="zingUser.gender==1" src='~static/img/male_mini_simple_white.png')
            img.info-info-item-img-female( v-if="zingUser.gender==2" src='~static/img/female_mini_simple_white.png')
            .info-info-item-title {{displayAge}}
          div(style="width:10px;")
          .info-info-item-career 
            .info-info-item-title {{displayXingzuo}}
          div(style="width:10px;")
          .info-info-item-career(v-if="zingUser.height")
            .info-info-item-title {{zingUser.height}}cm

      .index-oper-block
        //- img.index-oper-avator(@click="zingDetail" :src='authUser.avatarUrl')
        img.index-oper-item(@click="zingUserAction" src='~static/img/good.png')
        img.index-oper-item(@click="rechose" src='~static/img/cancel.png')


    .zing-card-body(v-else style="height: calc(100% - 37px);")
      

    .card-footer
</template>

<script>

import { mapState } from 'vuex'
import wechat from '~/static/mixins/wechat.js'

export default {
  middleware: 'wechat-oauth',
  data() {
    return {
      zingUser: null,
      execludeUserIds: []
    }
  },

  computed: {
    displayXingzuo() {
      var returnXingzuoIndex;

      var birthday = this.zingUser.birthday
      if (!birthday) {
        return '--';
      }
      var strBirthdayArr=birthday.split("-");
      if (strBirthdayArr.length < 3) {
        returnXingzuoIndex = 0
      } else {
        var m = strBirthdayArr[1];
        var d = strBirthdayArr[2];
        // 输出0～12的数字，0表示摩羯，1表示水瓶，依此类推，...，11是射手，12是摩羯。
        var result = m - (d < '102223444433'.charAt(m - 1) - -19)
        result += 1
        result %= 12
        returnXingzuoIndex = result
      }
      return ['未知','魔羯座','水瓶座','双鱼座','白羊座','金牛座','双子座','巨蟹座',
        '狮子座','处女座','天秤座','天蝎座','射手座'][returnXingzuoIndex]
    },
    displayAge() {
      var birthday = this.zingUser.birthday
      var returnAge;
      if (!birthday) {
        return 0;
      }
      var strBirthdayArr=birthday.split("-");
      var birthYear = strBirthdayArr[0];
      var birthMonth = strBirthdayArr[1];
      var birthDay = strBirthdayArr[2];
      
      let d = new Date();
      var nowYear = d.getFullYear();
      var nowMonth = d.getMonth() + 1;
      var nowDay = d.getDate();
    
      if(nowYear == birthYear){
          returnAge = 0;//同年 则为0岁
      }
      else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
      }
      return returnAge
    
    },
    ...mapState([
      'authUser',
    ])
  },

  methods: {
    displayEduStr(authUser) {
      return authUser.degree ? ['请选择', '博士及以上', '研究生', '本科', '专科', '其他'][authUser.degree] : ''
    },
    displayUserId(userId) {
      return (Array(6).join(0) + userId).slice(-6)
    },
    filter() {
      if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
        const visit = '/register'
        this.$router.replace(visit)
        // this.$store.dispatch('showToast', {duration: 2000, str:'未注册', toastType:'icon-warn'})
        return;
      }
      this.$router.push({
        path: '/zing/filter'
      })
    },
    async zingDetail() {
      // if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
      //   this.$store.dispatch('showToast', {duration: 2000, str:'未注册', toastType:'icon-warn'})
      //   return;
      // }
      this.$router.push({
        path: '/zing/detail',
        query: {
          zingUserId: this.zingUser.userId
        }
      })
    },
    async zingUserAction() {
      if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
        const visit = '/register'
        this.$router.replace(visit)
        // this.$store.dispatch('showToast', {duration: 2000, str:'未注册', toastType:'icon-warn'})
        return;
      }
      let data = await this.$store.dispatch('zingUserAction', {'zingUserId': this.zingUser.userId})
      if (data.success) {
        this.zingUser.zing = data.data
        this.$store.dispatch('showToast', {duration: 2000, str:"点赞成功", toastType:'icon-success-no-circle'})
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg || "点赞失败", toastType:'icon-warn'})
      }
    },
    async rechose() {
      if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
        const visit = '/register'
        this.$router.replace(visit)
        // this.$store.dispatch('showToast', {duration: 2000, str:'未注册', toastType:'icon-warn'})
        return;
      }
      this.$store.dispatch('showToast', {str:'查找中'})
      this.execludeUserIds.push(this.zingUser.userId)
      let data = await this.$store.dispatch('randomZing', [...this.execludeUserIds])
      console.log(data)
      if (data.success) {
        var url = window.location.href
        var sharedUrl = url
        var findIndex = url.indexOf('/zing')
        if (findIndex > 0) {
          sharedUrl = url.substring(findIndex)
        }
        findIndex = sharedUrl.indexOf('?')
        if (findIndex > 0) {
          sharedUrl = sharedUrl.substring(0, findIndex)
        }
        sharedUrl += '?zingUserId='+data.data.userId
        this.$router.replace(sharedUrl)
        this.zingUser = data.data
        this.$store.dispatch('showToast', {duration: 2000, str:'更新成功', toastType:'icon-success-no-circle'})
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:'没有合适的了', toastType:'icon-warn'})
      }
    },
  },

  components: {
  },

  mixins: [wechat],

  async beforeMount () {
    if (this.$store.state.authUser && this.$store.state.authUser.userId) {
      var url = window.location.href
      var sharedUrl = url
      var findIndex = url.indexOf('/zing')
      if (findIndex > 0) {
        sharedUrl = url.substring(0, findIndex)
      }
      
      var nickname = this.$store.state.authUser.nickname ? this.$store.state.authUser.nickname: ''

      await this.wechatInit(url, ()=>{
        wx.updateAppMessageShareData({
          title: '我是' + nickname+ '推荐来的，交个朋友吧！', // 分享标题
          desc: nickname+ '你好哇。', // 分享描述
          link: sharedUrl+'/zing/detail?zingUserId='+this.zingUser.userId+'&sharedId='+this.$store.state.authUser.userId, // 分享链接
          imgUrl: 'http://wxzing.podoon.cn/wxzing_share.jpg', // 分享图标
          success: function () {
            console.log('update share success')
            console.log(res)
          }
        })
        wx.updateTimelineShareData({ 
          title: '我是' + nickname+ '推荐来的，交个朋友吧！', // 分享标题
          desc: nickname+ '你好哇。', // 分享描述
          link: sharedUrl+'/zing/detail?zingUserId='+this.zingUser.userId+'&sharedId='+this.$store.state.authUser.userId, // 分享链接
          imgUrl: 'http://wxzing.podoon.cn/wxzing_share.jpg', // 分享图标
          success: function () {
            console.log('update time share success')
            console.log(res)
          }
        })
        wx.onMenuShareAppMessage({
          title: '我是' + nickname+ '推荐来的，交个朋友吧！', // 分享标题
          desc: nickname+ '你好哇。', // 分享描述
          link: sharedUrl+'/zing/detail?zingUserId='+this.zingUser.userId+'&sharedId='+this.$store.state.authUser.userId, // 分享链接
          imgUrl: 'http://wxzing.podoon.cn/wxzing_share.jpg', // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) { 
            console.log('on share success')
            console.log(res)
              // 用户确认分享后执行的回调函数
          },
          cancel: function () { 
            console.log('share cancel')
              // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareTimeline({
          title: '我是' + nickname+ '推荐来的，交个朋友吧！', // 分享标题
          desc: nickname+ '你好哇。', // 分享描述
          link: sharedUrl+'/zing/detail?zingUserId='+this.zingUser.userId+'&sharedId='+this.$store.state.authUser.userId, // 分享链接
          imgUrl: 'http://wxzing.podoon.cn/wxzing_share.jpg', // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) { 
            console.log('on share success')
            console.log(res)
              // 用户确认分享后执行的回调函数
          },
          cancel: function () { 
            console.log('share cancel')
              // 用户取消分享后执行的回调函数
          }
        });
      })

    }
  },
  
  async beforeCreate() {
    await this.$store.dispatch('autologin')
    let zingUserId = this.$route.query.zingUserId
    console.log(zingUserId)
    if (zingUserId) {
      let data = await this.$store.dispatch('queryUserByUserId', zingUserId)
      if (data.success) {
        this.zingUser = data.data
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
      }
    } else {
      let data = await this.$store.dispatch('randomZing')
      if (data.success) {
        var url = window.location.href
        var sharedUrl = url
        var findIndex = url.indexOf('/zing')
        if (findIndex > 0) {
          sharedUrl = url.substring(findIndex)
        }
        findIndex = url.indexOf('?')
        if (findIndex > 0) {
          sharedUrl += '&zingUserId='+data.data.userId
        } else {
          sharedUrl += '?zingUserId='+data.data.userId
        }
        this.$router.replace(sharedUrl)
        this.zingUser = data.data
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
      }
      
    }
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/zing.sass'></style>
