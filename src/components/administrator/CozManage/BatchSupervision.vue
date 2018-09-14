<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    :before-close="closeDialog">
    <span>对于选中课程, 将会发起从<strong>&nbsp;当周到结束周&nbsp;</strong>的<strong>&nbsp;所有上课时间&nbsp;</strong>督导设置. </span>
    <br>
    <p>请确定. </p>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="doBatchSupervision">确 定</el-button>
    <el-button @click="closeDialog">取 消</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'BatchSupervision',
  props: ['dialogVisible', 'courseList'],
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  methods: {
    doBatchSupervision () {
      let supervisionList = []
      this.courseList.forEach(course => {
        course.scheduleList.forEach(schedule => {
          for (let i = schedule.schStartWeek; i <= schedule.schEndWeek; i++) {
            supervisionList.push({
              scheduleWithCozDtl: {
                schId: schedule.schId
              },
              suvWeek: i
            })
          }
        })
      })
      if (supervisionList.length <= 0) {
        this.$message({
          showClose: true,
          message: '未选择任何课程',
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
    },
    closeDialog () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
