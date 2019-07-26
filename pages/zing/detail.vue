<template lang="pug">
.container
  .card
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      img.card-close(src='~static/img/banner_close.png')

    .card-body(v-if="zingUser")
      .whole-card-photo-container
        img.whole-card-photo(:src='"http://wxzing.podoon.cn/"+zingUser.photos[0]+"?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100"')
      .index-info-block
        .index-info-title {{authUser.nickname}}
        .index-info-sub-title(style="margin:10px 0 14px 0;") {{['未知','男','女'][authUser.gender]}} / {{displayAge}} / {{displayXingzuo }} / {{authUser.career}}
        .card-row(style="justify-content: flex-start; align-items: flex-start;margin:0 0;width:100%;display: flex;")
          .info-info-item-career
            .info-info-item-title {{['其他', '国企', '外企', '私企', '事业单位', '自由职业', '创业'][authUser.jobType]}}
          div(style="width:10px;")
          .info-info-item-income
            .info-info-item-title {{['未知', '10w内', '10-20W', '20-50W', '50W以上'][authUser.income]}}

      .index-oper-block
        img.index-oper-avator(:src='"http://wxzing.podoon.cn/"+zingUser.photos[0]+"?imageView2/3/w/90/h/90/q/75|imageslim"')
        img.index-oper-item(src='~static/img/good.png')
        img.index-oper-item(src='~static/img/cancel.png')


    .card-body(v-else)
      

    .card-footer
</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      zingUser: null
    }
  },

  computed: {
    displayXingzuo() {
      var returnXingzuoIndex;

      var birthday = this.$store.state.authUser.birthday
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
      var birthday = this.$store.state.authUser.birthday
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
    ])
  },

  methods: {
    displayUserId(userId) {
      return (Array(6).join(0) + userId).slice(-6)
    },
    async zingUserAction() {
      let data = await this.$store.dispatch('zingUserAction', {'zingUserId': this.zingUser.userId})
      if (data.success) {
        this.zingUser.zing = data.data
        this.$store.dispatch('showToast', {duration: 2000, str:"点赞成功", toastType:'icon-success-no-circle'})
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg || "点赞失败", toastType:'icon-warn'})
      }
    },
    async fellowUserActivity() {
      let data = await this.$store.dispatch('fellowUserActivity', {'userId': zingUser.userId})
      if (data.success) {
        
        this.$store.dispatch('showToast', {duration: 2000, str:"加入成功", toastType:'icon-success-no-circle'})

        setTimeout(()=>this.$router.push({
          path: '/apply/success',
          query: {
            activityId: data.activityApplyId,
            activityName: data.activityName
          }
        }), 1600)
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
      }
    },
  },

  components: {
  },

  async beforeCreate() {
    let zingUserId = this.$route.query.zingUserId
    let data = await this.$store.dispatch('queryUserByUserId', zingUserId)
    if (data.success) {
      this.zingUser = data.data
    } else {
      this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
    }
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/zing.sass'></style>
