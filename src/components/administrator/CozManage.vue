<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="showBatchSuvDialog">批量发起督导</el-button>
        </el-col>
        <el-col :span="20">
          <el-row>
            <el-form :inline="true" label-position="right" size="mini">
              <el-row type="flex" justify="end">
                <el-form-item label="年级">
                  <el-select v-model="grade" placeholder="年级" value="">
                    <el-option label="不指定" value=""></el-option>
                    <el-option v-for="grade in gradeList" :key="grade" :value="grade"
                               :label="grade === new Date().getFullYear()? grade+ '(今年)' : grade"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学院名">
                  <el-autocomplete v-model="depName"
                                   placeholder="不指定"
                                   :trigger-on-focus="true"
                                   :fetch-suggestions="searchDepart">
                  </el-autocomplete>
                </el-form-item>
                <el-form-item label="课程名">
                  <el-input v-model="cozName" placeholder="不指定"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="onSearch">模糊搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="info" size="mini" @click="cleanSort">恢复默认排序</el-button>
                </el-form-item>
              </el-row>
            </el-form>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="courses" height="650"
                @sort-change="changeSort"
                @selection-change="selectChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column
          prop="cozId" label="课程序号">
        </el-table-column>
        <el-table-column
          prop="cozName"
          label="课程名字"
          sortable="custom">
        </el-table-column>
        <el-table-column
          label="任课老师">
          <template slot-scope="scope">
            <p style="margin: 0"
               v-for="user in scope.row.teacherList"
               :key="user.usrId"
               v-text="user.usrName">
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="上课时间">
          <template slot-scope="scope">
            <p class="coz-time"
               v-for="schedule in scope.row.scheduleList"
               :key="schedule.schId"
               v-text="`星期${dayMap.get(schedule.schDay)} 第${schedule.schStartTime}~${schedule.schEndTime}节`"></p>
          </template>
        </el-table-column>
        <el-table-column
          label="课程人数"
          prop="cozActSize"
          sortable="custom">
          <template slot-scope="scope">
            <span v-text="`${scope.row.cozActSize}人`"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="到勤率"
          prop="cozAttRate"
          sortable="custom">
          <template slot-scope="scope">
            <span v-text="`${scope.row.cozAttRate != null ? scope.row.cozAttRate * 100 : 0}%`"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary" size="mini">
                课程管理<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="showCozStuDialog(scope.row)">查看学生</el-dropdown-item>
                <el-dropdown-item @click.native="showHisSuvDialog(scope.row)">查看历史督导</el-dropdown-item>
                <el-dropdown-item @click.native="showHisSignDialog(scope.row)">查看历史签到</el-dropdown-item>
                <el-dropdown-item @click.native="showSetSuvDialog(scope.row)" divided>发起督导</el-dropdown-item>
                <el-dropdown-item @click.native="showSignInDialog(scope.row)">签到设置</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-row type="flex" justify="end">
        <el-pagination
          background
          layout="sizes,prev, pager, next"
          :current-page="page"
          :total="count"
          :page-sizes="[8, 15, 30, 50]"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="changePage"
          @prev-click="changePage"
          @next-click="changePage">
        </el-pagination>
      </el-row>
    </el-footer>
    <BatchSupervision :courseList="selectCourseList" @closeDialog="closeDialog" :dialogVisible="dialogVisible.batchSuvDialogVisible"/>
    <CozStuDialog :course="course" @closeDialog="closeDialog" :dialogVisible="dialogVisible.cozStuDialogVisible"/>
    <SetSuvDialog :course="course" @closeDialog="closeDialog" :dialogVisible="dialogVisible.setSuvDialogVisible"/>
    <SignInDialog :course="course" @closeDialog="closeDialog" :dialogVisible="dialogVisible.signInDialogVisible"/>
    <HistorySuv :course="course" @closeDialog="closeDialog" :dialogVisible="dialogVisible.hisSuvDialogVisible"/>
    <HistorySignIn :course="course" @closeDialog="closeDialog" :dialogVisible="dialogVisible.hisSignDialogVisible"/>
  </el-container>
</template>

<script>
import SetSuvDialog from './CozManage/SetSuvDialog'
import CozStuDialog from './CozManage/CozStuDialog'
import SignInDialog from './CozManage/SignInDialog'
import HistorySuv from './CozManage/HistorySuv'
import HistorySignIn from './CozManage/HistorySignIn'
import BatchSupervision from './CozManage/BatchSupervision'

export default {
  name: 'CozManage',
  components: {BatchSupervision, HistorySignIn, HistorySuv, SignInDialog, CozStuDialog, SetSuvDialog},
  computed: {
    user () {
      return this.$store.state.user
    },
    curWeek () {
      return this.$store.state.week
    },
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      courses: [],
      course: {},
      selectCourseList: [],
      gradeList: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']]),
      ascMap: new Map([['descending', false], ['ascending', true]]),
      dialogVisible: {
        batchSuvDialogVisible: false,
        setSuvDialogVisible: false,
        cozStuDialogVisible: false,
        signInDialogVisible: false,
        hisSuvDialogVisible: false,
        hisSignDialogVisible: false
      },
      cozName: '',
      pageSize: 8,
      page: 1,
      sortStr: '',
      isAsc: true,
      count: 0,
      depName: '',
      grade: ''
    }
  },
  created () {
    const sessionSetting = JSON.parse(localStorage.getItem(`${this.user.usrId}_admin_setting`))
    if (sessionSetting != null) {
      this.cozName = sessionSetting.cozName
      this.grade = sessionSetting.grade
      this.depName = sessionSetting.depName
    }
    this.onSearch()
  },
  beforeDestroy () {
    localStorage.setItem(`${this.user.usrId}_admin_setting`, JSON.stringify({
      cozName: this.cozName,
      grade: this.grade,
      depName: this.depName
    }))
  },
  watch: {
    sortStr () {
      this.onSearch()
    },
    isAsc () {
      this.onSearch()
    }
  },
  methods: {
    selectChange (seleted) {
      this.selectCourseList = seleted
    },
    onSearch () {
      this.$ajax
        .get('/administrator/course/count', Object.assign({
          params: {
            cozName: this.cozName,
            grade: this.grade,
            depName: this.depName
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.data && res.status === 200) {
            this.count = res.data.count
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

      this.$ajax
        .get('/administrator/course/courses', Object.assign({
          params: {
            cozName: this.cozName,
            page: this.page,
            sortStr: this.sortStr,
            pageSize: this.pageSize,
            isAsc: this.isAsc,
            grade: this.grade,
            depName: this.depName
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.data && res.status === 200) {
            this.courses = res.data
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
    },
    cleanSort () {
      this.page = 1
      this.sortStr = ''
      this.isAsc = true
      for (let th of document.getElementsByClassName('el-table__header-wrapper')[0].getElementsByTagName('table')[0].getElementsByTagName('th')) {
        th.classList.remove('ascending')
        th.classList.remove('descending')
      }
    },
    changePage (page) {
      this.page = page
      this.onSearch()
    },
    changeSort (sortParam) {
      this.isAsc = this.ascMap.get(sortParam.order)
      this.sortStr = sortParam.prop
      this.page = 1
    },
    searchDepart (queryString, callback) {
      this.$ajax
        .get('/administrator/department', Object.assign({
          params: {
            depStr: queryString
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            callback(res.data)
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
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.onSearch()
    },
    closeDialog () {
      this.course = {}
      this.dialogVisible = {
        batchSuvDialogVisible: false,
        setSuvDialogVisible: false,
        cozStuDialogVisible: false,
        signInDialogVisible: false,
        hisSuvDialogVisible: false,
        hisSignDialogVisible: false
      }
    },
    showCozStuDialog (course) {
      this.course = course
      this.dialogVisible.cozStuDialogVisible = true
    },
    showSetSuvDialog (course) {
      this.course = course
      this.dialogVisible.setSuvDialogVisible = true
    },
    showSignInDialog (course) {
      this.course = course
      this.dialogVisible.signInDialogVisible = true
    },
    showHisSuvDialog (course) {
      this.course = course
      this.dialogVisible.hisSuvDialogVisible = true
    },
    showHisSignDialog (course) {
      this.course = course
      this.dialogVisible.hisSignDialogVisible = true
    },
    showBatchSuvDialog () {
      this.dialogVisible.batchSuvDialogVisible = true
    }
  }
}
</script>

<style scoped>
  .header {
    border-bottom: #c3d5e2 1px solid;
  }

  .coz-time {
    margin: 0;
  }
</style>
