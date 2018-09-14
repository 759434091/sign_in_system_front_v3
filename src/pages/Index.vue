<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between" class="nav-header">
        <el-col :span="2">
          <p class="nav-brand">Happy SI</p>
        </el-col>
        <el-menu
          :defaultActive="defaultActive"
          :router="true"
          class="nav-menu"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item v-show="isStudent"
                        index="/index/student">
            <span slot="title">STUDENT</span>
          </el-menu-item>
          <el-menu-item v-show="isSupervisor"
                        index="/index/supervisor">
            <span slot="title">SUPERVISOR</span>
          </el-menu-item>
          <el-menu-item v-show="isTeacher"
                        index="/index/teacher">
            <span slot="title">TEACHER</span>
          </el-menu-item>
          <el-menu-item v-show="isAdministrator"
                        index="/index/administrator">
            <span slot="title">ADMINISTRATOR</span>
          </el-menu-item>
          <el-submenu class="last-item" index="/">
            <template slot="title">{{user.usrName}}</template>
            <el-menu-item index="/index/setting"><i class="el-icon-setting"></i><span>修改密码</span></el-menu-item>
            <el-menu-item index="/logout"><i class="el-icon-back"></i><span>退出</span></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-row>
    </el-header>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      defaultActive: ''
    }
  },
  computed: {
    expire () {
      return this.$store.state.expire
    },
    user () {
      return this.$store.state.user
    },
    isStudent () {
      if (!this.user) {
        return false
      }
      if (!this.user.hasOwnProperty('usrPermit')) {
        return false
      }
      return (this.user.usrPermit & 1) === 1
    },
    isSupervisor () {
      if (!this.user) {
        return false
      }
      if (!this.user.hasOwnProperty('usrPermit')) {
        return false
      }
      return (this.user.usrPermit & 2) === 2
    },
    isTeacher () {
      if (!this.user) {
        return false
      }
      if (!this.user.hasOwnProperty('usrPermit')) {
        return false
      }
      return (this.user.usrPermit & 4) === 4
    },
    isAdministrator () {
      if (!this.user) {
        return false
      }
      if (!this.user.hasOwnProperty('usrPermit')) {
        return false
      }
      return (this.user.usrPermit & 8) === 8
    }
  },
  created () {
    if (new Date() - this.expire >= 2 * 60 * 60 * 1000 ||
        JSON.stringify(this.user) === '{}'
    ) {
      localStorage.setItem('lastPath', this.$route.path)
      this.$router.push('/login')
    }

    const paths = this.$route.path.split(/\/+/)
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] === 'index') {
        this.defaultActive = `/${paths[i]}/${paths[i + 1]}`
      }
    }

    if (this.$route.path === '/index' ||
        this.$route.path === '/index/') {
      if ((this.user.usrPermit & 1) === 1) {
        this.defaultActive = '/index/student'
        this.$router.push('/index/student')
        return
      }
      if ((this.user.usrPermit & 2) === 2) {
        this.defaultActive = '/index/supervisor'
        this.$router.push('/index/supervisor')
        return
      }
      if ((this.user.usrPermit & 4) === 4) {
        this.defaultActive = '/index/teacher'
        this.$router.push('/index/teacher')
        return
      }
      if ((this.user.usrPermit & 8) === 8) {
        this.defaultActive = '/index/administrator'
        this.$router.push('/index/administrator')
      }
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route' () {
      const paths = this.$route.path.split(/\/+/)
      for (let i = 0; i < paths.length; i++) {
        if (paths[i] === 'index') {
          this.defaultActive = `/${paths[i]}/${paths[i + 1]}`
        }
      }
    }
  }

}
</script>

<style scoped>
  .nav-header {
    background-color: #545c64;
    height: 60px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .nav-brand {
    color: #fff;
    background-color: #545c64;
    height: 60px;
    margin: 0;
    padding-left: 1.5rem;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 60px;
    border-top-left-radius: 5px;
  }

  .nav-menu, .nav-menu li:last-of-type, .last-item {
    border-top-right-radius: 5px;
  }

  .main {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
