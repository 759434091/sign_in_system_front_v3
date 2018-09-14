<template>
    <div class="login-box"
         v-loading.fullscreen.lock="loading">
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.usrId"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginForm.usrPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="isSubmitDisabled" type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import '../../static/js/gt'

export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      loginForm: {},
      isSubmitDisabled: true,
      captchaObj: null
    }
  },
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    },
    user () {
      return this.$store.state.user
    },
    week () {
      return this.$store.state.week
    },
    expire () {
      return this.$store.state.expire
    }
  },
  created () {
    // 检查登录状态
    if (this.expire != null &&
        new Date() < this.expire &&
        JSON.stringify(this.ajaxConfig) !== '{}' &&
        JSON.stringify(this.user !== '{}') &&
        this.week !== '') {
      const lastPath = localStorage.getItem('lastPath')
      this.$router.push(lastPath == null ? '/index' : lastPath)
      localStorage.removeItem('lastPath')
      return
    }

    // 从localStorage获取状态
    let session = localStorage.getItem('session')
    if (session != null) {
      session = JSON.parse(session)
      const expire = new Date(session.expire)
      if (new Date() < expire) {
        this.$store.commit('updateWeek', session.week)
        this.$store.commit('login', session)
        const lastPath = localStorage.getItem('lastPath')
        this.$router.push(lastPath == null ? '/index' : lastPath)
        localStorage.removeItem('lastPath')
        return
      }
    }

    // 开始登录
    this
      .$ajax
      .get('/user/start-captcha', {
        params: {
          client_type: 'web',
          ip_address: window.returnCitySN.cip,
          time: (new Date()).getTime()
        }
      })
      .then((res) => {
        if (res && res.data && res.data.success === 1) {
          window.initGeetest({
            gt: res.data.gt,
            challenge: res.data.challenge,
            new_captcha: res.data.new_captcha,
            offline: !res.data.success,
            product: 'bind',
            https: true,
            width: '300px'
          }, handler)
          return
        }

        this.$router.push('/logout')
        this.$message({
          showClose: true,
          message: '服务器出了一点问题, 请稍后再试',
          type: 'error'
        })
      })
      .catch(err => {
        console.error(err)
        this.$router.push('/logout')
        this.$message({
          showClose: true,
          message: '网络发生了一点问题',
          type: 'error'
        })
      })

    const vm = this
    const handler = function (captchaObj) {
      vm.captchaObj = captchaObj
      vm.isSubmitDisabled = false
      captchaObj
        .onSuccess(function () {
          vm.loading = true
          let result = captchaObj.getValidate()
          if (!result) {
            return alert('请完成验证')
          }
          vm
            .$ajax
            .post('/user/verify-captcha', {
              client_type: 'web',
              ip_address: window.returnCitySN.cip,
              geetest_challenge: result.geetest_challenge,
              geetest_validate: result.geetest_validate,
              geetest_seccode: result.geetest_seccode
            })
            .then(res => {
              if (res && res.data && res.data.status === true) {
                vm.$store.commit('updateAjaxConfig', {
                  headers: {'Access-Token': res.data.token.toString()}
                })
                vm.doLogin()
              } else if (res.data.status === 'failure') {
                setTimeout(function () {
                  this.$message({
                    showClose: true,
                    message: '服务器出了一点问题, 请稍后再试',
                    type: 'error'
                  })
                  captchaObj.reset()
                }, 1500)
              }
            })
            .catch(err => {
              console.error(err)
              this.$router.push('/logout')
              this.$message({
                showClose: true,
                message: '网络发生了一点问题',
                type: 'error'
              })
            })
        })
    }
  },
  methods: {
    onSubmit () {
      this.captchaObj.verify()
    },
    doLogin: function () {
      this
        .$ajax
        .post('/user/user', this.loginForm, this.$store.state.ajaxConfig)
        .then(res => {
          if (res && res.data && res.data.user) {
            this.$store.commit('updateAjaxConfig', {
              headers: {'Access-Token': res.data.token.toString()}
            })
            this
              .$ajax
              .get('/user/week')
              .then(res2 => {
                if (res2 && res2.data && res2.data.currentWeek) {
                  const expire = new Date()
                  expire.setHours(expire.getHours() + 2)
                  let session = {}
                  session.user = res.data.user
                  session.token = res.data.token
                  session.week = res2.data.currentWeek
                  session.expire = expire
                  res.data.expire = expire
                  localStorage.setItem('session', JSON.stringify(session))
                  this.$store.commit('updateWeek', res2.data.currentWeek.toString())
                  this.$store.commit('login', res.data)
                  this.loading = false
                  this.$router.push('/index')
                  return
                }

                this.$router.push('/logout')
                this.$message({
                  showClose: true,
                  message: '服务器出了一点问题, 请稍后再试',
                  type: 'error'
                })
              })
              .catch(err => {
                console.error(err)
                this.$router.push('/logout')
                this.$message({
                  showClose: true,
                  message: '网络发生了一点问题',
                  type: 'error'
                })
              })
            return
          }

          if (res && res.data && res.data.err === -1) {
            this.loginForm = {}
            this.$message({
              showClose: true,
              message: '用户名或密码错误',
              type: 'error'
            })
            this.$router.push('/logout')
            return
          }

          this.$router.push('/logout')
          this.$message({
            showClose: true,
            message: '网络发生了一点问题',
            type: 'error'
          })
        })
        .catch(err => {
          console.error(err)
          this.$router.push('/logout')
          this.$message({
            showClose: true,
            message: '网络发生了一点问题',
            type: 'error'
          })
        })
    }
  }
}
</script>

<style scoped>
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
