<template>
    <el-dialog title="修改地点"
               width="500px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible="dialogVisible"
               :before-close="closeDialog">
        <el-form :model="locationForm" v-loading="loading">
            <el-form-item label="地点名">
                <el-input v-model="locationForm.slName"></el-input>
            </el-form-item>
            <el-form-item label="经度">
                <el-input v-model="locationForm.slLong"></el-input>
            </el-form-item>
            <el-form-item label="纬度">
                <el-input v-model="locationForm.slLat"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doModify">
                    确定
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "ModifyLocationDialog",
        props: {
            dialogVisible: Boolean,
            slId: String
        },
        watch: {
            slId() {
                if (null == this.slId || '' === this.slId)
                    return
                this.loading = true
                this.$request.getLocation(this.slId)
                    .then(res => {
                        if (!res.data.success) {
                            this.$message.error(res.data.message)
                            return
                        }

                        this.locationForm.slName = res.data.sisLocation.slName
                        this.locationForm.slLong = res.data.sisLocation.slLong
                        this.locationForm.slLat = res.data.sisLocation.slLat
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
            }
        },
        data() {
            return {
                loading: false,
                locationForm: {
                    slName: '',
                    slLong: '',
                    slLat: ''
                }
            }
        },
        methods: {
            closeDialog() {
                this.loading = false
                this.locationForm.slName = ''
                this.locationForm.slLong = ''
                this.locationForm.slLat = ''
                this.$emit('closeDialog')
            },
            doModify() {
                this.loading = true
                this.$request.administrator.modifyLocation(this.slId, this.locationForm)
                    .then(res => {
                        if (!res.data.success) {
                            this.$message.error("提交失败")
                            return
                        }

                        this.$message.success("操作成功")
                        this.closeDialog()
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
            }
        }
    }
</script>

<style scoped>

</style>
