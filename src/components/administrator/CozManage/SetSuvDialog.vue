<template>
  <el-dialog title="设置督导"
             :visible.sync="dialogVisible"
             :before-close="closeDialog">
    <el-form v-for="(suvForm, idx) in suvFormList"
             :key="idx"
             :model="suvForm"
             :rules="rules"
             label-width="80px">
      <el-form-item label="上课时间" prop="schId">
        <el-select placeholder="上课时间"
                   @change="scheduleChange(suvForm)"
                   value=""
                   v-if="course.scheduleList"
                   v-model="suvForm.schId">
          <el-option
            v-for="val in course.scheduleList"
            :key="val.schId"
            :label="`星期${dayMap.get(val.schDay)} 第${val.schStartTime}~${val.schEndTime}节`"
            :value="val.schId"></el-option>
        </el-select>
        <el-button style="margin-left: 20px" type="primary" @click="deleteSchedule(idx)">删除</el-button>
      </el-form-item>
      <el-form-item label="周">
        <el-col :span="5">
          <el-select v-model="suvForm.startWeek"
                     placeholder="周"
                     value=""
                     style="width: 100%">
            <el-option label="请选择"
                       value=""></el-option>
            <el-option
              v-for="val in parseInt('20')"
              v-if="val >= curWeek && val <= getEndWeek(suvForm.schId)"
              :key="val"
              :label="val === parseInt(curWeek) ? (val + ' (当前周)') : val"
              :value="val"
              :disabled="suvForm.hasSet.includes(val)"></el-option>
          </el-select>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="5">
          <el-select v-model="suvForm.endWeek" placeholder="周" value="" style="width: 100%">
            <el-option label="请选择"
                       value=""></el-option>
            <el-option
              v-for="val in parseInt('20')"
              v-if="val >= curWeek && val <= getEndWeek(suvForm.schId)"
              :key="val"
              :label="val === getEndWeek(suvForm.schId) ? (val + ' (结束周)') : val"
              :value="val"
              :disabled="suvForm.hasSet.includes(val)"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="putSupervision">提交</el-button>
        <el-button @click="addSchedule">新增</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'SetSuvDialog',
  computed: {
    curWeek () {
      return this.$store.state.week
    },
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  props: ['dialogVisible', 'course'],
  data () {
    return {
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']]),
      rules: {
        schId: [{required: true, message: '请选择上课时间', trigger: 'change'}]
      },
      suvFormList: [{
        hasSet: [],
        startWeek: '',
        endWeek: '',
        schId: ''
      }]
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
    scheduleChange (suvForm) {
      if (JSON.stringify(this.course) === '{}') {
        return
      }

      this.$ajax
        .get('/administrator/schedule/supervisions', Object.assign({
          params: {
            schId: suvForm.schId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            suvForm.hasSet = res.data
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
    addSchedule () {
      this.suvFormList.push({
        startWeek: '',
        endWeek: '',
        schId: '',
        usrId: ''
      })
    },
    deleteSchedule (idx) {
      this.suvFormList.splice(idx, 1)
    },
    putSupervision () {
      let supervisionList = []
      this.suvFormList.forEach(suvForm => {
        for (let i = suvForm.startWeek; i <= suvForm.endWeek; i++) {
          supervisionList.push({
            scheduleWithCozDtl: {
              schId: suvForm.schId
            },
            suvWeek: i
          })
        }
      })
      if (supervisionList.length <= 0) {
        this.$message({
          showClose: true,
          message: '请选择',
          type: 'warning'
        })
      }
      this.$ajax
        .put('/administrator/suv-manage/supervisions', supervisionList, this.ajaxConfig)
        .then(res => {
          if (res && res.data && res.data.status) {
            this.$message({
              showClose: true,
              message: '修改成功! ',
              type: 'success'
            })
            this.signInDialogClose()
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
  }
}
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>
