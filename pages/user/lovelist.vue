<template lang="pug">
.container
  .card(class="card-mini")
    .card-header
      img.card-left-circle(src='~static/img/banner_circle.png')
      .flex-1
      img.card-bgsjh(src='~static/img/banner_bgsjh.png')
      img.card-op(src='~static/img/banner_office_planning.png')
      img.card-close(src='~static/img/banner_close.png')

    .card-body(style="align-items: flex-start; justify-content: flex-start;")
      .day-user-list(v-for='groupItem in userGroups')
        .day-title-row
          .day-dd {{groupItem.dateStr.substring(0,2)}}
          .day-mm {{groupItem.dateStr.substring(2)}}
          .flex-1
          .day-all-user 全部 >
        .user-list-row
          .user-block(v-for='item in groupItem.items' v-if='item.year > 0')
            img.user-cover(:src='"http://wxzing.podoon.cn/"+item.userItem.photos[0]+"?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100"')
            .user-title {{item.userItem.nickname}}
            .user-sub-title {{displayAge(item.userItem)}}岁
            .user-sub-title {{item.userItem.career}}
            .user-sub-title {{displayIncome(item.userItem)}}
          .user-block(v-else)


      //- .day-user-list
      //-   .day-title-row
      //-     .day-dd 09
      //-     .day-mm /5月
      //-     .flex-1
      //-     .day-all-user 全部 >
      //-   .user-list-row
      //-     .user-block
      //-       img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
      //-       .user-title 用户的名称
      //-       .user-sub-title 23岁
      //-       .user-sub-title 平面设计师
      //-       .user-sub-title 10万以内
      //-     .user-block
      //-       img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
      //-       .user-title 用户的名称
      //-       .user-sub-title 23岁
      //-       .user-sub-title 平面设计师
      //-       .user-sub-title 10万以内
      //-     .user-block
      //-       img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
      //-       .user-title 用户的名称
      //-       .user-sub-title 23岁
      //-       .user-sub-title 平面设计师
      //-       .user-sub-title 10万以内
      //-     .user-block
      //-       img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
      //-       .user-title 用户的名称
      //-       .user-sub-title 23岁
      //-       .user-sub-title 平面设计师
      //-       .user-sub-title 10万以内
      //-     .user-block
      //-       img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
      //-       .user-title 用户的名称
      //-       .user-sub-title 23岁
      //-       .user-sub-title 平面设计师
      //-       .user-sub-title 10万以内

      //-     .user-block
      //- .day-user-list
      //-   .day-title-row
      //-     .day-dd 09
      //-     .day-mm /5月
      //-     .flex-1
      //-     .day-all-user 全部 >
      //-   .user-list-row
      //-     .user-block
      //-       img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
      //-       .user-title 用户的名称
      //-       .user-sub-title 23岁
      //-       .user-sub-title 平面设计师
      //-       .user-sub-title 10万以内
      //-     .user-block
      //-       img.user-cover(src='http://wxzing.podoon.cn/products/7t86ys2dkitxvsdgpztw55et6vmw5ysk?imageMogr2/auto-orient/thumbnail/x999/gravity/Center/crop/666x/blur/1x0/quality/100')
      //-       .user-title 用户的名称
      //-       .user-sub-title 23岁
      //-       .user-sub-title 平面设计师
      //-       .user-sub-title 10万以内
      //-     .user-block

      

    .card-footer
  .next(@click="lookOther")
    .title 查看其他会员资料
</template>

<script>

import { mapState } from 'vuex'

export default {
  middleware: 'wechat-info',
  data() {
    return {
      userGroups: [],
      activeGender:0,
      isSignup: true
    }
  },

  computed: {
    ...mapState([
      'authUser'
    ])
  },

  methods: {
    lookOther() {
      this.$router.push({
        path: '/zing'
      })
    },
    displayIncome(userItem) {
      return ['未知', '10w内', '10-20W', '20-50W', '50W以上'][userItem.income]
    },
    displayAge(userItem) {
      var birthday = userItem.birthday
      if (!birthday) {
        return '--'
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
  },

  components: {
  },

  async beforeCreate() {
    let isFollow = this.$route.query.isFollow
    let data
    if (isFollow) {
      data = await this.$store.dispatch('queryFollowUsers')
    } else {
      data = await this.$store.dispatch('queryZingUsers')
    }
    console.log(data)
    
    if (data.success) {
      this.userGroups = data.data
    } else {
      this.$store.dispatch('showToast', {duration: 2000, str:data.msg, toastType:'icon-warn'})
    }
  }
}
</script>

<style scoped, lang="sass" src='~/static/css/index.sass'></style>
