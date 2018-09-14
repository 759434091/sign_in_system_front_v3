<template>
  <el-container>
    <el-aside width="12%">
      <el-menu
        :router="true"
        :default-active="defaultActive"
        class="el-menu">
        <el-menu-item index="/index/supervisor/suvCourses">
          <i class="el-icon-edit-outline"></i>
          <span class="nav-title" slot="title">查看督导课程</span>
        </el-menu-item>
        <el-menu-item index="/index/supervisor/suvPool">
          <i class="el-icon-news"></i>
          <span class="nav-title" slot="title">领取督导课程</span>
        </el-menu-item>
        <el-menu-item index="/index/supervisor/approveLeave">
          <i class="el-icon-view"></i>
          <span class="nav-title" slot="title">审批请假</span>
        </el-menu-item>
        <el-menu-item index="/index/supervisor/suvTrans">
          <i class="el-icon-message"></i>
          <span class="nav-title" slot="title">督导转接</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="main">
      <el-card class="main-card">
        <router-view></router-view>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Supervisor',
  data () {
    return {
      defaultActive: ''
    }
  },
  created () {
    this.defaultActive = this.$route.path
  },
  watch: {
    '$route' () {
      this.defaultActive = this.$route.path
    }
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
