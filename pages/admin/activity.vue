<template lang="pug">
.content
  el-menu.el-menu-demo(:default-active="activeIndex" mode="horizontal" @select="handleSelect")
    el-menu-item(index="1") 用户中心
    el-menu-item(index="2") 活动中心

  div.line
  div(style="height:50px;")
  el-table(:data="tableData" stripe border :default-sort = "{prop: 'userId', order: 'descending'}" style="width:100%;" )
    el-table-column(prop="userId" label="id" sortable width="60")
    el-table-column(prop="nickname" label="姓名" sortable width="200")
    el-table-column(prop="wxcode" label="微信号" sortable width="150")
    el-table-column(prop="gender" label="性别" :formatter="formatSex" sortable width="60")
    el-table-column(prop="degree" label="学历" :formatter="formatdegree" sortable width="80")
    el-table-column(prop="height" label="身高" sortable width="60")
    el-table-column(prop="birthday" label="生日" sortable width="150")
    el-table-column(prop="city" label="城市" :formatter="formatCity" sortable width="180")
    el-table-column(prop="hometown" label="家乡" :formatter="formatHometown" sortable width="180")
    el-table-column(prop="career" label="职业" sortable width="180")
    el-table-column(prop="income" label="收入" :formatter="formatincome" sortable width="180")
    el-table-column(prop="jobType" label="工作" :formatter="formatjobType" sortable width="180")
    el-table-column(prop="houseType" label="房产" sortable width="180")
    el-table-column(prop="aboutMe" label="关于我" sortable width="180")
    el-table-column(prop="aboutOther" label="关于他" sortable width="180")
    el-table-column(prop="isVip" label="VIP" :formatter="formatisVip" sortable width="180")
  el-pagination(
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @prev-click="handlePrev"
    @next-click="handleNext"
    :current-page.sync="page"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="limit"
    layout="sizes, prev, pager, next"
    background :total="count"
  )
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { provsData, citysData } from '~/components/areaData.js'

export default {
  middleware: 'auth',
  layout: 'admin',
  data() {
    return {
      tableData: [],
      users: null,
      page: 0,
      limit: 10,
      count: 0,
      activeIndex: "2"
    }
  },
  head () {
    return {
      title: '活动管理页面'
    }
  },

  computed: {
    ...mapState([
      'user'
    ])
  },

  methods: {
    formatSex: function (row, column) {
      return row.gender === 1 ? '男' : row.gender === 2 ? '女' : '未知'
    },
    formatdegree: function (row, column) {
      return (row.degree || row.degree === 0)?['保密', '博士及以上', '研究生', '本科', '专科', '其他'][row.jobType]:"未知"
    },
    formatincome: function (row, column) {
      return (row.income || row.income === 0)?['未知', '10w内', '10-20W', '20-50W', '50W以上'][row.jobType]:"未知"
    },
    formatjobType: function (row, column) {
      return (row.jobType || row.jobType === 0)?['其他', '国企', '外企', '私企', '事业单位', '自由职业', '创业'][row.jobType]:"未知"
    },
    formatisVip: function (row, column) {
      return row.isVip?(row.vipUntilStr || '是'):"否"
    },
    formatCity: function (row, column) {
      return this.formatCityName(row.city)
    },
    formatHometown: function (row, column) {
      return this.formatCityName(row.hometown)
    },
    formatCityName(code) {
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
      provName = provName.replace('省', ' ')
      cityName = cityName.replace('市', ' ')
      return cityName && provName ? (provName + cityName) : cityName;
    },
    handleSelect(key, keyPath) {
      const visit = ['/admin/login', '/admin', '/admin/activity'][key]
      this.$router.replace(visit)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.reloadData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val
      this.reloadData()
    },
    handlePrev() {
      this.page -= 1
      console.log(`当前页: ${this.page}`);
      this.reloadData()
    },
    handleNext() {
      this.page += 1
      console.log(`当前页: ${this.page}`);
      this.reloadData()
    },
    async reloadData() {
      let {data} = await axios.get('/api/users?page='+ this.page + '&limit=' + this.limit)
      if (data && data.success) {
        this.tableData = data.data
        this.count = data.count
        this.users = this.tableData
      }
    }
  },

  async beforeCreate() {
    let {data} = await axios.get('/api/users?page=1&limit=10')
    if (data && data.success) {
      this.tableData = data.data
      this.count = data.count
      this.users = this.tableData
    }
  }
}

</script>

<style lang='sass' src='~/static/sass/admin.sass'></style>