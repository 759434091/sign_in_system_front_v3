<template>
  <el-dialog title="查看学生"
             :visible.sync="dialogVisible"
             :before-close="closeDialog">
    <el-table :data="studentList">
      <el-table-column prop="usrId" label="学号"></el-table-column>
      <el-table-column prop="usrName" label="姓名"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'CozStuDialog',
  props: ['dialogVisible', 'course'],
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      studentList: []
    }
  },
  watch: {
    course (newVal) {
      if (JSON.stringify(newVal) === '{}') {
        return
      }
      this.$ajax
        .get('/administrator/course/student', Object.assign({
          params: {
            cozId: this.course.cozId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            this.studentList = res.data
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
    }
  }
}
</script>

<style scoped>

</style>
