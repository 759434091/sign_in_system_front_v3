<template>
    <el-container>
        <el-main>
            <el-table :data="courseList">
                <el-table-column prop="scId" label="课程序号"/>
                <el-table-column prop="scName" label="课程名字"/>
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
                <el-table-column label="督导状态" width="80">
                    <template slot-scope="scope">
                        <span v-text="getCourseMonitorStatus(scope.row)"></span>
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
                        <el-dropdown>
                            <el-button type="primary" size="mini">
                                课程管理<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="showCourse(scope.row)">
                                    课程信息
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="showStudents(scope.row.sisJoinCourseList)">
                                    学生信息
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="showSupervision(scope.row.scId)">
                                    历史督导
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="showCreateSignIn(scope.row)" :divided="true">
                                    发起签到
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <CourseDialog :dialogVisible="courseDialog.dialogVisible"
                      :course="courseDialog.course"
                      @closeDialog="closeCourse"/>
        <StudentDialog :dialogVisible="studentsDialog.dialogVisible"
                       :userList="studentsDialog.userList"
                       @closeDialog="closeStudents"/>
        <SupervisionsDialog :dialogVisible="supervisionsDialog.dialogVisible"
                            :scId="supervisionsDialog.scId"
                            @closeDialog="closeSupervision"/>
        <CreateSignInDialog :dialogVisible="createSignInDialog.dialogVisible"
                            :course="createSignInDialog.course"
                            @closeDialog="closeCreateSignInDialog"/>
    </el-container>
</template>

<script>
    import courseUtils from '@/util/courseUtils'
    import StudentDialog from "@/components/dialog/StudentDialog";
    import CourseDialog from "@/components/dialog/CourseDialog";
    import SupervisionsDialog from "@/components/dialog/SupervisionsDialog";
    import CreateSignInDialog from "@/components/dialog/CreateSignInDialog";

    export default {
        name: "CourseTable",
        data() {
            return {
                courseList: [],
                courseDialog: {
                    dialogVisible: false,
                    course: null
                },
                studentsDialog: {
                    dialogVisible: false,
                    userList: []
                },
                supervisionsDialog: {
                    dialogVisible: false,
                    scId: ''
                },
                createSignInDialog: {
                    dialogVisible: false,
                    course: null
                },
            }
        },
        components: {CreateSignInDialog, SupervisionsDialog, StudentDialog, CourseDialog},
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
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            },
            getCourseMonitorStatus(course) {
                return courseUtils.getCourseMonitorStatus(course)
            },
            getTeacherList(joinCourseList) {
                return joinCourseList
                    .filter(joinCourse => joinCourse.joinCourseType === 1)
                    .map(joinCourse => joinCourse.sisUser)
            },
            showCreateSignIn(course) {
                this.createSignInDialog.course = course
                this.createSignInDialog.dialogVisible = true
            },
            closeCreateSignInDialog() {
                this.createSignInDialog.course = null
                this.createSignInDialog.dialogVisible = false
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
            showCourse(course) {
                this.courseDialog.course = course
                this.courseDialog.dialogVisible = true
            },
            closeCourse() {
                this.courseDialog.course = null
                this.courseDialog.dialogVisible = false
            },
            showStudents(joinCourseList) {
                this.studentsDialog.userList = joinCourseList
                    .filter(joinCourse => joinCourse.joinCourseType === 0)
                    .map(joinCourse => joinCourse.sisUser)
                this.studentsDialog.dialogVisible = true
            },
            closeStudents() {
                this.studentsDialog.userList = []
                this.studentsDialog.dialogVisible = false
            },
            showSupervision(scId) {
                this.supervisionsDialog.scId = scId
                this.supervisionsDialog.dialogVisible = true
            },
            closeSupervision() {
                this.supervisionsDialog.scId = ''
                this.supervisionsDialog.dialogVisible = false
            },
        }
    }
</script>

<style scoped>

</style>