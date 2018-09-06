<template>
    <el-dialog title="发起签到"
               width="500px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-form v-if="null != course" label-width="80px" label-position="right">
            <el-form-item label="上课时间">
                <el-select v-model="ssId" @handle-select="handleSelect">
                    <el-option v-for="val in course.sisScheduleList"
                               :key="val.ssId" :label="`${getScheduleTimeString(val)}`" :value="val.ssId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地点">
                <span v-text="getLocation"></span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="createSignIn" :loading="loading">
                    确定
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import courseUtils from "@/util/courseUtils";

    export default {
        name: "CreateSignInDialog",
        props: {
            dialogVisible: Boolean,
            course: Object
        },
        data() {
            return {
                ssId: '',
                loading: false,
                schedule: null,
                location: null
            }
        },
        methods: {
            closeDialog() {
                if (this.loading)
                    return false
                this.$emit('closeDialog')
                this.ssId = ''
            },
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            },
            createSignIn() {
                if ('' === this.ssId)
                    return
                if (null == this.location) {
                    this.$message.error("该课程未指定地点或未加载，请重新选择")
                    return
                }
                this.loading = true
                this.$request.administrator.createSignIn(this.ssId)
                    .then(res => {
                        if (!res.data.success) {
                            if (res.data.message)
                                this.$message.error(res.data.message)
                            else
                                this.$message.error('签到已存在')
                            this.loading = false
                            return
                        }

                        this.$message.success('发起成功')
                        this.loading = false
                        this.closeDialog()
                    })
                    .catch(err => {
                        this.loading = false
                        if (!err.response || !err.response.data)
                            return
                        if (!err.response.data.message) {
                            this.$message.error(err.response.data)
                            return
                        }
                        this.$message.error(err.response.data.message)
                    })
            },
            handleSelect() {
                if ('' === this.ssId) {
                    return
                }
                schedule = this.course.sisScheduleList.find(schedule => schedule.ssId === ssId)
                if (null == schedule) {
                    return
                }
                if (null == shcedule.slId) {
                    return
                }

                this.schedule = schedule
                this.$request.getLocation(schedule.slId)
                    .then(res => {
                        if (!res.data.success) {
                            return
                        }

                        this.location = res.data.sisLocation
                    })
                    .catch(() => {
                    })
            },
            getLocation() {
                if (null == this.schedule)
                    return ''
                if (null == this.schedule.slId)
                    return '该课程未指定地点'
                if (null == this.location)
                    return '未加载'
                return this.location.slName
            }
        }
    }
</script>

<style scoped>

</style>