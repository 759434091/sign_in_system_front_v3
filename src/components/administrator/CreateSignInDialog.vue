<template>
    <el-dialog title="发起签到"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-form v-if="null != course" label-width="80px" label-position="right">
            <el-form-item label="上课时间">
                <el-select v-model="ssId">
                    <el-option v-for="val in course.sisScheduleList"
                               :key="val.ssId" :label="`${getScheduleTimeString(val)}`" :value="val.ssId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="createSignIn">
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
                ssId: ''
            }
        },
        methods: {
            closeDialog() {
                this.$emit('closeDialog')
                this.ssId = ''
            },
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            },
            createSignIn() {
                if ('' === this.ssId)
                    return
                this.$request.administrator.createSignIn(this.ssId)
                    .then(res => {
                        if (!res.data.success) {

                            this.$message(res.data.message)
                            return
                        }

                        debugger
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
            }
        }
    }
</script>

<style scoped>

</style>