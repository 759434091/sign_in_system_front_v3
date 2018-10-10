<template>
    <el-dialog :title="getTitle()"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-container>
            <el-header>
                <el-form :inline="true" size="mini">
                    <el-form-item label="上课时间">
                        <el-select placeholder="上课时间" v-model="ssId">
                            <el-option label="未选择" value=""></el-option>
                            <el-option v-for="val in scheduleList"
                                       :key="`hsid_${val.ssId}`"
                                       :label="getScheduleTimeString(val)"
                                       :value="val.ssId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="周">
                        <el-select placeholder="请选择周" v-model="week" @change="handleWeekSelect">
                            <el-option v-for="val in getWeekList(ssId)"
                                       :disabled="val.disable"
                                       :key="`hsid_${val.value}`"
                                       :label="val.label"
                                       :value="val.value.toString()">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main>
                <el-table :data="tableData" v-loading="loading">
                    <el-table-column label="学号" prop="suId"></el-table-column>
                    <el-table-column label="姓名" prop="sisUser.suName"></el-table-column>
                    <el-table-column label="签到状态" prop="ssidStatus">
                        <template slot-scope="scope">
                            <div v-text="scope.row.ssidStatus ? '已签到' : '缺勤'">
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </el-dialog>
</template>

<script>
    import courseUtils from "@/util/courseUtils";

    export default {
        name: "HistorySignInDialog",
        props: {
            course: Object,
            dialogVisible: Boolean
        },
        data() {
            return {
                loading: false,
                ssId: '',
                week: '',
                scheduleList: [],
                tableData: []
            }
        },
        watch: {
            course: function (course) {
                if ('' === course.scId) return

                this.loading = true
                this.$request.administrator
                    .getSignIns(course.scId)
                    .then(res => {
                        this.scheduleList = res.data.sisScheduleList
                        this.scheduleList.forEach(s => s.ssId = s.ssId.toString())
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
        },
        methods: {
            closeDialog() {
                this.$emit('closeDialog')
                this.ssId = ''
                this.week = ''
                this.scheduleList = []
                this.tableData = []
            },
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            },
            getWeekList(ssId) {
                if ('' === ssId)
                    return []
                const schedule = this.scheduleList.find(schedule => schedule.ssId === ssId)
                if (null == schedule)
                    return []
                const weekList = ((start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start))(schedule.ssStartWeek, schedule.ssEndWeek)
                return weekList
                    .map(week => {
                        const processing = schedule
                            .sisProcessingList
                            .find(e => e.week === week)
                        if (processing) {
                            return {
                                value: week,
                                label: `${week} 进行中`,
                                disable: true
                            }
                        }

                        const signIn = schedule
                            .sisSignInList
                            .find(e => e.ssiWeek === week)
                        if (signIn)
                            return {
                                value: week,
                                label: `${week} 已签到`,
                                disable: false
                            }

                        return null
                    })
                    .filter(s => null != s)
            },
            handleWeekSelect(week) {
                if ('' === week)
                    return
                const schedule = this.scheduleList.find(schedule => schedule.ssId === this.ssId)
                if (null == schedule)
                    return

                const sisSignIn = schedule.sisSignInList.find(e => e.ssiWeek === parseInt(week))
                if (null === sisSignIn)
                    return
                this.tableData = sisSignIn.sisSignInDetailList
            },
            getTitle() {
                if (null == this.course) return '历史签到'
                let tchStr = ''
                this.course.sisJoinCourseList
                    .map(joinCourse => joinCourse.sisUser)
                    .forEach(t => tchStr += t.suName + ' ')

                return `${this.course.scName} ${this.course.scId} ${tchStr}`
            }
        }
    }
</script>

<style scoped>

</style>