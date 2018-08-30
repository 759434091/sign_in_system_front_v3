<template>
    <el-row class="login-box-row" type="flex" justify="center">
        <el-col class="login-box-col" :xl="4" :xs="12" :span="6">
            <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="loginRules">
                <el-form-item label="用户名/学号/教工号" prop="suId">
                    <el-input v-model="loginForm.suId" @keyup.enter.native="onSubmit"/>
                </el-form-item>
                <el-form-item label="密码" prop="suPassword">
                    <el-input type="password" v-model="loginForm.suPassword" @keyup.enter.native="onSubmit"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="isLoginProcessing">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                isLoginProcessing: false,
                loginForm: {
                    suId: '',
                    suPassword: ''
                },
                loginRules: {
                    suId: [{
                        required: true,
                        message: '用户名不能为空',
                        trigger: 'blur'
                    }],
                    suPassword: [{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            onSubmit() {
                this.isLoginProcessing = true
                this.$refs['loginForm'].validate((valid) => {
                    if (!valid) {
                        this.isLoginProcessing = false
                        return
                    }

                    this.$request.getToken(this.loginForm)
                        .then(res => {
                            if (!res.data.success) {
                                this.$message({
                                    message: res.data.message,
                                    type: 'error'
                                });
                                this.isLoginProcessing = false
                                return
                            }

                            const user = res.data.user;
                            if (user.suAuthorities.length > 1) {
                                //todo show model
                            } else {
                                //todo enter the one
                            }
                            //todo find storage

                            this.$store.commit('setToken', res.data.access_token)
                            this.$store.commit('setUser', res.data.user)
                            this.$router.push('/index')
                            this.isLoginProcessing = false
                        })
                        .catch(err => {
                            console.error(err)
                            this.isLoginProcessing = false
                        })
                });
            }
        }
    }
</script>

<style>
    .login-form .el-form-item.is-required .el-form-item__label:before {
        content: none;
    }

    .login-box-row {
        height: calc(100vh - 16px);
    }

    .login-box-col {
        padding: 10px 20px;
        margin: auto auto;
    }
</style>
