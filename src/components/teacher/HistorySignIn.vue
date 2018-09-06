<template>
    <el-container>
        <el-header>
            <el-form :inline="true" size="mini" :model="selectForm">
                <el-form-item label="课程">
                    <el-select v-model="selectForm.scId" @change="clearSsId">
                        <el-option v-for="val in courseList"
                                   :key="val.scId"
                                   :label="`${val.scName} ${val.scId}`"
                                   :value="val.scId">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上课时间">
                    <el-select v-model="selectForm.ssId">
                        <el-option
                                v-for="val in getScheduleList(selectForm.scId)"
                                :key="val.ssId"
                                :label="getScheduleTimeString(val)"
                                :value="val.ssId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="周">
                    <el-select v-model="selectForm.week" :loading="loading">
                        <el-option
                                v-for="val in getWeekList(selectForm.ssId)"
                                :key="val.value"
                                :label="val.label"
                                :value="val.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSure" :loading="loading">
                        确定
                    </el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-table :data="null == signIn ? null : signIn.sisSignInDetailList">
                <el-table-column label="学号" prop="suId"></el-table-column>
                <el-table-column label="姓名" prop="sisUser.suName"></el-table-column>
                <el-table-column label="签到状态">
                    <template slot-scope="scope">
                        <div v-text="scope.row.ssidStatus ? '已签到' : '缺勤'">
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    import courseUtils from '@/util/courseUtils'

    export default {
        name: "HistorySignIn",
        data() {
            return {
                courseList: [],
                selectForm: {
                    scId: '',
                    ssId: '',
                    week: ''
                },
                loading: false,
                scheduleWithSignInList: [],
                signIn: null
            }
        },
        created() {
            this.$request.teacher.getCourseTable()
                .then(res => {
                    if (!res.data.success) {
                        this.$message.error(res.data.message)
                        return
                    }
                    this.courseList = res.data.array.map(joinCourse => joinCourse.sisCourse)
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
        methods: {
            getScheduleList(scId) {
                const course = this.courseList.find(course => course.scId === scId)
                if (!course)
                    return []
                return course.sisScheduleList
            },
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            },
            clearSsId() {
                this.selectForm.ssId = ''
                this.loading = true
                this.$request.teacher.getSignIns(this.selectForm.scId)
                    .then(res => {
                        if (!res.data.success) {
                            this.$message.error(res.data.message)
                            return
                        }

                        const scheduleWithSignInList = res.data.course.sisScheduleList
                        this.scheduleWithSignInList = null == scheduleWithSignInList ? null : scheduleWithSignInList
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
            getWeekList(ssId) {
                if ('' === ssId)
                    return []
                const course = this.courseList.find(course => course.scId === this.selectForm.scId)
                if (!course)
                    return []
                const schedule = course.sisScheduleList.find(schedule => schedule.ssId === ssId)
                if (!schedule)
                    return []
                const weekList = ((start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start))(schedule.ssStartWeek, schedule.ssEndWeek)
                if (weekList.length <= 0)
                    return []
                if (this.loading)
                    return []
                if (null == this.scheduleWithSignInList)
                    return []
                const scheduleWithSignIn = this.scheduleWithSignInList.find(schedule => schedule.ssId = ssId)
                if (!scheduleWithSignIn)
                    return []

                return weekList
                    .map(week => {
                        const processing = scheduleWithSignIn.sisProcessingList.find(e => e.week === week)
                        if (processing) {
                            return {
                                value: week,
                                label: `${week} 进行中`
                            }
                        }

                        const signIn = scheduleWithSignIn.sisSignInList.find(e => e.ssiWeek === week)
                        if (signIn)
                            return {
                                value: week,
                                label: `${week} 已签到`
                            }

                        return null
                    })
                    .filter(s => null != s)
            },
            onSure() {
                this.loading = true
                const ssId = this.selectForm.ssId;
                const week = this.selectForm.week;
                this.signIn = this.scheduleWithSignInList.find(schedule => schedule.ssId = ssId).sisSignInList.find(e => e.ssiWeek === week)
                const _this = this
                setTimeout(() => {
                    _this.loading = false
                }, 300)
            }
        }
    }
</script>

<style scoped>

</style>