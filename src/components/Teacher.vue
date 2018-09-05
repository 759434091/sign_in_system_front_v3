<template>
    <el-container class="idx-second-container">
        <el-aside class="idx-el-aside" width="300px">
            <el-menu class="idx-second-menu" background-color="#828A92" text-color="#fff"
                     active-text-color="#ffd04b" default-active="1">
                <el-menu-item index="1" @click="courseTable">教学计划</el-menu-item>
                <el-menu-item index="2" @click="historySignIn">历史签到</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main class="idx-main">
            <router-view>
            </router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "Teacher",
        methods: {
            courseTable() {
                this.$router.push('/index/teacher/courseTable')
            },
            historySignIn() {
                this.$router.push("/index/teacher/historySignIn")
            }
        }
    }
</script>

<style scoped>

</style>