<template>
  <el-dialog title="历史督导"
             :visible.sync="dialogVisible"
             :before-close="closeDialog">
    <el-table :data="suvRecList">
      <el-table-column label="督导周" prop="supervision.suvWeek"
                       :filters="suvRecList.map(suvRec => { return { text: suvRec.supervision.suvWeek, value: suvRec.supervision.suvWeek}})"
                       :filter-method="filterWeekHandler"></el-table-column>
      <el-table-column label="上课时间" prop="supervision.scheduleWithCozDtl"
                       :filters="suvRecList.map(suvRec => {
                                     return {
                                         text: `星期${dayMap.get(suvRec.supervision.scheduleWithCozDtl.schDay)} 第${suvRec.supervision.scheduleWithCozDtl.schStartTime}~${suvRec.supervision.scheduleWithCozDtl.schEndTime}节`,
                                         value: `星期${dayMap.get(suvRec.supervision.scheduleWithCozDtl.schDay)} 第${suvRec.supervision.scheduleWithCozDtl.schStartTime}~${suvRec.supervision.scheduleWithCozDtl.schEndTime}节`
                                     }
                                 })"
                       :filter-method="filterSchHandler">
        <template slot-scope="scope">
          <p class="coz-time"
             v-text="`星期${dayMap.get(scope.row.supervision.scheduleWithCozDtl.schDay)} 第${scope.row.supervision.scheduleWithCozDtl.schStartTime}~${scope.row.supervision.scheduleWithCozDtl.schEndTime}节`"></p>
        </template>
      </el-table-column>
      <el-table-column label="记录人数" prop="suvRecNum"></el-table-column>
      <el-table-column label="问题人数" prop="suvRecBadNum"></el-table-column>
      <el-table-column label="记录人" prop="suvRecName"></el-table-column>
      <el-table-column label="督导备注" prop="suvRecInfo"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" label-width="90" inline size="mini" class="suv-expand-form">
            <el-form-item label="督导号">
              <span>{{ props.row.supervision.suvId }}</span>
            </el-form-item>
            <el-form-item label="督导周">
              <span>{{ props.row.supervision.suvWeek }}</span>
            </el-form-item>
            <el-form-item label="上课时间"
                          :filters="[]"
                          :filter-method="filterHandler">
              <span>{{ `星期${dayMap.get(props.row.supervision.scheduleWithCozDtl.schDay)} 第${props.row.supervision.scheduleWithCozDtl.schStartTime}~${props.row.supervision.scheduleWithCozDtl.schEndTime}节` }}</span>
            </el-form-item>
            <el-form-item label="记录人数">
              <span>{{ props.row.suvRecNum }}</span>
            </el-form-item>
            <el-form-item label="问题人数">
              <span>{{ props.row.suvRecBadNum }}</span>
            </el-form-item>
            <el-form-item label="记录人">
              <span>{{ props.row.suvRecName }}</span>
            </el-form-item>
            <el-form-item label="督导备注">
              <span>{{ props.row.suvRecInfo }}</span>
            </el-form-item>
            <el-form-item label="督导员">
              <span>{{ props.row.supervision.student.usrId + ' ' +  props.row.supervision.student.usrName}}</span>
            </el-form-item>
            <el-form-item label="督导情况">
              <span>{{ props.row.supervision.suvLeave ? '请假' : '正常' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'HistorySuv',
  props: ['dialogVisible', 'course'],
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']]),
      suvRecList: []
    }
  },
  watch: {
    course (newVal) {
      if (JSON.stringify(newVal) === '{}') {
        return
      }
      this.$ajax
        .get('/administrator/course/suv-history', Object.assign({
          params: {
            cozId: newVal.cozId
          }
        }, this.ajaxConfig))
        .then(res => {
          if (res && res.status === 200) {
            this.suvRecList = res.data
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
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    filterWeekHandler (value, row) {
      return value === row.supervision.suvWeek
    },
    filterSchHandler (value, row) {
      return value === `星期${this.dayMap.get(row.supervision.scheduleWithCozDtl.schDay)} 第${row.supervision.scheduleWithCozDtl.schStartTime}~${row.supervision.scheduleWithCozDtl.schEndTime}节`
    }
  }
}
</script>

<style scoped>

</style>
