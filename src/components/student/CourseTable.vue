<template>
  <el-container>
    <el-header></el-header>
    <el-main>
      <el-table ref="courseTable"
                class="course-table"
                border
                :span-method="spanMethod"
                :data="tableData"
                :cell-style="cellStyle"
                @cell-click="showCozDtl">
        <el-table-column prop="period" label="#">
          <template slot-scope="scope">
            <span class="course-title" v-text="scope.row.period"></span>
          </template>
        </el-table-column>
        <el-table-column prop="mon" label="星期一">
          <template slot-scope="scope">
            <span class="course-title" v-text="scope.row.mon.cozName"></span>
          </template>
        </el-table-column>
        <el-table-column prop="tue" label="星期二">
          <template slot-scope="scope">
            <span class="course-title" v-text="scope.row.tue.cozName"></span>
          </template>
        </el-table-column>
        <el-table-column prop="wed" label="星期三">
          <template slot-scope="scope">
            <span class="course-title" v-text="scope.row.wed.cozName"></span>
          </template>
        </el-table-column>
        <el-table-column prop="thu" label="星期四">
          <template slot-scope="scope">
            <span class="course-title" v-text="scope.row.thu.cozName"></span>
          </template>
        </el-table-column>
        <el-table-column prop="fri" label="星期五">
          <template slot-scope="scope">
            <span class="course-title" v-text="scope.row.fri.cozName"></span>
          </template>
        </el-table-column>
        <el-table-column prop="sat" label="星期六">
          <template slot-scope="scope">
            <span class="course-title" v-text="scope.row.sat.cozName"></span>
          </template>
        </el-table-column>
        <el-table-column prop="sun" label="星期日">
          <template slot-scope="scope">
            <span class="course-title" v-text="scope.row.sun.cozName"></span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <coz-dialog :course="dialogCourse" :dialogVisible="dialogVisible" @closeDialog="closeDialog"/>
  </el-container>
</template>

<script>
import CozDialog from './CourseTable/CozDialog'
export default {
  name: 'CourseTable',
  components: {CozDialog},
  computed: {
    curWeek () {
      return this.$store.state.week
    },
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      dayMap: new Map([[1, 'mon'], [2, 'tue'], [3, 'wed'], [4, 'thu'], [5, 'fri'], [6, 'sat'], [7, 'sun']]),
      year: 2017,
      term: true,
      week: 1,
      tableData: [],
      rowSpanMap: new Map(),
      timeTable: {},
      colorMap: new Map(),
      nextColor: 0,
      dialogCourse: {},
      dialogVisible: false
    }
  },
  created () {
    const tempTableData = []
    for (let i = 0; i < 12; i++) {
      tempTableData[i] = {period: i + 1, mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: ''}
    }

    this.$ajax
      .get('/student/course', this.ajaxConfig)
      .then(res => {
        if (res && res.status === 200) {
          this.timeTable = res.data
          let courseList = this.timeTable.hasOwnProperty('courseList') ? this.timeTable.courseList : null
          // 处理courseList
          if (courseList) {
            for (let i = 0; i < courseList.length; i++) {
              let course = courseList[i]
              let scheduleList = course.hasOwnProperty('scheduleList') ? course.scheduleList : null
              // 处理scheduleList
              if (scheduleList) {
                for (let j = 0; j < scheduleList.length; j++) {
                  let schedule = scheduleList[j]
                  // 判断是否显示
                  if (schedule.schYear === this.year &&
                        schedule.schTerm === this.term &&
                        (this.week >= schedule.schStartWeek && this.week <= schedule.schEndWeek) &&
                        (schedule.schFortnight === 0 || schedule.schFortnight === (this.week % 2 === 1 ? 1 : 2))) {
                    // 开始插入
                    for (let k = schedule.schStartTime; k <= schedule.schEndTime; k++) {
                      // 跨行数
                      if (k === schedule.schStartTime) {
                        this.rowSpanMap.set(`${k - 1}_${schedule.schDay}`, [schedule.schEndTime - schedule.schStartTime + 1, 1])
                      } else {
                        this.rowSpanMap.set(`${k - 1}_${schedule.schDay}`, [0, 0])
                      }
                      // 课程插入tempTable
                      tempTableData[k - 1][this.dayMap.get(schedule.schDay)] = course
                    }
                  }
                }
                this.tableData = tempTableData
              }
            }
          }
          return
        }

        this.$message({
          showClose: true,
          message: '服务器出了一点问题, 请稍后再试',
          type: 'error'
        })
      }
      )
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
  mounted () {
    this.$refs.courseTable.$el.getElementsByClassName('el-table__body')[0].setAttribute('cellspacing', '5')
    this.$refs.courseTable.$el.getElementsByClassName('el-table__header')[0].setAttribute('cellspacing', '5')
  },
  methods: {
    spanMethod ({row, column, rowIndex, columnIndex}) {
      let rowSpan = this.rowSpanMap.get(`${rowIndex}_${columnIndex}`)
      if (rowSpan) {
        return rowSpan
      }
    },
    cellStyle ({row, column}) {
      const colorList = ['#7EA9FB', '#67C23A', '#FEBC50', '#F56C6C', '#A388FC', '#ff3df4', '#00ff9f']
      if (column.property === 'period') {
        return
      }
      const name = row[column.property]
      if (name == null || name === '') {
        return
      }
      let color = this.colorMap.get(name)
      if (color == null) {
        color = colorList[this.nextColor++]
        this.colorMap.set(name, color)
        return {
          backgroundColor: color,
          cursor: 'pointer',
          'border-radius': '10px',
          'box-shadow': `1px 1px 7px ${color}`,
          'border-bottom': 'none',
          'z-index': '1'
        }
      }
      return {
        backgroundColor: color,
        cursor: 'pointer',
        'border-radius': '10px',
        'box-shadow': `1px 1px 7px ${color}`,
        'border-bottom': 'none',
        'z-index': '1'
      }
    },
    showCozDtl (row, column) {
      if (column.property === 'period' || row[column.property] === '' || row[column.property] == null) {
        return
      }
      this.dialogCourse = row[column.property]
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogCourse = {}
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
  .course-title {
    font-size: 1.1rem;
  }
</style>
