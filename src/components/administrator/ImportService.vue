<template>
    <el-container>
        <el-main>
            <el-form :model="cozForm">
                <el-form-item>
                    <el-input type="file" v-model="cozForm.cozFile"></el-input>
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
                cozForm: {
                    cozFile: ''
                }
            }
        }
    }
</script>

<style scoped>

</style>