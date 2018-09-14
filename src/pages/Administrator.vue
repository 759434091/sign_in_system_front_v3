<template>
  <el-container>
    <el-aside width="12%">
      <el-menu
        :router="true"
        :default-active="defaultActive"
        class="el-menu">
        <el-menu-item index="/index/administrator/statistics">
          <span slot="title">
            <i class="el-icon-view"></i>统计
          </span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-edit-outline"></i>
            <span>督导管理</span>
          </template>
          <el-menu-item index="/index/administrator/suvManage">
          <span slot="title">
            <i class="el-icon-service"></i>管理督导员
          </span>
          </el-menu-item>
          <el-menu-item index="/index/administrator/suvCozManage">
          <span slot="title">
            <i class="el-icon-edit"></i>管理课程
          </span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/index/administrator/signInManage">
          <span slot="title">
            <i class="el-icon-document"></i>课程到勤详细
          </span>
        </el-menu-item>
        <el-menu-item index="/index/administrator/cozManage">
          <span slot="title">
            <i class="el-icon-date"></i>查看课程计划
          </span>
        </el-menu-item>
        <el-menu-item index="/index/administrator/upload">
          <span slot="title">
            <i class="el-icon-upload"></i>新增 | 上传
          </span>
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
  name: 'administrator',
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
    min-height: 830px;
    height: calc(100vh - 130px);
  }
</style>
