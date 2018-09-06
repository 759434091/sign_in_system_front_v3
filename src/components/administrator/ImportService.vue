<template>
    <el-container>
        <el-main>
            <el-form>
                <el-form-item label="上传">
                    <el-upload
                            ref="cozUpload"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            accept="xls, xlsx"
                            :headers="{}"
                            :drag="true"
                            :multiple="false"
                            :auto-upload="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "ImportService"
    }
</script>

<style scoped>

</style>