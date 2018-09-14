<template>
  <div class="table">
    <el-table :data="suvScheduleList" height="700">
      <el-table-column
        width="130"
        prop="scheduleWithCozDtl.courseCozId"
        label="课程序号">
      </el-table-column>
      <el-table-column
        width="130"
        prop="scheduleWithCozDtl.course.cozName"
        label="课程名">
      </el-table-column>
      <el-table-column
        label="任课老师">
        <template slot-scope="scope">
            <span
              v-for="user in scope.row.scheduleWithCozDtl.course.teacherList"
              :key="user.usrId"
              v-text="user.usrName">
            </span>
        </template>
      </el-table-column>
      <el-table-column
        label="上课时间">
        <template slot-scope="scope">
            <span
              v-text="`星期${dayMap.get(scope.row.scheduleWithCozDtl.schDay)} 第${scope.row.scheduleWithCozDtl.schStartTime}~${scope.row.scheduleWithCozDtl.schEndTime}节`"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="督导周">
        <template slot-scope="scope">
          <span v-text="getSuvWeeks(scope.row.suvWeeks)"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showReceiveSuvDialog(scope.row)">领取</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="领取督导?"
               :visible.sync="receiveSuvDialogVisible"
               :before-close="receiveSuvDialogClose">
      <p>&nbsp;请思考再三</p>
      <el-row style="margin-top: 3rem">
        <el-button type="danger" @click="receiveSuv">确定</el-button>
        <el-button type="primary" @click="receiveSuvDialogClose">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'suvPool',
  data () {
    return {
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']]),
      suvScheduleList: [],
      receiveSuvDialogVisible: false,
      paramList: {}
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    curWeek () {
      return this.$store.state.week
    },
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  created () {
    this.getPool()
  },
  methods: {
    getPool () {
      this.$ajax
        .get('/supervisor/supervision-pool', Object.assign({
          params: {
            curWeek: this.curWeek
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.data) {
            this.suvScheduleList = res.data
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
    showReceiveSuvDialog (suvSchedule) {
      const regexp = /\d+/
      this.receiveSuvDialogVisible = true
      this.paramList = JSON.parse(JSON.stringify(suvSchedule))
      this.paramList.suvWeeks = this.paramList.suvWeeks.split(/\s*,\s*/).filter(str => regexp.test(str)).map(str => parseInt(str))
    },
    receiveSuvDialogClose () {
      this.receiveSuvDialogVisible = false
      this.paramList = {}
    },
    receiveSuv () {
      this.$ajax
        .patch('/supervisor/supervisions', this.paramList, this.ajaxConfig)
        .then(res => {
          if (res && res.data && res.data.status) {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success'
            })
            this.getPool()
            this.receiveSuvDialogClose()
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
    getSuvWeeks (suvWeeks) {
      const regexp = /\d+/
      const suvWeekList = suvWeeks.split(/\s*,\s*/).filter(str => regexp.test(str)).map(str => parseInt(str))
      if (suvWeekList.length <= 0) {
        return ''
      } else if (suvWeekList.length === 1) {
        return `${suvWeekList[0]}`
      }

      let weekPartList = []
      let weekPart = []
      for (let i = 0; i < suvWeekList.length; i++) {
        if (weekPart.length === 0) {
          weekPartList.push(weekPart)
          weekPart.push(suvWeekList[i])
          continue
        }
        if (weekPart[weekPart.length - 1] + 1 === suvWeekList[i]) {
          weekPart.push(suvWeekList[i])
          continue
        }
        weekPartList.push(weekPart)
        weekPart = []
        weekPart.push(suvWeekList[i])
      }
      return weekPartList.map(weekPart => `${weekPart[0]}~${weekPart[weekPart.length - 1]}`).join(', ')
    }
  }
}
</script>

<style scoped>
  .table {
    margin: 3rem;
  }
</style>
