<template>
    <el-dialog title="课程信息"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-container>
            <el-header>
                <el-form :inline="true">
                    <el-form-item label="上课时间">
                        <el-select placeholder="上课时间" v-model="ssId">
                            <el-option v-for="val in scheduleList"
                                       :key="val.ssId"
                                       :label="getScheduleTimeString(val)"
                                       :value="val.ssId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main>
                <el-table :data="sisSupervisionList">
                    <el-table-column label="督导周" prop="ssvWeek"></el-table-column>
                    <el-table-column label="实际人数" prop="ssvActualNum"></el-table-column>
                    <el-table-column label="玩手机人数" prop="ssvMobileNum"></el-table-column>
                    <el-table-column label="睡觉人数" prop="ssvSleepNum"></el-table-column>
                    <el-table-column label="督导备注" prop="ssvRecInfo"></el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </el-dialog>
</template>

<script>
    import ElSelectDropdown from "element-ui/packages/select/src/select-dropdown";
    import courseUtils from "@/util/courseUtils";

    export default {
        name: "SupervisionsDialog",
        components: {ElSelectDropdown},
        props: {
            scId: String,
            dialogVisible: Boolean
        },
        data() {
            return {
                ssId: 0,
                sisSupervisionList: null,
                scheduleList: []
            }
        },
        watch: {
            ssId() {
                if (0 === this.ssId)
                    return
                this.sisSupervisionList = this.scheduleList
                    .find(schedule => schedule.ssId === this.ssId)
                    .sisSupervisionList
            },
            scId() {
                if ('' === this.scId) {
                    return
                }

                this.$request.administrator
                    .getSupervision(this.scId)
                    .then(res => {
                        if (!res.data.success) {
                            this.$message.error(res.data.message)
                            return
                        }

                        this.scheduleList = res.data.array
                        if (this.scheduleList.length > 0) {
                            this.ssId = this.scheduleList[0].ssId
                        }
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
        },
        methods: {
            closeDialog() {
                this.$emit('closeDialog')
            },
            getScheduleTimeString(schedule) {
                return courseUtils.getScheduleTimeString(schedule)
            }
        }
    }
</script>

<style scoped>

</style>