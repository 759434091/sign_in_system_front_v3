<template>
    <el-container class="idx-second-container">
        <el-aside class="idx-el-aside" width="300px">
            <el-menu class="idx-second-menu" background-color="#828A92" text-color="#fff"
                     active-text-color="#ffd04b" default-active="courseTable">
                <el-menu-item index="courseTable">查看课表</el-menu-item>
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
        name: 'Student'
    }
</script>

<style scoped>
</style>
