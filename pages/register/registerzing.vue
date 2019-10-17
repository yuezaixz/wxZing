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
      .card-column(style='height:15px;')
      .card-column
        .card-row(style='justify-content:flex-start;')
          .card-title 为你推荐
        .card-column(style='height:5px;')
        .card-inner 推荐给你一些优质用户，他们好看又活泼
      .card-select-row(style='flex-wrap: wrap; margin-right: 20px;')
        .zing-flex1(v-for='(item, index) in rUsers' :key='index' @click='love(item)')
          .zing-photo-container
            img.zing-photo(:src='"http://wxzing.podoon.cn/"+item.photos[0]+"?imageView2/3/w/90/h/90/q/75|imageslim"')
            img.zing-check( v-if="isCheck(item.userId)" src="~static/img/register_zing_check.png")
            img.zing-check( v-else src="~static/img/register_zing_uncheck.png")
          .zing-title {{item.nickname}}
          .zing-content {{displayAge(item)}}，{{item.career}}
          .zing-content {{item.income?['未知', '10w内', '10-20W', '20-50W', '50W以上'][item.income]:"--"}}


      
    .card-footer
  .next
    nuxt-link(to='/zing')
      .title 查看资料库

</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  data() {
    return {
      user: {},
      activeGender:0,
      rUsers: [],
      loverList: []
    }
  },

  computed: {
    displayUserId() {
      return (Array(6).join(0) + this.$store.state.authUser.userId).slice(-6)
    },
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    displayAge(userItem) {
      var birthday = userItem.birthday
      if (birthday == null) {
        return "--"
      }
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
    async love(user) {
      let data = await this.$store.dispatch('zingUserAction', {'zingUserId': user.userId})
      if (data.success) {
        this.loverList.push(user.userId)
        this.$store.dispatch('showToast', {duration: 2000, str:"点赞成功", toastType:'icon-success-no-circle'})
      } else {
        this.$store.dispatch('showToast', {duration: 2000, str:data.msg || "点赞失败", toastType:'icon-warn'})
      }
    },
    isCheck(userId) {
      return ~this.loverList.indexOf(userId);
    }
  },

  components: {
  },
  async mounted() {
    var responseData = await this.$store.dispatch('queryLast9Users')
    if (responseData.success) {
      this.rUsers = responseData.data
    } else {
      this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
    }
  },
}
</script>

<style scoped, lang="sass" src='~/static/css/register.sass'></style>
