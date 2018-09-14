<template>
  <el-container>
    <el-header>
      <el-form inline size="mini" class="header">
        <el-form-item label="选择课程">
          <el-select v-model="selectedCozId" value="" @change="changeSelectedScheduleList">
            <el-option
              v-for="val in courseList"
              :key="val.cozId"
              :label="`${val.cozName} (${val.cozId})`"
              :value="val.cozId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课时间">
          <el-select v-model="selectedSchId" value="">
            <el-option
              v-for="val in selectedScheduleList"
              :key="val.schId"
              :label="`星期${dayMap.get(val.schDay)} 第${val.schStartTime}~${val.schEndTime}节`"
              :value="val.schId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="filter">选择</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="selectedSuvList">
        <el-table-column prop="supervision.suvWeek" label="周"></el-table-column>
        <el-table-column prop="supervision.student.usrName" label="督导员"></el-table-column>
        <el-table-column prop="suvRecNum" label="实到人数"></el-table-column>
        <el-table-column prop="suvRecBadNum" label="情况人数"></el-table-column>
        <el-table-column prop="suvRecInfo" label="督导备注"></el-table-column>
        <el-table-column prop="suvRecName" label="实际督导人"></el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'HistorySuv',
  props: ['courseList'],
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']]),
      selectedScheduleList: [],
      selectedCozId: '',
      selectedSchId: '',
      suvList: [],
      selectedSuvList: []
    }
  },
  methods: {
    onSearch () {
      this.$ajax
        .get('/teacher/suv-history', Object.assign({
          params: {
            cozId: this.selectedCozId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            this.suvList = res.data
            return
          }
          this.$message({
            showClose: true,
            message: '服务器暂时出了问题, 请稍后再试',
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
    changeSelectedScheduleList (cozId) {
      this.onSearch()
      for (let i = 0; i < this.courseList.length; i++) {
        if (this.courseList[i].cozId === cozId) {
          this.selectedScheduleList = this.courseList[i].scheduleList
          return
        }
      }
    },
    filter () {
      this.selectedSuvList = this.suvList.filter(suv => suv.supervision.scheduleWithCozDtl.schId === this.selectedSchId)
    }
  }
}
</script>

<style scoped>
  .header {
    border-bottom: #c3d5e2 1px solid;
  }
</style>
