<template>
    <el-dialog title="联系我们"
               :visible="visible"
               width="600px"
               :before-close="closeDialog">
        <el-container>
            <el-main>
                <el-form :model="form" label-width="80px" label-position="right">
                    <el-form-item label="称呼">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式">
                        <el-input v-model="form.contact"></el-input>
                    </el-form-item>
                    <el-form-item label="内容">
                        <el-input type="textarea" v-model="form.content"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="closeDialog">
                            返回
                        </el-button>
                        <el-button type="primary">
                            提交
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </el-dialog>
</template>

<script>
    export default {
        name: "ContactDialog",
        props: {
            visible: Boolean
        },
        data() {
            return {
                form: {
                    name: '',
                    contact: '',
                    content: ''
                }
            }
        },
        methods: {
            closeDialog() {
                this.$emit('closeDialog')
            }
        }
    }
</script>

<style scoped>

</style>