<template lang="pug">
.content#app
  el-menu.el-menu-demo(:default-active="activeIndex" mode="horizontal" @select="handleSelect")
    el-menu-item(index="1") 用户中心
    el-menu-item(index="2") 活动中心

  div.line
  div(style="height:25px;")
  el-button(@click="newActivity" round) 新增
  div(style="height:25px;")
  el-table(:data="tableData" stripe border :default-sort = "{prop: 'userId', order: 'descending'}" style="width:100%;" )
    el-table-column(prop="activityId" label="id" sortable width="100")
    el-table-column(prop="activityName" label="名称" sortable width="200")
    el-table-column(prop="memo" label="备注" width="300")
    el-table-column(prop="isOver" label="是否结束" :formatter="formatBoolean" sortable width="120")
    el-table-column(prop="meta.createAt" label="开始时间" :formatter="formatDate" sortable width="180")
    el-table-column(label="操作" width="200")
      template(slot-scope="scope")
        el-button(@click.native.prevent="overRow(scope.row)" type="text" size="small") 结束
        el-button(@click.native.prevent="detailRow(scope.row)" type="text" size="small") 详细
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

  el-dialog(title="新建活动" :visible.sync="dialogFormVisible")
    el-form(:model="form")
      el-form-item(label="活动名" :label-width="formLabelWidth")
        el-input(v-model="form.name" autocomplete="off")
      el-form-item(label="备注" :label-width="formLabelWidth")
        el-input(v-model="form.memo" autocomplete="off")
    div.dialog-footer(slot="footer")
      el-button(@click="dialogFormVisible = false") 取 消
      el-button(type="primary" @click="newAction") 确 定
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
      activitys: [],
      page: 0,
      limit: 10,
      count: 0,
      activeIndex: "2",
      form: {
        name: "",
        memo: "",
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
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
    newActivity: function() {
      this.dialogFormVisible = true
    },
    async newAction() {
      this.dialogFormVisible = false
      console.log(this.form)
      if (!this.form.name) {
        return
      }
      let { data } = await axios.post('/api/activity', {
        activityName: this.form.name,
        memo: this.form.memo || "",
        interestId: 0
      })
      if (data.success) {
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 1
        });
        this.reloadData()
      } else {
        this.$message.error(data.msg || "操作失败");
      }
    },
    formatBoolean: function (row, column) {
      return row.isOver?'是':'否'
    },
    formatDate: function (row, column) {
      return row.meta.createAt.substring(0,10)
    },
    handleSelect(key, keyPath) {
      const visit = ['/admin/login', '/admin', '/admin/activity'][key]
      this.$router.replace(visit)
    },
    overRow(row) {
      if (row) {
        console.log(`结束：${row.activityName}`)
      }
    },
    detailRow(row) {
      if (row) {
        console.log(`查看详细：${row.activityName}`)
      }
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
      let {data} = await axios.get('/api/activitys?page='+ this.page + '&limit=' + this.limit)
      if (data && data.success) {
        this.tableData = data.data
        this.count = data.count
        this.users = this.tableData
      }
    }
  },

  async beforeCreate() {
    let {data} = await axios.get('/api/activitys?page=1&limit=10')
    if (data && data.success) {
      this.tableData = data.data
      this.count = data.count
      this.users = this.tableData
    }
  }
}

</script>

<style lang='sass' src='~/static/sass/admin.sass'></style>