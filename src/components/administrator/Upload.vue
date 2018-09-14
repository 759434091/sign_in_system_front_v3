<template>
  <el-container class="container">
    <el-header height="30px">
      <el-progress v-show="progressShow" :percentage="progressRate" :text-inside="true" :stroke-width="18"
                   :status="progressStatus"></el-progress>
    </el-header>
    <el-main>
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="新增课程" name="newCourse">
          <el-form></el-form>
        </el-tab-pane>
        <el-tab-pane label="新增学生" name="newStudent">
          <el-form></el-form>
        </el-tab-pane>
        <el-tab-pane label="上传文件" name="upload">
          <el-form label-position="top">
            <el-form-item label="上传课程信息">
              <el-upload
                ref="uploadCoz"
                action=""
                :http-request="httpCozUp"
                :headers="ajaxConfig.headers"
                :multiple="false"
                :limit="1"
                :auto-upload="false"
                :file-list="cozFile">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadCoz">上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传xml/xmls文件</div>
              </el-upload>
            </el-form-item>
            <hr style="margin-bottom: 20px">
            <el-form-item label="上传学生信息">
              <el-upload
                ref="uploadStu"
                action=""
                :http-request="httpStuUp"
                :headers="ajaxConfig.headers"
                :multiple="false"
                :limit="1"
                :auto-upload="false"
                :file-list="stuFile">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadStu">上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传xml/xmls文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Upload',
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      activeName: 'upload',
      cozFile: [],
      stuFile: [],
      progressShow: false,
      progressRate: 0,
      progressStatus: ''
    }
  },
  methods: {
    submitUploadCoz () {
      this.$refs.uploadCoz.submit()
    },
    submitUploadStu () {
      this.$refs.uploadStu.submit()
    },
    httpCozUp (cozForm) {
      const formData = new FormData()
      formData.append('cozInfo', cozForm.file)
      this.$ajax
        .put('/administrator/file/coz-info', formData, Object.assign({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.data && res.status) {
            this.progressShow = true
            const vm = this
            const taskKey = res.data.taskKey
            const id = setInterval(() => {
              vm.$ajax
                .get('/administrator/file/coz-info', Object.assign({
                  params: {
                    taskKey: taskKey
                  }
                }, this.ajaxConfig))
                .then(res => {
                  if (res && res.status === 200) {
                    if (!res.data.status) {
                      vm.progressStatus = 'exception'
                      clearInterval(id)
                      return
                    }

                    if (res.data.progress === 100) {
                      vm.progressRate = res.data.progress
                      vm.progressStatus = 'success'
                      clearInterval(id)
                      return
                    }

                    vm.progressRate = res.data.progress
                  }
                })
                .catch(err => {
                  console.error(err)
                  if (err.response.status === 401) {
                    vm.$message({
                      showClose: true,
                      message: '登录过期, 请重新登录',
                      type: 'error'
                    })
                  } else {
                    vm.$message({
                      showClose: true,
                      message: '网络发生了一点问题',
                      type: 'error'
                    })
                  }
                })
            }, 200)
          }
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
    httpStuUp (stuForm) {
      const formData = new FormData()
      formData.append('stuInfo', stuForm.file)
      this.$ajax
        .put('/administrator/file/stu-info', formData, Object.assign({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.data && res.status) {
            this.progressShow = true
            const vm = this
            const taskKey = res.data.taskKey
            const id = setInterval(() => {
              vm.$ajax
                .get('/administrator/file/stu-info', Object.assign({
                  params: {
                    taskKey: taskKey
                  }
                }, this.ajaxConfig))
                .then(res => {
                  if (res && res.status === 200) {
                    if (!res.data.status) {
                      vm.progressStatus = 'exception'
                      vm.progressRate = 100
                      clearInterval(id)
                      return
                    }

                    if (res.data.progress === 100) {
                      vm.progressRate = res.data.progress
                      vm.progressStatus = 'success'
                      clearInterval(id)
                      return
                    }

                    vm.progressRate = res.data.progress
                  }
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
            }, 200)
          }
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
    }
  }
}
</script>

<style scoped>
  .container {
    margin: 40px;
  }

  .tabs {
    width: 70%;
  }
</style>
