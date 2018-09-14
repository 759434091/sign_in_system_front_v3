<template>
  <el-container>
    <el-aside width="12%">
      <el-menu
        :router="true"
        default-active="2"
        class="el-menu">
        <el-menu-item index="/index/teacher/tchCourses">
          <i class="el-icon-view"></i>
          <span class="nav-title" slot="title">查看教学课程</span>
        </el-menu-item>
        <el-menu-item index="/index/teacher/historySignIn">
          <i class="el-icon-edit"></i>
          <span class="nav-title" slot="title">查看历史签到</span>
        </el-menu-item>
        <el-menu-item index="/index/teacher/historySuv">
          <i class="el-icon-tickets"></i>
          <span class="nav-title" slot="title">查看历史督导</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="main">
      <el-card class="main-card">
        <router-view :courseList="courseList"></router-view>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Teacher',
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      courseList: []
    }
  },
  created () {
    this.$ajax
      .get('/teacher/courses', this.ajaxConfig)
      .then(res => {
        if (res && res.status === 200) {
          this.courseList = res.data
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
  }
}
</script>

<style scoped>
  .el-menu {
    min-height: 850px;
    height: calc(100vh - 80px);
    border: #E5E9F2 1px solid;
    border-bottom-left-radius: 5px;
  }

  .main{
    min-height: 852px;
    background-color: #E5E9F2;
    padding: 0 20px 0 20px;
    height: calc(100vh - 78px);
    border: #E5E9F2 1px solid;
    border-bottom-right-radius: 5px;
  }

  .main-card{
    margin-top: 15px;
    height: calc(100vh - 130px);
  }
</style>
