<template>
    <el-dialog title="新增督导员"
               width="400px"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-form :model="newMonitorForm">
            <el-form-item label="学号">
                <el-autocomplete v-model="newMonitorForm.suId"
                                 placeholder="请输入学号"
                                 :fetch-suggestions="querySearchAsync"
                                 @select="handleSelect">

                </el-autocomplete>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="newMonitorForm.suName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doGrant">
                    确定
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "GrantMonitorDialog",
        props: {
            dialogVisible: Boolean
        },
        data() {
            return {
                newMonitorForm: {
                    suId: '',
                    suName: ''
                },
                suggestList: []
            }
        },
        methods: {
            doGrant() {
                this.$request.administrator.grantMonitor(this.newMonitorForm.suId)
                    .then(res => {
                        if (!res.data.success) {
                            this.$message.error("提交失败")
                            return
                        }

                        this.$message.success("操作成功")
                        this.closeDialog()
                    })
                    .catch(err => {
                        if (!err.response || !err.response.data)
                            return
                        if (!err.response.data.message) {
                            this.$message.error(err.response.data)
                            return
                        }
                        this.$message.error(err.response.data.message)
                    })
            },
            closeDialog() {
                this.newMonitorForm.suId = ''
                this.newMonitorForm.suName = ''
                this.$emit('closeDialog')
            },
            querySearchAsync(val, callback) {
                if ('' === val)
                    return
                debugger
                this.$request.administrator.getStudents(1, 10, val, '')
                    .then(res => {
                        debugger
                        if (!res.data.success)
                            return

                        this.suggestList = res.data.data.list
                        callback(this.suggestList)
                    })
                    .catch(() => {
                        debugger
                    })
            },
            handleSelect() {

            }
        }
    }
</script>

<style scoped>

</style>