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
                <el-table-column label="督导状态">
                    <template slot-scope="scope">
                        <span v-text="getCourseMonitorStatus(scope.row)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="到勤率" prop="scAttRate">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary" size="mini">
                                课程管理<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <!--todo 停课周 学生统计-->
                                <el-dropdown-item @click.native="showCourse(scope.row)">
                                    课程信息
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="showStudents(scope.row.sisJoinCourseList)">
                                    学生信息
                                </el-dropdown-item>
                                <el-dropdown-item @click.native="showSupervision(scope.row.scId)">
                                    历史督导
                                </el-dropdown-item>
                                <!--
                                                                <el-dropdown-item @click.native="">查看历史签到</el-dropdown-item>
                                                                <el-dropdown-item @click.native="" divided>管理督导</el-dropdown-item>
                                                                <el-dropdown-item @click.native="">签到设置</el-dropdown-item>
                                -->
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
    </el-container>
</template>

<script>
    import courseUtils from '@/util/courseUtils'
    import StudentDialog from "./StudentDialog";
    import CourseDialog from "./CourseDialog";
    import SupervisionsDialog from "./SupervisionsDialog";

    export default {
        name: "CourseManage",
        components: {SupervisionsDialog, StudentDialog, CourseDialog},
        data() {
            return {
                hasMonitor: null,
                needMonitor: null,
                page: 1,
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
                }
            }
        },
        created() {
            this.$request.administrator
                .getCourse(this.hasMonitor, this.needMonitor, this.page)
                .then(res => {
                    if (!res.data.success) {
                        this.$message.error(res.data.message)
                        return
                    }

                    const pageIntro = res.data.data
                    this.page = pageIntro.pageNum
                    this.courseList = pageIntro.list
                })
                .catch(err => {
                    console.error(err)
                    this.$message.error(err)
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
            }
        }
    }
</script>

<style scoped>

</style>