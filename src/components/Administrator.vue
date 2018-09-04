<template>
    <el-container class="idx-second-container">
        <el-aside class="idx-el-aside" width="300px">
            <el-menu class="idx-second-menu" background-color="#828A92" text-color="#fff"
                     active-text-color="#ffd04b" default-active="1">
                <el-menu-item index="1" @click="courseManage">课程管理</el-menu-item>
                <el-menu-item index="2" @click="monitorManage">督导员管理</el-menu-item>
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
        name: "Administrator",
        methods: {
            courseManage() {
                this.$router.push('/index/administrator/courseManage')
            },
            monitorManage() {
                this.$router.push('/index/administrator/monitorManage')
            }
        }
    }
</script>

<style scoped>

</style>