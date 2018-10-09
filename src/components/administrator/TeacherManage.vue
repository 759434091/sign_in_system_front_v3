<template>
    <el-container>
        <el-header>
            <el-form :inline="true" size="mini" :model="selectForm">
                <el-form-item label="学号">
                    <el-input v-model="selectForm.suId"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="selectForm.suName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch" :loading="loading" :disabled="loading">
                        搜索
                    </el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-table v-loading="loading" :data="teacherList">
                <el-table-column label="学号" prop="suId"></el-table-column>
                <el-table-column label="姓名" prop="suName"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" @click="showTchCozHistory(scope.row.suId)">
                            查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination
                    class="coz-manage-pagination"
                    @size-change="handleSizeChange"
                    @current-change="getPage"
                    :current-page.sync="pagination.currentPage"
                    :page-size="pagination.size"
                    :page-sizes="[10, 30, 50, 100, 200]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
            </el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "TeacherManage",
        data() {
            return {
                loading: false,
                selectForm: {
                    suId: '',
                    suName: ''
                },
                teacherList: [],
                pagination: {
                    currentPage: 1,
                    total: 0,
                    size: 10
                },
            }
        },
        created() {
            this.onSearch();
        },
        methods: {
            showTchCozHistory(suId) {

            },
            handleSizeChange(size) {
                this.pagination.size = size
                this.onSearch()
            },
            onSearch() {
                this.pagination.currentPage = 1
                this.getPage()
            },
            getPage() {
                this.loading = true
                this.$request.administrator
                    .getTeachers(this.pagination.currentPage, this.pagination.size, this.selectForm.suId, this.selectForm.suName)
                    .then(res => {
                        const pageIntro = res.data
                        this.pagination.currentPage = pageIntro.pageNum
                        this.pagination.total = pageIntro.total
                        this.teacherList = pageIntro.list
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