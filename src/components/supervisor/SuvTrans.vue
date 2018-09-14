<template>
  <div class="table">
    <el-table :data="transList" height="700">
      <el-table-column
        width="80"
        prop="supervision.suvId"
        label="督导号">
      </el-table-column>
      <el-table-column
        width="80"
        prop="supervision.suvWeek"
        label="周">
      </el-table-column>
      <el-table-column
        width="110"
        prop="supervision.scheduleWithCozDtl.course.cozId"
        label="课程序号">
      </el-table-column>
      <el-table-column
        prop="supervision.scheduleWithCozDtl.course.cozName"
        label="课程名">
      </el-table-column>
      <el-table-column
        label="任课老师">
        <template slot-scope="scope">
            <span
              v-for="user in scope.row.supervision.scheduleWithCozDtl.course.teacherList"
              :key="user.usrId"
              v-text="user.usrName">
            </span>
        </template>
      </el-table-column>
      <el-table-column
        label="上课时间">
        <template slot-scope="scope">
            <span
              v-text="`星期${dayMap.get(scope.row.supervision.scheduleWithCozDtl.schDay)} 第${scope.row.supervision.scheduleWithCozDtl.schStartTime}~${scope.row.supervision.scheduleWithCozDtl.schEndTime}节`"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="督导状态">
        <template slot-scope="scope">
          <span v-text="scope.row.supervision.record? '已记录': '待督导'"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="showDialog(scope.row, 'receive')">接受</el-button>
          <el-button type="danger" size="mini" @click="showDialog(scope.row, 'reject')">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="督导转接"
               :visible.sync="dialogVisible"
               :before-close="dialogClose">
      <p>&nbsp;<span v-text="dialogMsg"></span></p>
      <el-row style="margin-top: 3rem">
        <el-button type="primary" @click="doOperation">确定</el-button>
        <el-button @click="dialogClose">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SuvTrans',
  computed: {
    user () {
      return this.$store.state.user
    },
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']]),
      typeMsgMap: new Map([['receive', '确定接受? '], ['reject', '确定拒绝? ']]),
      transList: [],
      dialogVisible: false,
      dialogType: '',
      dialogMsg: '',
      diaLogSuvTrans: {}
    }
  },
  created () {
    this.$ajax
      .get('/supervisor/trans-supervision', this.ajaxConfig)
      .then(res => {
        if (res && res.data) {
          this.transList = res.data
          return
        }

        alert('服务器暂时出了问题, 请稍后再试')
      })
      .catch(err => {
        console.error(err)
        if (err.response.status === 401) {
          this.$message({
            showClose: true,
            message: '登录过期, 请重新登录',
            type: 'error'
          })
        } else {
          this.$message({
            showClose: true,
            message: '网络发生了一点问题',
            type: 'error'
          })
        }
      })
  },
  methods: {
    showDialog (suvTrans, typeStr) {
      this.dialogVisible = true
      this.dialogType = typeStr
      this.diaLogSuvTrans = JSON.parse(JSON.stringify(suvTrans))
      this.dialogMsg = this.typeMsgMap.get(typeStr)
    },
    closeDialog () {
      this.dialogVisible = false
      this.dialogType = ''
      this.diaLogSuvTrans = {}
      this.dialogMsg = ''
    },
    doOperation () {
      const vm = this
      switch (vm.dialogType) {
        case 'receive':
          vm.$ajax
            .post('/supervisor/trans-supervision', vm.diaLogSuvTrans, vm.ajaxConfig)
            .then(res => {
              if (res && res.data && res.data.status) {
                alert('成功!')
                vm.closeDialog()
                return
              }

              alert('服务器暂时出了问题, 请稍后再试')
            })
            .catch(err => {
              console.error(err)
              if (err.response.status === 401) {
                vm.$message({
                  showClose: true,
                  message: '登录过期, 请重新登录',
                  type: 'error'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '网络发生了一点问题',
                  type: 'error'
                })
              }
            })
          break
        case 'reject':
          vm.$ajax({
            method: 'delete',
            url: '/supervisor/trans-supervision',
            data: vm.diaLogSuvTrans,
            headers: vm.ajaxConfig.headers
          })
            .then(res => {
              if (res && res.data && res.data.status) {
                alert('成功!')
                vm.closeDialog()
                return
              }

              alert('服务器暂时出了问题, 请稍后再试')
            })
            .catch(err => {
              console.error(err)
              if (err.response.status === 401) {
                vm.$message({
                  showClose: true,
                  message: '登录过期, 请重新登录',
                  type: 'error'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '网络发生了一点问题',
                  type: 'error'
                })
              }
            })
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
  .table {
    margin: 3rem;
  }
</style>
