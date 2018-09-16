<template>
    <el-dialog title="学生信息"
               top="20px"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-container>
            <el-header height="40px">
                <span>查看课堂缺勤数请在历史签到查看</span>
            </el-header>
            <el-main>
                <el-table :data="userList" height="600px">
                    <el-table-column label="账号/学号" prop="suId"></el-table-column>
                    <el-table-column label="姓名" prop="suName"></el-table-column>
                    <el-table-column label="总缺勤数(按该学生课表计算)" prop="suiCozLackNum"></el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </el-dialog>
</template>

<script>
    export default {
        name: "ShowStudentDialog",
        props: {
            dialogVisible: Boolean,
            userList: Array
        },
        data() {
            return {}
        },
        methods: {
            closeDialog() {
                this.$emit('closeDialog')
            }
        }
    }
</script>

<style scoped>

</style>