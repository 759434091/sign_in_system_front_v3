<template>
    <el-container>
        <el-main>
            <el-table :data="courseList" v-loading="loading">
                <el-table-column label="课程序号" prop="scId"></el-table-column>
                <el-table-column label="课程名字" prop="scName"></el-table-column>
                <el-table-column label="任课老师">
                    <template slot-scope="scope">
                        <div v-for="val in getTeacherList(scope.row.sisJoinCourseList)"
                             :key="val.suId">
                            <span v-text="`${val.suName} ${val.suId}`">
                                <br>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="上课时间">
                    <template slot-scope="scope">
                        <div v-for="val in scope.row.sisScheduleList"
                             :key="val.ssId">
                            <span v-text="getScheduleTimeString(val)">
                                <br>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="课程容量" prop="scMaxSize"></el-table-column>
                <el-table-column label="实际人数" prop="scActSize"></el-table-column>
                <el-table-column label="到勤率" prop="scAttRate" width="70">
                    <template slot-scope="scope">
                        <div v-text="null == scope.row.scAttRate ? '无' : scope.row.scAttRate"></div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" @click="showSupervision(scope.row.scId)">
                            督导历史
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <SupervisionsDialog :dialogVisible="supervisionsDialog.dialogVisible"
                            :scId="supervisionsDialog.scId"
                            @closeDialog="closeSupervision"/>
    </el-container>
</template>

<script>
    import courseUtils from '@/util/courseUtils'
    import SupervisionsDialog from "../dialog/SupervisionsDialog";

    export default {
        name: "CourseTable",
        components: {SupervisionsDialog},
        data() {
            return {
                loading: false,
                courseList: [],
                supervisionsDialog: {
                    dialogVisible: false,
                    scId: ''
                }
            }
        },
        created() {
            this.loading = true
            this.$request.monitor.getCourseTable()
                .then(res => {
                    this.courseList = res.data.list
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
                .finally(() => {
                    this.loading = false
                })
        },
        methods: {
            showSupervision(scId) {
                this.supervisionsDialog.dialogVisible = true
                this.supervisionsDialog.scId = scId
            },
            getTeacherList(joinCourseList) {
                return joinCourseList
                    .filter(joinCourse => joinCourse.joinCourseType === 1)
                    .map(joinCourse => joinCourse.sisUser)
            },
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            },
            closeSupervision() {
                this.supervisionsDialog.dialogVisible = false
                this.supervisionsDialog.scId = ''
            }
        }
    }
</script>

<style scoped>

</style>