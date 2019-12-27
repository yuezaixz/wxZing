<template lang="pug">
.detail-container
  .top-swiper
    .swiper(v-swiper='swiperConfig' style="height:573px;")
      .swiper-wrapper
        .swiper-slide(v-for='item in zingUser.photos')
          img.top-swiper-img(:src='imageCDN + item + "?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100"')
      .swiper-pagination(slot="pagination")

  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      //- img.card-close(src='~static/img/banner_close.png')

    .card-body(v-if="zingUser")
      .card-row(style="margin-bottom:3px;margin-top:20px;align-items:flex-end;")
        .name-title {{zingUser.nickname}}
        .id-content NO.{{displayUserId}}
        div(style="flex:1")
        .index-apply-block(v-if="apply") 已报名
        //- .gender-block
        //-   img.gender-block-icon(v-if="zingUser.gender === 1" src="~static/img/male_mini_icon.png")
        //-   img.gender-block-icon(v-else src="~static/img/female_mini_icon.png")
        //-   .gender-block-title {{displayAge}}岁
      .card-row(style="margin-bottom:3px;")
        .sub-title {{displayName(zingUser.city)}}
      .card-row(style="justify-content: flex-start; align-items: flex-start;display: flex;")
        .info-info-item-career.yellow-item 
          img.info-info-item-img-male( v-if="zingUser.gender==1" src='~static/img/male_mini_simple_white.png')
          img.info-info-item-img-female( v-if="zingUser.gender==2" src='~static/img/female_mini_simple_white.png')
          .info-info-item-title {{displayAge}}
        div(style="width:10px;")
        .info-info-item-career.purple-item 
          .info-info-item-title {{displayXingzuo}}
        div(style="width:10px;")
        .info-info-item-career.cyan-item(v-if="zingUser.height")
          .info-info-item-title {{zingUser.height}}cm
      .card-row(style="margin-bottom:4px;margin-top:30px;")
        .content {{displayDegree}}/{{displayJobType}}/{{zingUser.career}}/{{displayIncome}}
      //- .card-row(style="margin-bottom:4px;")
      //-   .content 来自 {{zingUser.provinceName}},{{zingUser.cityName}}
      .card-row(style="margin-bottom:4px;")
        .content 来自 {{displayName(zingUser.hometown)}}
      .card-row(style="margin-bottom:28px;")
        .content 关于房产：{{displayHouseType}}
      //- .card-row(style="margin-bottom:20px;")
      //-   .content 微信号：
      //-   .wechat-content 互赞即可显示

    .card-body(v-else)
      

    .card-footer
  .card(v-if="zingUser" style="margin-top:26px;")
    .card2-header
    .card2-body
      .card-row(style="margin-top:16px;")
        .title 关于我
      .card-row.card-row-marginright(style="margin-top:10px;")
        .content {{zingUser.aboutMe || '还没想好怎么表达自己，请再等我下'}}
      .card-row(style='margin-top:40px;margin-bottom:10px;')
        .title 关于理想型
      .card-row.card-row-marginright(style='margin-bottom:50px;')
        .content {{zingUser.aboutOther || '我喜欢的人轮廓还模糊，渐渐会清晰'}}
    .card2-footer
  .detail-next(@click="zingUserAction")
      .title {{loverCount>0?(''+loverCount+','):''}}{{isLoved?'已赞':'赞'}}
  .detail-next(v-if="apply" @click="fellowUserActivity(apply.activity.activityId)")
      .title 进入共同微信群
      .vip-block
        .vip-title VIP
  .detail-next-disable(v-else @click="fellowUserActivity()")
      .title 进入共同微信群
      .vip-block
        .vip-title VIP
  
  //- img.more(src='~static/img/more.png' @click="displayApply")

  div.apply-modal(v-if="zingUser" :style="showApply?'':'display:none;'")
    div.weui-mask(@click="hideApply")
    div.bottom-apply-container
      .apply-row(@click="reportUser(zingUser.userId)")
        .apply-container-title 举报
      .apply-line
      .apply-row(@click="blackUser(zingUser.userId)")
        .apply-container-title 拉黑
      .apply-line
      .apply-row(@click="hideApply")
        .apply-container-title 取消
      
</template>

<script>

import { mapState } from 'vuex'
import { provsData, citysData } from '~/components/areaData.js'

export default {
  middleware: 'wechat-oauth',
  data() {
    return {
      swiperConfig: {
        autoplay: 4000,
        direction: 'horizontal',
        loop: true,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      zingUser: {
        photos: []
      },
      apply: null,
      loverCount: 0,
      isLoved: false,
      applyState: null,
      showApply: false,
    }
  },

  computed: {
    displayUserId() {
      if (!this.zingUser || !this.zingUser.userId) {
        return "--";
      }
      return (Array(6).join(0) + this.zingUser.userId).slice(-6)
    },
    displayDegree() {
      return ['保密', '博士及以上', '研究生', '本科', '专科', '专科以下'][this.zingUser.degree]
    },
    displayGender() {
      return ['未知','男','女'][this.zingUser.gender]
    },
    displayJobType() {
      return ['其他', '国企', '外企', '私企', '事业单位', '自由职业', '创业'][this.zingUser.jobType]
    },
    displayIncome() {
      return ['未知', '10w内', '10-20W', '20-50W', '50W以上'][this.zingUser.income]
    },
    displayHouseType() {
      if (!this.zingUser.houseType || this.zingUser.houseType >3) {
        return "我想保密"
      }
      return ['我想保密', '无房产，仍在奋斗', '和家人住', '已购房产'][this.zingUser.houseType]
    },
    displayXingzuo() {
      var returnXingzuoIndex;
      if (!this.zingUser.birthday) {
        return '--';
      }

      var birthday = this.zingUser.birthday
      var strBirthdayArr = birthday.split("-");
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
      if (!this.zingUser.birthday) {
        return '--';
      }
      var birthday = this.zingUser.birthday
      var returnAge;
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
      'imageCDN'
    ])
  },

  methods: {
    displayName(code) {
      var provCode = code && code.length == 6 ? (code.substr(0,2)+'0000'):null
      var cityName = ''
      var provName = ''
      for (const key in citysData[provCode]) {
        if (citysData[provCode].hasOwnProperty(key)) {
          const element = citysData[provCode][key];
          if (element.value === code) {
            cityName = element.text
          }
        }
      }
      for (const key in provsData) {
        const element = provsData[key];
        if (element.value === provCode) {
          provName = element.text
        }
      }
      // provName = provName.replace('省', ' ')
      // cityName = cityName.replace('市', ' ')
      return cityName && provName ? (provName + cityName) : cityName;
    },
    displayApply() {
      if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
        return;
      }
      this.showApply = true
    },
    hideApply() {
      this.showApply = false
    },
    async reportUser(userId) {
      let data = await this.$store.dispatch('reportUserAction', {'userId': userId})
      this.showApply = false
      if (data.success) {
        this.zingUser.zing = data.data
        this.$store.dispatch('showToast', {duration: 2000, str:"举报成功", toastType:'icon-success-no-circle'})
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg || "举报失败", toastType:'icon-warn'})
      }
    },
    async blackUser(userId) {
      let data = await this.$store.dispatch('blackUserAction', {'userId': userId})
      this.showApply = false
      if (data.success) {
        this.zingUser.zing = data.data
        this.$store.dispatch('showToast', {duration: 2000, str:"拉黑成功", toastType:'icon-success-no-circle'})
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg || "拉黑失败", toastType:'icon-warn'})
      }
    },
    async zingUserAction() {
      if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
        this.$router.push({
          path: '/register'
        })
        return;
      }
      if (this.isLoved) {
        let data = await this.$store.dispatch('cancelZingUserAction', {'zingUserId': this.zingUser.userId})
        if (data.success) {
          this.isLoved = false
          this.loverCount -= 1
        }
      } else {
        let data = await this.$store.dispatch('zingUserAction', {'zingUserId': this.zingUser.userId})
        if (data.success) {
          this.isLoved = true
          this.loverCount += 1
          this.$store.dispatch('showToast', {duration: 2000, str:"点赞成功", toastType:'icon-success-no-circle'})
        } else {
          this.$store.dispatch('showToast', {duration: 2000, str:data.msg || "点赞失败", toastType:'icon-warn'})
        }
      }
      
    },
    async fellowUserActivity(activityId) {
      if (!this.$store.state.authUser || !this.$store.state.authUser.phoneNumber || !this.$store.state.authUser.wxcode) {
        this.$router.push({
          path: '/register'
        })
        // this.$store.dispatch('showToast', {duration: 2000, str:'未注册', toastType:'icon-warn'})
        return;
      }
      if (!this.$store.state.authUser.isVip) {
        this.$router.push({
          path: '/vip'
        })
        return
      }
      if (!activityId && activityId !== 0) {
        return
      }

      var fellowFn = () => {
        if (activityId || parseInt(activityId) === 0) {
          this.$store.dispatch('applyActivity', {activityId, fellowUserId: this.zingUser.userId}).then((data)=>{
            if (data.success) {
              this.$store.dispatch('showToast', {duration: 2000, str:"报名成功", toastType:'icon-success-no-circle'})
              setTimeout(()=>this.$router.push({
                path: '/apply/success',
                query: {
                  activityId: data.data.activityApplyId,
                  activityName: this.apply.activity.activityName
                }
              }), 1600)
            } else {
              this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
            }
          })
        } else {
          this.$store.dispatch('showToast', {duration: 2000, str:'群不存在', toastType:'icon-warn'})
        }
      }

      if (this.applyState) {
        this.$store.dispatch('showDialog', {
          dialogTitle: "确定进入该用户的群聊？", 
          dialogContent: "选择确定后，将替换当前申请加入的群聊", 
          dialogDefault: "再考虑", 
          dialogPrimary: "确定", 
          // dialogDefaultFn: null, // 用默认的，关闭弹窗即可
          dialogPrimaryFn: fellowFn
        })
      } else {
        fellowFn()
      }
      

      // let data = await this.$store.dispatch('fellowUserActivity', {'userId': this.zingUser.userId})
      // if (data.success) {
        
      //   this.$store.dispatch('showToast', {duration: 2000, str:"加入成功", toastType:'icon-success-no-circle'})
      //   console.log(data)
      //   setTimeout(()=>this.$router.push({
      //     path: '/apply/success',
      //     query: {
      //       activityId: data.data.activityApplyId,
      //       activityName: data.data.activity.activityName
      //     }
      //   }), 1600)
      // } else {
      //   if (data.code === 101) {
      //     //TODO 跳转VIP页面
      //   } else {
      //     this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
      //   }
      // }
    },
  },

  components: {
  },

  async mounted() {
    let sharedId = this.$route.query.sharedId
    console.log("sharedId："+sharedId)
    // TODO 记录下来
    if (sharedId && sharedId.length > 0) {
      let data = await this.$store.dispatch('clickShared', sharedId)
    }
  },

  async beforeCreate() {
    let zingUserId = this.$route.query.zingUserId
    let data = await this.$store.dispatch('queryUserByUserId', zingUserId)

    if (data.success) {
      this.zingUser = data.data
      this.apply = data.apply
      this.loverCount = data.loverCount
      this.isLoved = data.isLoved
    } else {
      this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
    }


    let stateData = await this.$store.dispatch('queryActivityState')
    if (stateData.success) {
      this.applyState = stateData.data
    }
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/zing_detail.sass'></style>
