<template>
  <el-container>
    <el-header>
      <el-form inline size="mini" class="header">
        <el-form-item label="选择课程">
          <el-select v-model="selectedCozId" value="" @change="changeSelectedScheduleList">
            <el-option
              v-for="val in courseList"
            :key="val.cozId"
            :label="`${val.cozName} (${val.cozId})`"
            :value="val.cozId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课时间">
          <el-select v-model="selectedSchId" value="">
            <el-option
              v-for="val in selectedScheduleList"
              :key="val.schId"
              :label="`星期${dayMap.get(val.schDay)} 第${val.schStartTime}~${val.schEndTime}节`"
              :value="val.schId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="filter">选择</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="signInList">
        <el-table-column prop="siWeek" label="周"></el-table-column>
        <el-table-column label="默认签到时间"
                         prop="siAuto">
          <template slot-scope="scope">
            <span v-text="scope.row.siAuto ? '开启' : '关闭'">
            </span>
          </template>
        </el-table-column>
        <el-table-column label="设置签到时间"
                         prop="siTime">
          <template slot-scope="scope">
            <span v-text="scope.row.siTime === '1970-01-01T00:00' ? '未设置': new Date(scope.row.siTime).toLocaleString()">
            </span>
          </template>
        </el-table-column>
        <el-table-column label="缺勤人数">
          <template slot-scope="scope">
            <span v-text="getAbsent(scope.row.signInRecList)"></span>
          </template>
        </el-table-column>
        <el-table-column label="详细信息">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showDetail(scope.row.signInRecList)">详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog title="签到情况"
               :visible.sync="signInDialogVisible"
               :before-close="signInDialogClose">
      <el-table :data="signInRecList">
        <el-table-column label="学号" prop="user.usrId">
        </el-table-column>
        <el-table-column label="姓名" prop="user.usrName">
        </el-table-column>
        <el-table-column label="签到时间">
          <template slot-scope="scope">
            <span v-text="scope.row.siTime == null ? '' : new Date(scope.row.siTime).toLocaleString()"></span>
          </template>
        </el-table-column>
        <el-table-column label="到勤状态">
          <template slot-scope="scope">
            <span v-text="codeMap.get(scope.row.signInStatusCode)"></span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'HistorySignIn',
  props: ['courseList'],
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']]),
      codeMap: new Map([[0, '到勤'], [1, '缺勤'], [2, '签到未开始'], [3, '请假未审批'], [4, '请假通过']]),
      selectedCozId: '',
      selectedScheduleList: [],
      selectedSchId: [],
      schSignInList: [],
      signInList: [],
      signInRecList: [],
      signInDialogVisible: false
    }
  },
  methods: {
    onSearch () {
      this.$ajax
        .get('/teacher/history', Object.assign({
          params: {
            cozId: this.selectedCozId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            this.schSignInList = res.data
            return
          }
          this.$message({
            showClose: true,
            message: '服务器暂时出了问题, 请稍后再试',
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
    changeSelectedScheduleList (cozId) {
      this.onSearch()
      for (let i = 0; i < this.courseList.length; i++) {
        if (this.courseList[i].cozId === cozId) {
          this.selectedScheduleList = this.courseList[i].scheduleList
          return
        }
      }
    },
    getAbsent (signInRecList) {
      if (signInRecList.length <= 0) {
        return
      }
      let count = 0
      signInRecList.forEach(signInRec => {
        if (signInRec.signInStatusCode === 1) {
          count++
        }
      })
      return count
    },
    filter () {
      for (let i = 0; i < this.schSignInList.length; i++) {
        if (this.schSignInList[i].schId === this.selectedSchId) {
          this.signInList = this.schSignInList[i].signInList
          return
        }
      }
    },
    showDetail (signInRecList) {
      this.signInDialogVisible = true
      this.signInRecList = signInRecList
    },
    signInDialogClose () {
      this.signInDialogVisible = false
      this.signInRecList = []
    }
  }
}
</script>

<style scoped>
  .header {
    border-bottom: #c3d5e2 1px solid;
  }
</style>
