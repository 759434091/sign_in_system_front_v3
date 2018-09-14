<template>
  <el-dialog title="签到设置"
             class="sign-in-dialog"
             :visible.sync="dialogVisible"
             :before-close="closeDialog">
    <el-form
      ref="signInSettingForm"
      label-width="140px"
      :model="signInSetting"
      :rules="signInRules">
      <el-form-item label="上课时间" prop="scheduleSchId">
        <el-select v-model="signInSetting.scheduleSchId" placeholder="上课时间" value="">
          <el-option
            v-for="val in course.scheduleList"
            :key="val.schId"
            :label="`星期${dayMap.get(val.schDay)} 第${val.schStartTime}~${val.schEndTime}节`"
            :value="val.schId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择签到周" prop="siWeek">
        <el-select v-model="signInSetting.siWeek" value="" @change="getSignInSetting">
          <el-option v-for="val in 20"
                     v-if="val >= curWeek && val <= getEndWeek(signInSetting.scheduleSchId)"
                     :key="val"
                     :label="val === parseInt(curWeek) ? val + '(当前周)' : (val === getEndWeek(signInSetting.scheduleSchId) ? val + '(结束周)' : val)"
                     :value="val"></el-option>
        </el-select>
      </el-form-item>
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
        <el-button type="primary" @click="changeSignIn">提交</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'SignInDialog',
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
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '关闭签到',
          onClick (picker) {
            picker.$emit('pick', '不设置')
          }
        }]
      },
      signInRules: {
        scheduleSchId: [{required: true, message: '请选择上课时间', trigger: ['blur', 'change']}],
        siWeek: [{required: true, message: '请选择签到周', trigger: 'blur'}]
      },
      signInSetting: {
        course: {},
        siWeek: '',
        scheduleSchId: '',
        siAuto: false,
        siTime: ''
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    getEndWeek (schId) {
      if (JSON.stringify(this.course) === '{}') {
        return -1
      }

      for (let schedule of this.course.scheduleList) {
        if (schedule.schId === schId) {
          return schedule.schEndWeek
        }
      }

      return -1
    },
    getSignInSetting () {
      this
        .$ajax
        .get('/administrator/course/suv-sign-in', Object.assign({
          params: {
            suvWeek: this.signInSetting.siWeek,
            scheduleSchId: this.signInSetting.scheduleSchId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            if (!res.data) {
              this.signInSetting.siTime = ''
              return
            }
            if (res.data.siTime === '1970-01-01T00:00:00') {
              this.signInSetting.siTime = ''
            } else {
              this.signInSetting.siTime = res.data.siTime
            }
            this.signInSetting.siAuto = res.data.siAuto
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
    changeSignIn () {
      const vm = this
      if (vm.signInSetting.siTime === '') {
        vm.signInSetting.siTime = new Date(70, 0, 1, 0, 0, 0)
      }
      this.$refs.signInSettingForm.validate(valid => {
        if (valid) {
          vm.signInSetting.siTime.setHours(vm.signInSetting.siTime.getHours() + 8)
          vm.$ajax
            .post('/administrator/course/suv-sign-in', vm.signInSetting, vm.ajaxConfig)
            .then(res => {
              if (res && res.data && res.data.status) {
                vm.closeDialog()
                vm.$message({
                  showClose: true,
                  message: '修改成功! ',
                  type: 'success'
                })
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
    }
  }
}
</script>

<style scoped>

</style>
