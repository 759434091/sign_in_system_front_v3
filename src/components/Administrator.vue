<template>
    <el-container class="idx-second-container">
        <el-aside class="idx-el-aside" width="280px">
            <el-menu class="idx-second-menu" background-color="#4b4b4b" text-color="#fff"
                     active-text-color="#ffd04b" :default-active="activeIndex">
                <el-menu-item index="1" @click="courseManage">全校课程</el-menu-item>
                <el-menu-item index="2" @click="monitorManage">督导员管理</el-menu-item>
                <el-menu-item index="3" @click="studentManage">学生管理</el-menu-item>
                <el-menu-item index="4" @click="importService">上传信息</el-menu-item>
                <el-submenu index="5">
                    <template slot="title">系统管理</template>
                    <el-menu-item index="5-1" @click="locationManage">地点管理</el-menu-item>
                </el-submenu>
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
        data() {
            return {
                activeIndex: '',
            }
        },
        created() {
            switch (this.$route.name) {
                case 'courseManage': {
                    this.activeIndex = '1'
                    return
                }
                case 'monitorManage': {
                    this.activeIndex = '2'
                    return
                }
                case 'studentManage': {
                    this.activeIndex = '3'
                    return
                }
                case 'importService': {
                    this.activeIndex = '4'
                    return
                }
                case 'locationManage': {
                    this.activeIndex = '5-1'
                    return
                }
                default: {
                    this.$router.push('/index/administrator/courseManage')
                }
            }
        },
        watch: {
            '$route'(to) {
                const name = to.name
                switch (name) {
                    case 'courseManage': {
                        this.activeIndex = '1'
                        return
                    }
                    case 'monitorManage': {
                        this.activeIndex = '2'
                        return
                    }
                    case 'studentManage': {
                        this.activeIndex = '3'
                        return
                    }
                    case 'importService': {
                        this.activeIndex = '4'
                        return
                    }
                    case 'locationManage': {
                        this.activeIndex = '5-1'
                        return
                    }
                    default: {
                        this.$router.push('/index/administrator/courseManage')
                    }
                }
            }
        },
        methods: {
            courseManage() {
                this.$router.push('/index/administrator/courseManage')
            },
            monitorManage() {
                this.$router.push('/index/administrator/monitorManage')
            },
            studentManage() {
                this.$router.push('/index/administrator/studentManage')
            },
            importService() {
                this.$router.push('/index/administrator/importService')
            },
            locationManage() {
                this.$router.push('/index/administrator/locationManage')
            }
        }
    }
</script>

<style scoped>

</style>