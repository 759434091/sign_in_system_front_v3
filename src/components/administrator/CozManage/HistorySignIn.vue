<template>
  <el-dialog title="历史签到"
             :visible.sync="dialogVisible"
             :before-close="closeDialog">
    <el-container>
      <el-header>
        <el-form inline size="mini" :model="hisSignInForm">
          <el-form-item>
            <el-select value="" v-model="hisSignInForm.week">
              <el-option v-for="val in parseInt(curWeek.toString())" :key="val"
                         :label="val === parseInt(curWeek.toString()) ? val + '(当前周)' : val" :value="val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select value="" v-model="hisSignInForm.schId">
              <el-option v-for="val in hisSignInList"
                         :key="val.schId"
                         :value="val.schId"
                         :label="`星期${dayMap.get(val.schDay)} 第${val.schStartTime}~${val.schEndTime}节`"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSelectHisSignIn">确定</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table :data="hisSignInData">
          <el-table-column label="学号" prop="user.usrId"></el-table-column>
          <el-table-column label="姓名" prop="user.usrName"></el-table-column>
          <el-table-column label="情况" prop="signInStatusCode">
            <template slot-scope="scope">
              <span v-text="scope.row.signInStatusCode === 1 ? '缺勤' : '到勤'"></span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script>
export default {
  name: 'HistorySignIn',
  props: ['dialogVisible', 'course'],
  computed: {
    curWeek () {
      return this.$store.state.week
    },
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']]),
      hisSignInList: [],
      hisSignInForm: {
        week: '',
        schId: ''
      },
      hisSignInData: []
    }
  },
  watch: {
    course (newVal) {
      if (JSON.stringify(newVal) === '{}') {
        return
      }
      this.hisSignInForm.week = parseInt(this.curWeek)
      this.$ajax
        .get('/administrator/course/sign-in-history', Object.assign({
          params: {
            cozId: newVal.cozId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            this.hisSignInList = res.data
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
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    doSelectHisSignIn () {
      const signInList = this.hisSignInList
        .filter(schedule => schedule.schId === this.hisSignInForm.schId)[0].signInList
      if (signInList == null) {
        this.hisSignInData = []
        return
      }
      const signIn = signInList.filter(signIn => signIn.siWeek === this.hisSignInForm.week)[0]
      if (signIn == null || signIn.length <= 0) {
        this.hisSignInData = []
        return
      }
      const signInRecList = signIn.signInRecList
      if (signInRecList == null || signInRecList.length <= 0) {
        this.hisSignInData = []
        return
      }

      this.hisSignInData = signInRecList.filter(signInRec => signInRec.signInStatusCode === 1)
    }
  }
}
</script>

<style scoped>

</style>
