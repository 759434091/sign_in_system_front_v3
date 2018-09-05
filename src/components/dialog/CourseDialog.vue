<template>
    <el-dialog title="课程信息"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-form size="mini" v-if="null != course" label-width="80px" label-position="right">
            <el-form-item label="年级">
                <span v-text="course.scGrade"></span>
            </el-form-item>
            <el-form-item label="课程序号">
                <span v-text="course.scId"></span>
            </el-form-item>
            <el-form-item label="课程名字">
                <span v-text="course.scName"></span>
            </el-form-item>
            <el-form-item label="任课老师">
                <span v-for="val in getTeacherList(course.sisJoinCourseList)"
                      :key="val.suId" v-text="`${val.suName} ${val.suId}`">
                </span>
            </el-form-item>
            <el-form-item label="上课时间">
                <span v-for="val in course.sisScheduleList"
                      :key="val.ssId" v-text="`${getScheduleTimeString(val)}; `">
                </span>
            </el-form-item>
            <el-form-item label="督导状态">
                <span v-text="getCourseMonitorStatus(course)"></span>
            </el-form-item>
            <el-form-item label="督导人" v-if="null != course.suId">
                <span v-text="`${course.monitor.suId} ${course.monitor.suName}`"></span>
            </el-form-item>
            <el-form-item label="实际人数">
                <span v-text="course.scActSize"></span>
            </el-form-item>
            <el-form-item label="理论人数">
                <span v-text="course.scMaxSize"></span>
            </el-form-item>
            <el-form-item label="到勤率">
                <span v-text="course.scAttRate"></span>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import courseUtils from "@/util/courseUtils";

    export default {
        name: "ShowCourseDialog",
        props: {
            dialogVisible: Boolean,
            course: Object
        },
        data() {
            return {}
        },
        methods: {
            closeDialog() {
                this.$emit('closeDialog')
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
            }
        }
    }
</script>

<style scoped>

</style>