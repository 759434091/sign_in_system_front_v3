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
        :data="supervisions" height="700">
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
                <el-dropdown-item @click.native="showTransDialog(scope.row)">督导转让</el-dropdown-item>
                <el-dropdown-item @click.native="showGiveUpDialog(scope.row)">放弃督导</el-dropdown-item>
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
        </el-form-item>
        <el-form-item>
          <el-button @click="changeSignIn">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="督导转让"
               :visible.sync="transDialogVisible"
               :before-close="transDialogClose">
      <el-form :model="transForm"
               ref="transFormRef">
        <el-form-item label="转让人学号">
          <el-col :span="7">
            <el-input v-model="transForm.userUsrId"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="applyTrans">发起申请</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'SuvCourses',
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
      supervisions: [],
      week: '',
      historyDialogVisible: false,
      suvRec: {},
      signInDialogVisible: false,
      signInSetting: {
        siWeek: '',
        scheduleSchId: '',
        siAuto: false,
        siTime: ''
      },
      transDialogVisible: false,
      transForm: {
        supervision: {
          suvId: ''
        },
        userUsrId: ''
      },
      giveUpDialogVisible: false,
      giveUpSuvId: ''

    }
  },
  computed: {
    curWeek () {
      return this.$store.state.week
    },
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  created () {
    this.week = parseInt(this.curWeek)
    this.onSearch()
  },
  methods: {
    onSearch () {
      this
        .$ajax
        .get('/supervisor/supervisions', {
          params: {
            suvWeek: this.week
          },
          headers: this.ajaxConfig.headers
        })
        .then(res => {
          if (res && res.data) {
            this.supervisions = res.data
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
          if (err.response.response.response.status === 401) {
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
        .get('/supervisor/history', Object.assign({
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

          this.$message({
            showClose: true,
            message: '服务器出了一点问题, 请稍后再试',
            type: 'error'
          })
        })
        .catch(err => {
          console.error(err)
          if (err.response.response.response.status === 401) {
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
    showSignInSetting: function (supervision) {
      this.signInDialogVisible = true
      this
        .$ajax
        .get('/supervisor/suv-sign-in', Object.assign({
          params: {
            suvWeek: supervision.suvWeek,
            scheduleSchId: supervision.scheduleWithCozDtl.schId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            if (res.data.siTime === '1970-01-01T00:00:00') {
              this.signInSetting.siTime = ''
            } else {
              this.signInSetting.siTime = res.data.siTime
            }
            this.signInSetting.siAuto = res.data.siAuto
            this.signInSetting.siWeek = supervision.suvWeek
            this.signInSetting.scheduleSchId = supervision.scheduleWithCozDtl.schId
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
          if (err.response.response.response.status === 401) {
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
          if (vm.signInSetting.siTime === '') {
            vm.signInSetting.siTime = new Date(70, 0, 1, 0, 0, 0)
          }
          vm.signInSetting.siTime.setHours(vm.signInSetting.siTime.getHours() + 8)
          vm.$ajax
            .post('/supervisor/suv-sign-in', vm.signInSetting, vm.ajaxConfig)
            .then(res => {
              if (res && res.data && res.data.status) {
                vm.$message({
                  showClose: true,
                  message: '修改成功! ',
                  type: 'success'
                })
                vm.signInDialogClose()
                return
              }

              vm.$message({
                showClose: true,
                message: '服务器出了一点问题, 请稍后再试',
                type: 'error'
              })
            })
            .catch(err => {
              console.error(err)
              if (err.response.response.response.status === 401) {
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
    showTransDialog (supervision) {
      this.transDialogVisible = true
      this.transForm.supervision.suvId = supervision.suvId
    },
    transDialogClose () {
      this.transForm = {
        supervision: {
          suvId: ''
        },
        usrId: ''
      }
      this.$refs.transFormRef.resetFields()
      this.transDialogVisible = false
    },
    applyTrans () {
      if (this.transForm.userUsrId === '') {
        return
      }

      this.$ajax
        .put('supervisor/trans-supervision', this.transForm, this.ajaxConfig)
        .then(res => {
          if (res && res.data && res.data.status) {
            this.$message({
              showClose: true,
              message: '提交申请成功! ',
              type: 'success'
            })
            this.transDialogClose()
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
          if (err.response.response.response.status === 401) {
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
    showGiveUpDialog (supervision) {
      this.$confirm('确定放弃督导, 将扣取信用分', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ajax
          .delete('/supervisor/supervisions', {suvId: supervision.suvId}, this.ajaxConfig)
          .then(res => {
            if (res && res.data && res.data.status) {
              this.$message({
                showClose: true,
                message: '操作成功! ',
                type: 'success'
              })
              this.giveUpDialogClose()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style scoped>
  .header {
    border-bottom: #c3d5e2 1px solid;
  }

  .history-dialog p {
    font-size: 1.2rem;
  }
</style>
