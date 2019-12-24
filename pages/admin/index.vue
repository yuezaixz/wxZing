<template lang="pug">
.content
  el-menu.el-menu-demo(:default-active="activeIndex" mode="horizontal" @select="handleSelect")
    el-menu-item(index="1") 用户中心
    el-menu-item(index="2") 活动中心

  div.line
  div(style="height:25px;")
  el-row
    el-col(:span="3")
      el-input(placeholder="微信号" v-model="wxcodeInput" clearable)
    el-col(:span="1")
      div(style="height:1px;")
    el-col(:span="3")
      el-input(placeholder="姓名" v-model="nicknameInput" clearable)
    el-col(:span="1")
      div(style="height:1px;")
    el-col(:span="2")
      el-button(@click="queryWxcode" type="primary" round style="width:100%;") 搜索

  div(style="height:25px;")
  el-table(:data="tableData" stripe border :default-sort = "{prop: 'userId', order: 'descending'}" style="width:100%;" )
    el-table-column(prop="userId" label="id" sortable width="60")
    el-table-column(fixed="right" label="操作" width="150")
      template(slot-scope="scope")
        el-button(@click.native.prevent="starRow(scope.row)" type="text" size="small") 评分
        el-button(@click.native.prevent="queryFellow(scope.row)" type="text" size="small") 查看
        el-button(@click.native.prevent="pwdClick(scope.row)" type="text" size="small") 密码
    el-table-column(prop="nickname" label="姓名" sortable width="200")
    el-table-column(prop="wxcode" label="微信号" sortable width="150")
    el-table-column(prop="gender" label="性别" :formatter="formatSex" sortable width="80")
    el-table-column(prop="degree" label="学历" :formatter="formatdegree" sortable width="80")
    el-table-column(prop="height" label="身高" sortable width="80")
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

  el-dialog(title="跟随进群列表" :visible.sync="dialogTableVisible")
    el-table(:data="gridData" stripe)
      el-table-column(prop="userId" label="id" width="60")
      el-table-column(prop="nickname" label="姓名")
      el-table-column(prop="wxcode" label="微信号" width="100")
      el-table-column(prop="gender" label="性别" :formatter="formatSex" sortable width="80")
      el-table-column(prop="isVip" label="VIP" :formatter="formatisVip" sortable width="180")
    el-pagination(
      @size-change="handleGridSizeChange"
      @current-change="handleGridCurrentChange"
      @prev-click="handleGridPrev"
      @next-click="handleGridNext"
      :current-page.sync="gridPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="gridLimit"
      layout="sizes, prev, pager, next"
      background :total="gridCount"
    )
    div.dialog-footer(slot="footer")
      el-button(type="primary" @click="dialogTableVisible = false") 关 闭

  el-dialog(title="评分" :visible.sync="dialogFormVisible")
    el-form(:model="form")
      el-form-item(label="评分" :label-width="formLabelWidth")
        el-select(v-model="form.star" placeholder="请选择星级")
          el-option(label="一星" value="1")
          el-option(label="二星" value="2")
          el-option(label="三星" value="3")
          el-option(label="四星" value="4")
          el-option(label="五星" value="5")
    div.dialog-footer(slot="footer")
      el-button(@click="dialogFormVisible = false") 取 消
      el-button(type="primary" @click="starAction") 确 定

  el-dialog(v-if="pwdForm.row && pwdForm.row.wxcode && pwdForm.row.nickname" :title="'修改'+pwdForm.row.nickname+'密码'" :visible.sync="dialogpwdFormVisible")
    el-form(:model="pwdForm")
      el-form-item(label="新密码" :label-width="formLabelWidth")
        el-input(v-model="pwdForm.newPassword" autocomplete="off" show-password)
      el-form-item(label="再新密码" :label-width="formLabelWidth")
        el-input(v-model="pwdForm.replyPassword" autocomplete="off" show-password)
    div.dialog-footer(slot="footer")
      el-button(@click="dialogpwdFormVisible = false") 取 消
      el-button(type="primary" @click="changePwd") 确 定
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
      gridUserId: null,
      gridData: [],
      gridPage: 0,
      gridLimit: 10,
      gridCount: 0,
      activeIndex: "1",
      form: {
        row: null,
        star: ''
      },
      pwdForm: {
        row: null,
        newPassword: null,
        replyPassword: null,
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogTableVisible: false,
      dialogpwdFormVisible: false,
      wxcodeInput: '',
      wxcode: '',
      ageInput: '',
      age: '',
      nicknameInput: '',
      nickname: '',
    }
  },
  head () {
    return {
      title: '后台管理首页'
    }
  },

  computed: {
    ...mapState([
      'user'
    ])
  },

  methods: {
    starRow(row) {
      // TODO 评分功能未实现，先关闭
      // if (row) {
      //   this.form.row = row
      //   this.dialogFormVisible = true
      // }
    },
    starAction() {
      this.dialogFormVisible = false
      console.log(this.form)
    },
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
      let {data} = await axios.get('/api/users?page='+ this.page + '&limit=' + this.limit + '&wxcode=' + (this.wxcode||'') + ('&age=' + this.age||'') + ('&nickname=' + this.nickname||''))
      if (data && data.success) {
        this.tableData = data.data
        this.count = data.count
        this.users = this.tableData
      }
    },
    handleGridSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.reloadGridData()
    },
    handleGridCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val
      this.reloadGridData()
    },
    handleGridPrev() {
      this.page -= 1
      console.log(`当前页: ${this.page}`);
      this.reloadGridData()
    },
    handleGridNext() {
      this.page += 1
      console.log(`当前页: ${this.page}`);
      this.reloadGridData()
    },
    async reloadGridData() {
      if (this.gridUserId) {
        let {data} = await axios.get('/api/user_fellows_by_user_id?user_id=' + this.gridUserId + '&page='+ this.gridPage + '&limit=' + this.gridLimit)
        if (data && data.success) {
          this.gridData = data.data
          this.gridCount = data.count
        }
      }
    },
    async queryFellow(row) {
      this.gridUserId = row.userId
      await this.reloadGridData()
      this.dialogTableVisible = true
    },
    async queryWxcode() {
      this.wxcode = this.wxcodeInput
      this.age = this.ageInput
      this.nickname = this.nicknameInput
      await this.reloadData()
    }, 
    async pwdClick (row) {
      if (row.userId && row.wxcode) {
        this.dialogpwdFormVisible = true
        this.pwdForm.row = row
        this.pwdForm.newPassword = null
        this.pwdForm.replyPassword = null
      } else {
        this.$message.error('微信号不存在');
      }
    },
    async changePwd () {
      let wxcode = this.pwdForm.row.wxcode
      let { newPassword, replyPassword } = this.pwdForm

      if (!wxcode || !newPassword || !replyPassword || newPassword !== replyPassword) {
        this.$message.error('输入错误')
      }

      let res = await this.$store.dispatch('changePwd', {wxcode, newpassword: newPassword})


      this.dialogpwdFormVisible = false
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