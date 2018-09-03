<template>
    <el-container>
        <el-header>
            <el-form class="coz-manage-form" :inline="true" size="mini" :model="selectForm">
                <el-form-item label="年级">
                    <el-select placeholder="年级" v-model="selectForm.scGrade">
                        <el-option label="不指定" value=""></el-option>
                        <el-option label="2016" value="2016"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学院">
                    <el-select placeholder="学院" v-model="selectForm.sdId"
                               :filterable="true" :remote="true"
                               @focus="remoteMethod(selectForm.sdId)"
                               :remote-method="remoteMethod" :loading="selectForm.sdLoading">
                        <el-option label="不指定" value=""></el-option>
                        <el-option v-for="val in selectForm.departmentList"
                                   :key="val.sdId"
                                   :label="val.sdName"
                                   :value="val.sdId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程序号">
                    <el-input v-model="selectForm.scId"></el-input>
                </el-form-item>
                <el-form-item label="课程名字">
                    <el-input v-model="selectForm.scName"></el-input>
                </el-form-item>
                <el-form-item class="coz-manage-form-remember" label="记住">
                    <el-checkbox v-model="selectForm.remember"></el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">
                        确定
                    </el-button>
                </el-form-item>
                <el-form-item label="丨">
                    <el-dropdown>
                        <el-button type="info">
                            批量督导<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="batchSupervisions(true)">
                                发起督导
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="batchSupervisions(false)">
                                取消督导
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </el-header>
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
                                <el-dropdown-item
                                        @click.native="modifyScNeedMonitor(scope.row.scId, !scope.row.scNeedMonitor)"
                                        :divided="true"
                                        v-text="scope.row.scNeedMonitor?'取消督导':'发起督导'"></el-dropdown-item>
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
        <el-footer>
            <el-pagination
                    class="coz-manage-pagination"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pagination.currentPage"
                    :page-size="pagination.size"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.total">
            </el-pagination>
        </el-footer>
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
                selectForm: {
                    remember: false,
                    scGrade: '',
                    sdLoading: false,
                    sdId: '',
                    scName: '',
                    departmentList: []
                },
                pagination: {
                    currentPage: 1,
                    total: 0,
                    size: 10
                },
                hasMonitor: null,
                needMonitor: null,
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
            const rememberForm = JSON.parse(localStorage.getItem('cozManagerForm'))
            if (rememberForm)
                this.selectForm = rememberForm
            this.handleCurrentChange(1)
        },
        methods: {
            remoteMethod(val) {
                this.selectForm.sdLoading = true
                this.$request.administrator
                    .getDepartments(val)
                    .then(res => {
                        if (!res.data.success) {
                            this.$message.error(res.data.message)
                            return
                        }

                        this.selectForm.departmentList = res.data.sisDepartmentList
                    })
                    .catch(err => {
                        console.error(err)
                        this.$message.error(err.response.data.message)
                    })
                    .finally(() => {
                        this.selectForm.sdLoading = false
                    })
            },
            onSearch() {
                if (this.selectForm.remember)
                    localStorage.setItem('cozManagerForm', JSON.stringify(this.selectForm))
                this.handleCurrentChange(1)
            },
            handleCurrentChange(curPage) {
                this.$request.administrator
                    .getCourse(
                        this.hasMonitor,
                        this.needMonitor,
                        curPage,
                        '' === this.selectForm.sdId ? null : this.selectForm.sdId,
                        '' === this.selectForm.scGrade ? null : this.selectForm.scGrade,
                        '' === this.selectForm.scName ? null : this.selectForm.scName
                    )
                    .then(res => {
                        if (!res.data.success) {
                            this.$message.error(res.data.message)
                            return
                        }

                        const pageIntro = res.data.data
                        this.pagination.currentPage = pageIntro.pageNum
                        this.pagination.total = pageIntro.total
                        this.courseList = pageIntro.list
                    })
                    .catch(err => {
                        console.error(err)
                        this.$message.error(err.response.data.message)
                    })
            },
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
            },
            modifyScNeedMonitor(scId, status) {
                this.$confirm(`将对课程 ${scId} ${status ? '发起督导' : '取消督导'}，请确认`, status ? '发起督导' : '取消督导',)
                    .then(() => {
                        this.$request.administrator.modifyScNeedMonitor(scId, status)
                            .then(res => {
                                if (!res.data.success) {
                                    this.$message.error(res.data.message)
                                    return
                                }

                                this.$message.success('操作成功')
                                this.handleCurrentChange(this.pagination.currentPage)
                            })
                            .catch(err => {
                                console.log(err)
                                this.$message.error(err.response.data.message)
                            })
                    })
                    .catch(() => {
                    })
            },
            batchSupervisions(status) {
                this
                    .$confirm(`将会对搜索结果${status ? '发起督导' : '取消督导'}，总${this.pagination.total}条，请认真检查`, '发起督导')
                    .then(() => {
                        //todo batch suv
                    })
                    .catch(() => {
                    })
            }
        }
    }
</script>

<style>
    .coz-manage-pagination {
        float: right;
    }

    .coz-manage-form .el-form-item__content {
        width: 100px;
    }

    .coz-manage-form-remember .el-form-item__content {
        width: 20px;
    }
</style>