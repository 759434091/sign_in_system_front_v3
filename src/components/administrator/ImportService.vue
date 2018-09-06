<template>
    <el-container>
        <el-main>
            <el-progress v-show="cozProgressVisible" :percentage="cozProgress" :status="cozStatus"></el-progress>
            <el-form label-position="right">
                <el-form-item label="上传课程（教学任务列表）">
                    <el-button size="small" type="success" @click="submitCozUpload">
                        上传到服务器
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-upload
                            action=""
                            ref="cozUpload"
                            :drag="true"
                            :file-list="cozFileList"
                            :http-request="uploadCoz"
                            :on-change="handleCozChange"
                            :multiple="false"
                            :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将课程文件拖到此处，或<em>点击上传</em></div>
                        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件, 10MB以内</div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "ImportService",
        data() {
            return {
                cozFileList: [],
                cozKey: null,
                cozProgress: 0,
                cozProgressVisible: false,
                cozUploadTimer: null,
                cozStatus: ''
            }
        },
        methods: {
            submitCozUpload() {
                this.$refs.cozUpload.submit()
            },
            uploadCoz(data) {
                const file = data.file
                const formData = new FormData();
                formData.append('cozInfo', file)
                this.cozProgressVisible = true
                this.$request.administrator.importCozInfo(formData)
                    .then(res => {
                        if (!res.data.success) {
                            this.$message.error(res.data.message)
                            return
                        }

                        this.$message.success('上传成功，正在导入')
                        this.cozKey = res.data.key
                        const _this = this
                        this.cozUploadTimer = setInterval(() => {
                            _this.$request.administrator.getProgress(this.cozKey)
                                .then(res => {
                                    if (!res.data.success) {
                                        _this.$message.error(res.data.message)
                                        _this.cozStatus = 'exception'
                                        clearInterval(_this.cozUploadTimer)
                                        return
                                    }

                                    if (res.data.progress === 100) {
                                        clearInterval(_this.cozUploadTimer)
                                        _this.cozStatus = 'success'
                                        _this.$message.success('导入成功')
                                    }
                                    _this.cozProgress = res.data.progress
                                })
                                .catch(err => {
                                    _this.cozStatus = 'exception'
                                    if (!err.response || !err.response.data)
                                        return
                                    if (!err.response.data.message) {
                                        _this.$message.error(err.response.data)
                                        return
                                    }
                                    _this.$message.error(err.response.data.message)
                                    _this.clearInterval(this.cozUploadTimer)
                                })
                        }, 500)
                    })
                    .catch(err => {
                        this.cozStatus = 'exception'
                        if (!err.response || !err.response.data)
                            return
                        if (!err.response.data.message) {
                            this.$message.error(err.response.data)
                            return
                        }
                        this.$message.error(err.response.data.message)
                    })
            },
            handleCozChange(file) {
                this.cozFileList = []
                this.cozFileList.push(file)
            }
        }
    }
</script>

<style scoped>

</style>