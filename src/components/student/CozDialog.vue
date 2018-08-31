<template>
    <el-dialog
            width="500px"
            title="查看课程"
            :visible.sync="dialogVisible"
            :before-close="closeDialog">
        <el-tabs v-model="active" type="card" :stretch="true">
            <el-tab-pane label="查看课程" name="showCozDtl">
                <el-form class="course-dtl-form" label-position="left" label-width="80px">
                    <el-form-item label="课程序号">
                        <span v-text="course.cozId"></span>
                    </el-form-item>
                    <el-form-item label="课程名称">
                        <span v-text="course.cozName"></span>
                    </el-form-item>
                    <el-form-item label="任课老师">
                        <div v-for="val in course.teacherList"
                             :key="val.usrId">
                            <span v-text="val.usrName"></span>
                            <br>
                        </div>
                    </el-form-item>
                    <el-form-item label="上课时间">
                        <div
                                v-for="schedule in course.scheduleList"
                                :key="schedule.schId">
            <span
                    v-text="`星期${dayMap.get(schedule.schDay)} 第${schedule.schStartTime}~${schedule.schEndTime}节`"></span>
                            <br>
                        </div>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="历史签到" name="hisSignIn">
                <el-container>
                    <el-header class="header">
                        <el-form inline>
                            <el-form-item label="上课时间">
                                <el-select
                                        placeholder="上课时间"
                                        value=""
                                        v-model="selectSchIdx">
                                    <el-option
                                            v-for="(val, idx) in historyList"
                                            :key="val.schId"
                                            :label="`星期${dayMap.get(val.schDay)} 第${val.schStartTime}~${val.schEndTime}节`"
                                            :value="idx">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-header>
                    <el-main>
                        <el-table :data="historyList[selectSchIdx] == null ? [] : historyList[selectSchIdx].signInList">
                            <el-table-column label="周" prop="siWeek"></el-table-column>
                            <el-table-column label="状态" prop="signInStatusCode">
                                <template slot-scope="scope">
                                    <span v-text="codeMap.get(scope.row.signInStatusCode)"></span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'CozDialog',
        props: [{
            course: Object,
            dialogVisible: Boolean
        }],
        computed: {
            ...mapState({
                dayMap: 'dayMap'
            })
        },
        data() {
            return {
                codeMap: new Map([[0, '到勤'], [1, '缺勤'], [2, '签到未开始'], [3, '请假未审批'], [4, '请假通过']]),
                selectSchIdx: 0,
                active: 'showCozDtl',
                historyList: []
            }
        },
        watch: {
            course() {
                if (this.course === '' || JSON.stringify(this.course) === '{}') {
                    return
                }
                this.$ajax
                    .get('/student/history', Object.assign({
                        params: {
                            cozId: this.course.cozId
                        }
                    }, this.ajaxConfig))
                    .then(res => {
                        if (res && res.status === 200) {
                            this.historyList = res.data
                            return
                        }
                        this.$message({
                            showClose: true,
                            message: '服务器出了一点问题, 请稍后再试',
                            type: 'error'
                        })
                    })
                    .catch(err => {
                        console.error(err)
                        if (err.response.status === 401) {
                            this.$message({
                                showClose: true,
                                message: '登录过期, 请重新登录',
                                type: 'error'
                            })
                        } else {
                            this.$message({
                                showClose: true,
                                message: '网络发生了一点问题',
                                type: 'error'
                            })
                        }
                    })
            }
        },
        methods: {
            closeDialog() {
                this.active = 'showCozDtl'
                this.$emit('closeDialog')
            }
        }
    }
</script>

<style scoped>
    .course-dtl-form {
        margin: 20px;
    }

    .header {
        border-bottom: #c3d5e2 1px solid;
    }
</style>
