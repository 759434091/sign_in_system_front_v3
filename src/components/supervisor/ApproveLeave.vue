<template>
  <div class="table">
    <el-table :data="stuLeaves" height="700">
      <el-table-column
        width="80"
        prop="sirId"
        label="请假号">
      </el-table-column>
      <el-table-column
        label="请假时间">
        <template slot-scope="scope">
          <span v-text="new Date(scope.row.sirTime).toLocaleString()"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="signInWithCozDtl.scheduleWithCozDtl.course.cozId"
        label="课程序号">
      </el-table-column>
      <el-table-column
        prop="signInWithCozDtl.scheduleWithCozDtl.course.cozName"
        label="课程名">
      </el-table-column>
      <el-table-column
        label="任课老师">
        <template slot-scope="scope">
            <span
              v-for="user in scope.row.signInWithCozDtl.scheduleWithCozDtl.course.teacherList"
              :key="user.usrId"
              v-text="user.usrName">
            </span>
        </template>
      </el-table-column>
      <el-table-column
        label="上课时间">
        <template slot-scope="scope">
            <span
              v-text="`星期${dayMap.get(scope.row.signInWithCozDtl.scheduleWithCozDtl.schDay)} 第${scope.row.signInWithCozDtl.scheduleWithCozDtl.schStartTime}~${scope.row.signInWithCozDtl.scheduleWithCozDtl.schEndTime}节`"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.sirApprove === 0">
            <el-button type="success" size="mini" @click="showDialog(scope.row, 'approve')">通过</el-button>
            <el-button type="danger" size="mini" @click="showDialog(scope.row, 'reject')">驳回</el-button>
          </div>
          <div v-else>
            <el-button type="info" size="mini" disabled>已通过</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="审批请假"
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
  name: 'ApproveLeave',
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
      typeMsgMap: new Map([['approve', '确定通过? '], ['reject', '确定驳回? ']]),
      typeCodeMap: new Map([['approve', 1], ['reject', 2]]),
      stuLeaves: [],
      dialogVisible: false,
      dialogMsg: '',
      diaLogSignInRec: {}
    }
  },
  created () {
    this.getLeaves()
  },
  methods: {
    getLeaves () {
      this.$ajax
        .get('/supervisor/stu-leaves', this.ajaxConfig)
        .then(res => {
          if (res && res.data) {
            this.stuLeaves = res.data
            return
          }

          this.$message({
            showClose: true,
            message: '服务器出了一点问题, 请稍后再试',
            type: 'error'
          })
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
    showDialog (signInRec, typeStr) {
      this.dialogVisible = true
      this.diaLogSignInRec = JSON.parse(JSON.stringify(signInRec))
      this.diaLogSignInRec.sirApprove = this.typeCodeMap.get(typeStr)
      this.dialogMsg = this.typeMsgMap.get(typeStr)
    },
    closeDialog () {
      this.dialogVisible = false
      this.diaLogSignInRec = {}
    },
    doOperation () {
      this.$ajax
        .post('/supervisor/stu-leaves', this.diaLogSignInRec, this.ajaxConfig)
        .then(res => {
          if (res && res.data && res.data.status) {
            this.$message({
              showClose: true,
              message: '审批成功',
              type: 'success'
            })
            this.getLeaves()
            this.closeDialog()
            return
          }

          this.closeDialog()
          this.$message({
            showClose: true,
            message: '服务器出了一点问题, 请稍后再试',
            type: 'error'
          })
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
    }
  }
}
</script>

<style scoped>
  .table {
    margin: 3rem;
  }
</style>
