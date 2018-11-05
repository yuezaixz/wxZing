<template>
  <section class="container">
    <img src="../static/images/event/freeuse/900*500.png" alt="Deeper护颈枕" class="logo" />
    <h1 class="title">
      『试睡师征集』活动说明
    </h1>
    <p class="content">
      1、填写<a class="wenjuanlink" href='https://wj.qq.com/s/2565575/eea4' >问卷</a>时留下号码即参加活动<br/>
      2、活动将从抽取10位试睡师<br/>
      3、试睡期为30天，试睡结束后试睡师需要提交一份测评<br/>
      4、本次活动为试睡师一期，之后还很多哦
    </p>
    <p class="footer">
      征集结果将在8月30日公布
    </p>
    <!-- <p class="copyright">
      © 2018 Podoon
    </p> -->
  </section>
</template>

<script>

export default {
  head () {
    return {
      title: '试睡师征集'
    }
  }
}

</script>

<style scoped>
.container
{
  background-color: black;
}
.title
{
  margin: 50px 0 25px 0;
  text-align: center;
  font-size: 25px;
  color: white;
}
.content
{
  text-align: center;
  font-size: 18px;
  color: white;
  line-height: 30px;
  margin: 25px 0 50px 0;
}
.wenjuanlink
{
  color:orange;
  font-size: 24px;
  cursor: pointer;
  text-decoration: underline;
}
.footer
{
  text-align: center;
  font-size: 18px;
  color: white;
  line-height: 30px;
  margin: 25px 0 20px 0;
}
.copyright
{
  position: relative;
  text-align: center;
  font-size: 18px;
  color: white;
  bottom: 10px;
}
</style>