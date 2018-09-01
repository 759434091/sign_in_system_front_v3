<template>
    <el-container class="idx-second-container">
        <el-aside class="idx-el-aside" width="300px">
            <el-menu class="idx-second-menu" background-color="#828A92" text-color="#fff"
                     active-text-color="#ffd04b" default-active="2">
                <el-menu-item index="1" @click="goBack">返回</el-menu-item>
                <el-menu-item index="2" @click="passwordSetting">修改密码</el-menu-item>
                <el-menu-item index="3" @click="roleSetting" v-if="user.suAuthorities.length > 1">切换角色</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main class="idx-main">
            <router-view>
            </router-view>
        </el-main>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Setting",
        computed: {
            ...mapState({
                user: 'user',
                backSetting: 'backSetting'
            })
        },
        methods: {
            goBack() {
                if ('' === this.backSetting)
                    return this.$router.push('/index')
                this.$router.push(this.backSetting)
                this.$store.commit('backSetting', '')
            },
            passwordSetting() {
                this.$router.push('/index/setting/passwordSetting')
            },
            roleSetting() {
                this.$router.push('/index/setting/roleSetting')
            }
        }
    }
</script>

<style scoped>

</style>