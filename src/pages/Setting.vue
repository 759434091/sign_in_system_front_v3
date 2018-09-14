<template>
  <el-container>
    <el-aside width="12%">
      <el-menu
        default-active="1"
        class="el-menu">
        <el-menu-item index="1">
          <i class="el-icon-setting"></i>
          <span slot="title">修改密码</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="main">
      <el-card class="main-card">
        <el-form ref="changePwdForm" style="width: 500px" label-width="100px" label-position="right" :model="pwdForm"
                 :rules="rules">
          <el-form-item>
            <h1 class="title">修改密码</h1>
          </el-form-item>
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="pwdForm.oldPwd" type="password" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="pwdForm.newPwd" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPwd">
            <el-input v-model="pwdForm.confirmPwd" type="password" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doChange">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Setting',
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    const vm = this
    const checkConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== vm.$refs.changePwdForm.model.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const checkOldNew = (rule, value, callback) => {
      if (value === vm.$refs.changePwdForm.model.oldPwd) {
        callback(new Error('新密码不能与旧密码一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        oldPwd: [{required: true, message: '请输入旧密码', trigger: 'blur'}, {
          min: 6,
          max: 18,
          message: '长度在 6 到 18 个字符',
          trigger: 'blur'
        }],
        newPwd: [{required: true, message: '请输入新密码', trigger: 'blur'}, {
          min: 6,
          max: 18,
          message: '长度在 6 到 18 个字符',
          trigger: 'blur'
        }, {validator: checkOldNew, trigger: 'blur'}],
        confirmPwd: [{required: true, message: '请确认密码', trigger: 'blur'}, {
          min: 6,
          max: 18,
          message: '长度在 6 到 18 个字符',
          trigger: 'blur'
        }, {validator: checkConfirm, trigger: 'blur'}]
      },
      pwdForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      }
    }
  },
  methods: {
    doChange () {
      this.$ajax
        .patch('/user/user', this.pwdForm, this.ajaxConfig)
        .then(res => {
          if (res && res.data && res.data.status) {
            this.$message({
              showClose: true,
              message: '修改密码成功',
              type: 'success'
            })
            return
          }

          this.$message({
            showClose: true,
            message: '修改密码失败, 请稍后再试',
            type: 'error'
          })
        })
        .catch(err => {
          console.error(err)
          if (err.status === 401) {
            this.$message({
              showClose: true,
              message: '登录过期, 请重新登录',
              type: 'error'
            })
            return
          }

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
  .el-menu {
    min-height: 850px;
    height: calc(100vh - 80px);
    border: #E5E9F2 1px solid;
    border-bottom-left-radius: 5px;
  }

  .main {
    min-height: 852px;
    background-color: #E5E9F2;
    padding: 0 20px 0 20px;
    height: calc(100vh - 78px);
    border: #E5E9F2 1px solid;
    border-bottom-right-radius: 5px;
  }

  .main-card {
    margin-top: 15px;
    height: calc(100vh - 130px);
  }

  .title {
    font-size: 2rem;
    font-weight: normal;
  }
</style>
