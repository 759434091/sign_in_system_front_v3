<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex">
        <el-col class="form-col" :span="12">
          <el-form size="mini" :inline="true" :model="searchForm">
            <el-form-item label="学号">
              <el-input placeholder="学号" v-model="searchForm.usrId"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input placeholder="姓名" v-model="searchForm.usrName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleSearch">模糊查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog('grant')" size="mini">新增督导员</el-button>
          <el-button type="danger" @click="showDialog('revoke')" size="mini">取消督导员</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="students" height="700">
        <el-table-column
          prop="usrId"
          label="学号">
        </el-table-column>
        <el-table-column
          prop="usrName"
          label="姓名">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">
              查看课表
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog title="督导员管理"
               class="suv-manage-dialog"
               :visible.sync="dialogVisible"
               :before-close="closeDialog">
      <el-form>
        <el-form-item :label="dialogMsg">
          <el-col :span="10">
            <el-input v-model="dialogUsrId" placeholder="请输入学号"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'SuvManage',
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      typeMsgMap: new Map([['grant', '新增督导员'], ['revoke', '取消督导员']]),
      searchForm: {
        usrId: '',
        usrName: ''
      },
      baseStudents: [],
      students: [],
      dialogVisible: false,
      dialogType: '',
      dialogMsg: '',
      dialogUsrId: ''
    }
  },
  created () {
    this.$ajax
      .get('/administrator/suv-manage/supervisors', this.ajaxConfig)
      .then(res => {
        if (res && res.data) {
          this.students = this.baseStudents = res.data
          return
        }

        alert('服务器暂时出了问题, 请稍后再试')
      })
      .catch(err => {
        console.error(err)
        if (err.response.status === 401) {
          this.$message({
            showClose: true,
            message: '登录过期, 请重新登录',
            type: 'error'
          })
        } else {
          this.$message({
            showClose: true,
            message: '网络发生了一点问题',
            type: 'error'
          })
        }
      })
  },
  methods: {
    handleSearch () {
      this.students = this.baseStudents.filter((currentValue) => {
        return currentValue.usrId.includes(this.searchForm.usrId) && currentValue.usrName.includes(this.searchForm.usrName)
      })
    },
    showDialog (typeStr) {
      this.dialogType = typeStr
      this.dialogUsrId = ''
      this.dialogMsg = this.typeMsgMap.get(typeStr)
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
      this.dialogUsrId = ''
      this.dialogMsg = ''
      this.dialogType = ''
    },
    onSubmit () {
      switch (this.dialogType) {
        case 'grant':
          this.$ajax
            .put('/administrator/suv-manage/supervisors', {usrId: this.dialogUsrId}, this.ajaxConfig)
            .then(res => {
              if (res && res.data && res.data.status) {
                this.$message({
                  showClose: true,
                  message: '授予成功',
                  type: 'success'
                })
                this.$ajax
                  .get('/administrator/suv-manage/supervisors', this.ajaxConfig)
                  .then(res => {
                    if (res && res.data) {
                      this.students = this.baseStudents = res.data
                      return
                    }

                    this.$message({
                      showClose: true,
                      message: '服务器出了一点问题, 请稍后再试',
                      type: 'error'
                    })
                  })
                  .catch(err => {
                    console.error(err)
                    if (err.response.status === 401) {
                      this.$message({
                        showClose: true,
                        message: '登录过期, 请重新登录',
                        type: 'error'
                      })
                    } else {
                      this.$message({
                        showClose: true,
                        message: '网络发生了一点问题',
                        type: 'error'
                      })
                    }
                  })
                this.closeDialog()
                return
              }

              this.$message({
                showClose: true,
                message: '服务器出了一点问题, 请稍后再试',
                type: 'error'
              })
            })
            .catch(err => {
              console.error(err)
              if (err.response.status === 401) {
                this.$message({
                  showClose: true,
                  message: '登录过期, 请重新登录',
                  type: 'error'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '网络发生了一点问题',
                  type: 'error'
                })
              }
            })
          break
        case 'revoke':
          this.$ajax({
            method: 'delete',
            url: '/administrator/suv-manage/supervisors',
            data: {usrId: this.dialogUsrId},
            headers: this.ajaxConfig.headers
          })
            .then(res => {
              if (res && res.data && res.data.status) {
                this.$message({
                  showClose: true,
                  message: '成功取消! ',
                  type: 'success'
                })
                this.$ajax
                  .get('/administrator/suv-manage/supervisors', this.ajaxConfig)
                  .then(res => {
                    if (res && res.data) {
                      this.students = this.baseStudents = res.data
                      return
                    }

                    this.$message({
                      showClose: true,
                      message: '服务器出了一点问题, 请稍后再试',
                      type: 'error'
                    })
                  })
                  .catch(err => {
                    console.error(err)
                    if (err.response.status === 401) {
                      this.$message({
                        showClose: true,
                        message: '登录过期, 请重新登录',
                        type: 'error'
                      })
                    } else {
                      this.$message({
                        showClose: true,
                        message: '网络发生了一点问题',
                        type: 'error'
                      })
                    }
                  })
                this.closeDialog()
                return
              }

              this.$message({
                showClose: true,
                message: '服务器出了一点问题, 请稍后再试',
                type: 'error'
              })
            })
            .catch(err => {
              console.error(err)
              if (err.response.status === 401) {
                this.$message({
                  showClose: true,
                  message: '登录过期, 请重新登录',
                  type: 'error'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '网络发生了一点问题',
                  type: 'error'
                })
              }
            })
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
  .header {
    border-bottom: #c3d5e2 1px solid;
  }

  .form-col {
    height: 30px;
    border-right: #c3d5e2 1px solid;
    margin-right: 30px;
  }
</style>
