<template>
    <el-container>
        <el-main>
            <el-table v-loading="loading" :data="transList">
                <el-table-column label="督导周" prop="smtWeek"></el-table-column>
                <el-table-column label="课程序号" prop="sisSchedule.sisCourse.scId"></el-table-column>
                <el-table-column label="课程名字" prop="sisSchedule.sisCourse.scName"></el-table-column>
                <el-table-column label="任课老师">
                    <template slot-scope="scope">
                        <div v-for="val in getTeacherList(scope.row.sisSchedule.sisCourse.sisJoinCourseList)"
                             :key="val.suId">
                            <span v-text="`${val.suName} ${val.suId}`">
                                <br>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="上课时间">
                    <template slot-scope="scope">
                        <span v-text="getScheduleTimeString(scope.row.sisSchedule)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="课程容量" prop="sisSchedule.sisCourse.scMaxSize"></el-table-column>
                <el-table-column label="实际人数" prop="sisSchedule.sisCourse.scActSize"></el-table-column>
                <el-table-column label="到勤率" prop="sisSchedule.sisCourse.scAttRate" width="70">
                    <template slot-scope="scope">
                        <div v-text="null == scope.row.sisSchedule.sisCourse.scAttRate ? '无' : scope.row.sisSchedule.sisCourse.scAttRate"></div>
                    </template>
                </el-table-column>
                <el-table-column label="处理状态" prop="smtStatus">
                    <template slot-scope="scope">
                        <span v-text="getSmtStatus(scope.row.smtStatus)"></span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    import courseUtils from "@/util/courseUtils";

    export default {
        name: "MyApplyTrans",
        data() {
            return {
                loading: false,
                transList: []
            }
        },
        created() {
            this.loading = true
            this.$request.monitor.getSchedules('mine')
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
        },
        methods: {
            getTeacherList(joinCourseList) {
                return joinCourseList
                    .filter(joinCourse => joinCourse.joinCourseType === 1)
                    .map(joinCourse => joinCourse.sisUser)
            },
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            },
            getSmtStatus(smtStatus) {
                switch (smtStatus) {
                    case 0:
                        return '未处理'
                    case 1:
                        return '已接受'
                    case 2:
                        return '已拒绝'
                    default:
                        return '未处理'
                }
            }
        }
    }
</script>

<style scoped>

</style>