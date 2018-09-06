<template>
    <el-dialog title="发起签到"
               width="500px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-form v-if="null != course" label-width="80px" label-position="right">
            <el-form-item label="上课时间">
                <el-select v-model="ssId" @change="handleSelect">
                    <el-option v-for="val in course.sisScheduleList"
                               :key="val.ssId" :label="`${getScheduleTimeString(val)}`" :value="val.ssId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地点">
                <span v-text="getLocation()"></span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="createSignIn" :loading="loading">
                    确定
                </el-button>
            </el-form-item>
        </el-form>
        <ModifyScheduleLocationDialog :dialogVisible="modifyScheduleLocationDialog.dialogVisible"
                                      :schedule="modifyScheduleLocationDialog.schedule"
                                      @closeDialog="closeModifyScheduleLocationDialog"/>
    </el-dialog>
</template>

<script>
    import courseUtils from '@/util/courseUtils';
    import ModifyScheduleLocationDialog from './ModifyScheduleLocationDialog'

    export default {
        name: "CreateSignInDialog",
        props: {
            dialogVisible: Boolean,
            course: Object
        },
        components: {ModifyScheduleLocationDialog},
        data() {
            return {
                ssId: '',
                loading: false,
                schedule: null,
                location: null,
                modifyScheduleLocationDialog: {
                    dialogVisible: false,
                    schedule: null
                }
            }
        },
        methods: {
            closeDialog() {
                if (this.loading)
                    return false
                this.$emit('closeDialog')
                this.ssId = ''
                this.loading = false
                this.schedule = null
                this.location = null
            },
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            },
            createSignIn() {
                if ('' === this.ssId)
                    return
                if (null == this.schedule.slId) {
                    this.modifyScheduleLocationDialog.dialogVisible = true
                    this.modifyScheduleLocationDialog.schedule = this.schedule
                    return
                }
                if (null == this.location) {
                    this.$message.error("地点加载失败，请重新尝试")
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
            handleSelect(ssId) {
                if ('' === ssId) {
                    return
                }
                const schedule = this.course.sisScheduleList.find(schedule => schedule.ssId === ssId)
                if (null == schedule) {
                    return
                }
                this.schedule = schedule

                if (null == schedule.slId) {
                    return
                }
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
            },
            closeModifyScheduleLocationDialog(slId) {
                debugger
                if (null != slId) {
                    this.loading = true
                    this.$request.administrator.createSignIn(parseInt(slId))
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
                }
                this.modifyScheduleLocationDialog.dialogVisible = false
                this.modifyScheduleLocationDialog.schedule = null
                this.closeDialog()
            }
        }
    }
</script>

<style scoped>

</style>