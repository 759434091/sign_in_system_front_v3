<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'app',
        created() {
            const _this = this
            this.$request.axios.interceptors.response.use(function (response) {
                if (!response)
                    return Promise.reject()
                return response
            }, function (error) {
                if (null == error.response) {
                    _this.$message.error('服务器无反应, 请稍后再试')
                    return Promise.reject(error)
                }

                if (401 === error.response.status) {
                    _this.$message.error('登录信息过期, 请重新登录')
                    _this.$router.push("/")
                    error.response = null
                    return Promise.reject(error)
                }
                return Promise.reject(error)
            })
        }
    }
</script>

<style>
    html {
        min-width: 1600px;
        background-color: #fcfcfc;
    }
</style>
