<template>
    <el-container>
        <el-main>
            <el-table v-loading="loading" :data="transList">
                <el-table-column label="督导周" prop="smtWeek"></el-table-column>
                <el-table-column label="课程序号" prop="sisSchedule.sisCourse.scId"></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "MyUntreatedTrans",
        data() {
            return {
                loading: false,
                transList: []
            }
        },
        created() {
            this.loading = true
            this.$request.monitor.getSchedules('untreated')
                .then(res => {
                    this.transList = res.data
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
                .finally(() => this.loading = false)
        }
    }
</script>

<style scoped>

</style>