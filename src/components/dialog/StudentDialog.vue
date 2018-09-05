<template>
    <el-dialog title="学生信息"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-table :data="userList">
            <el-table-column label="账号/学号" prop="suId"></el-table-column>
            <el-table-column label="姓名" prop="suName"></el-table-column>
        </el-table>
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