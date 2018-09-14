<template>
  <el-container>
    <el-aside width="12%">
      <el-menu
        :router="true"
        :default-active="defaultActive"
        class="el-menu">
        <el-menu-item index="/index/student/courseTable">
          <i class="el-icon-date"></i>
          <span slot="title">查看课表</span>
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
  name: 'Student',
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
    min-height: 830px;
    margin-top: 15px;
    height: calc(100vh - 130px);
  }
</style>
