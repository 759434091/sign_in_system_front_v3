<template>
  <el-container>
    <el-header class="header">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="选择周">
          <el-select v-model="week" placeholder="周" value="">
            <el-option label="无" value=""></el-option>
            <el-option
              v-for="val in parseInt('20')"
              :key="val"
              :label="parseInt(val) === parseInt(curWeek.toString()) ? (val + ' (当前周)') : val"
              :value="val"></el-option>
          </el-select>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="supervisions"
        height="700">
        <el-table-column
          width="80"
          prop="suvId"
          label="督导号">
        </el-table-column>
        <el-table-column
          width="80"
          prop="suvWeek"
          label="周">
        </el-table-column>
        <el-table-column
          width="110"
          prop="scheduleWithCozDtl.course.cozId"
          label="课程序号">
        </el-table-column>
        <el-table-column
          prop="scheduleWithCozDtl.course.cozName"
          label="课程名"
          :filters="cozNameFilters"
          :filter-method="cozNameFilterHandler">
        </el-table-column>
        <el-table-column
          prop="scheduleWithCozDtl.course.teacherList"
          label="任课老师"
          :filters="cozTeacherFilters"
          :filter-method="cozTeacherFilterHandler">
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
          prop="student"
          width="140"
          label="督导员">
          <template slot-scope="scope">
            <span v-if="scope.row.student" v-text="scope.row.student.usrName"></span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="督导员情况">
          <template slot-scope="scope">
            <span v-text="scope.row.suvLeave? '请假': '正常'"></span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="督导状态">
          <template slot-scope="scope">
            <span v-text="scope.row.record? '已记录': '待督导'"></span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.record" type="info" size="mini" @click="showHistory(scope.row)">查看历史</el-button>
            <el-dropdown v-else>
              <el-button type="primary" size="mini">
                督导管理<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="showSignInSetting(scope.row)">签到设置</el-dropdown-item>
                <el-dropdown-item @click.native="showDeleteDialog(scope.row)">取消督导</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog title="督导历史"
               class="history-dialog"
               :visible.sync="historyDialogVisible"
               :before-close="historyDialogClose">
      <el-row><p>督导号: <span v-text="suvRec.supervisionSuvId"></span></p></el-row>
      <el-row><p>实到人数: <span v-text="suvRec.suvRecNum"></span></p></el-row>
      <el-row><p>情况人数: <span v-text="suvRec.suvRecBadNum"></span></p></el-row>
      <el-row><p>督导人: <span v-text="suvRec.suvRecName"></span></p></el-row>
      <el-row><p>督导备注: <span v-text="suvRec.suvRecInfo"></span></p></el-row>
    </el-dialog>
    <el-dialog title="签到设置"
               class="sign-in-dialog"
               :visible.sync="signInDialogVisible"
               :before-close="signInDialogClose">
      <el-form
        ref="signInSettingForm"
        :model="signInSetting"
        :rules="rules">
        <el-form-item label="默认签到时间开启">
          <el-switch
            v-model="signInSetting.siAuto">
          </el-switch>
        </el-form-item>
        <el-form-item label="设置人工签到时间" prop="siTime">
          <el-col :span="7">
            <el-date-picker
              v-model="signInSetting.siTime"
              type="datetime"
              placeholder="人工签到时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>
          <el-col :span="9">
            <span>1970/01/01 00:00:00为不设置人工签到</span>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click="changeSignIn">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="取消督导"
               :visible.sync="deleteDialogVisible"
               :before-close="deleteDialogClose">
      <p>&nbsp;请思考再三</p>
      <el-row style="margin-top: 3rem">
        <el-button type="danger" @click="doDeleteSupervision">确定</el-button>
        <el-button type="primary" @click="deleteDialogClose">取消</el-button>
      </el-row>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'SuvCozManage',
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
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '关闭签到',
          onClick (picker) {
            const date = new Date(70, 0, 1, 0, 0, 0)
            picker.$emit('pick', date)
          }
        }]
      },
      rules: {
        siTime: [{type: 'date', required: true, message: '请选择日期时间', trigger: 'change'}]
      },
      week: '',
      supervisions: [],
      historyDialogVisible: false,
      suvRec: {},
      signInDialogVisible: false,
      signInSetting: {
        siWeek: '',
        scheduleSchId: '',
        siAuto: false,
        siTime: null
      },
      deleteDialogVisible: false,
      deleteSupervision: {},
      cozNameFilters: [],
      cozTeacherFilters: []
    }
  },
  created () {
    this.week = parseInt(this.curWeek.toString())
    this.onSearch()
  },
  methods: {
    onSearch () {
      this.$ajax
        .get('/administrator/suv-manage/supervisions', Object.assign({
          params: {
            suvWeek: this.week
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.data) {
            this.supervisions = res.data
            const cozNameFilters = new Set()
            const cozTeacherFilters = new Set()
            this.supervisions.forEach(suv => {
              cozNameFilters.add(suv.scheduleWithCozDtl.course.cozName)
              Array
                .of(...suv.scheduleWithCozDtl.course.teacherList)
                .map(user => {
                  return user.usrName
                })
                .forEach(usrName => {
                  cozTeacherFilters.add(usrName)
                })
            })
            this.cozTeacherFilters = Array.from(cozTeacherFilters).map(usrName => {
              return {
                text: usrName,
                value: usrName
              }
            })
            this.cozNameFilters = Array.from(cozNameFilters).map(cozName => {
              return {
                text: cozName,
                value: cozName
              }
            })
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
    showHistory (supervision) {
      this
        .$ajax
        .get('/administrator/suv-manage/suv-history', Object.assign({
          params: {
            suvId: supervision.suvId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.data) {
            this.suvRec = res.data
            this.historyDialogVisible = true
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
    historyDialogClose () {
      this.suvRec = {}
      this.historyDialogVisible = false
    },
    showSignInSetting (supervision) {
      this.signInDialogVisible = true
      this
        .$ajax
        .get('/administrator/course/suv-sign-in', Object.assign({
          params: {
            suvWeek: supervision.suvWeek,
            scheduleSchId: supervision.scheduleWithCozDtl.schId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            this.signInSetting.siWeek = supervision.suvWeek
            this.signInSetting.scheduleSchId = supervision.scheduleWithCozDtl.schId
            if (!res.data) {
              this.signInSetting.siTime = new Date(70, 0, 1, 0, 0, 0)
              return
            }
            this.signInSetting.siAuto = res.data.siAuto
            this.signInSetting.siTime = res.data.siTime
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
    signInDialogClose () {
      this.$refs.signInSettingForm.resetFields()
      this.signInDialogVisible = false
    },
    changeSignIn () {
      const vm = this
      this.$refs.signInSettingForm.validate(valid => {
        if (valid) {
          vm.signInSetting.siTime.setHours(vm.signInSetting.siTime.getHours() + 8)
          vm.$ajax
            .post('/administrator/course/suv-sign-in', vm.signInSetting, vm.ajaxConfig)
            .then(res => {
              if (res && res.data && res.data.status) {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                vm.signInDialogClose()
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
                vm.$message({
                  showClose: true,
                  message: '登录过期, 请重新登录',
                  type: 'error'
                })
              } else {
                vm.$message({
                  showClose: true,
                  message: '网络发生了一点问题',
                  type: 'error'
                })
              }
            })
        }
      })
    },
    showDeleteDialog (supervision) {
      this.deleteDialogVisible = true
      this.deleteSupervision = supervision
    },
    deleteDialogClose () {
      this.deleteDialogVisible = false
      this.deleteSupervision = {}
    },
    doDeleteSupervision () {
      this.$ajax({
        method: 'delete',
        url: '/administrator/suv-manage/supervisions',
        data: this.deleteSupervision,
        headers: this.ajaxConfig.headers
      })
        .then(res => {
          if (res.status === 200 && res.data && res.data.status) {
            this.$message({
              showClose: true,
              message: '成功取消! ',
              type: 'success'
            })
            this.deleteDialogClose()
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
    cozNameFilterHandler (value, row) {
      return row.scheduleWithCozDtl.course.cozName === value
    },
    cozTeacherFilterHandler (value, row) {
      debugger
      return row.scheduleWithCozDtl.course.teacherList.filter(user => user.usrName === value).length > 0
    }
  }
}
</script>

<style scoped>
  .header {
    border-bottom: #c3d5e2 1px solid;
  }
</style>
