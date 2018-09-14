<template>
  <el-main>
    <el-table :data="courseList">
      <el-table-column
        width="110"
        prop="cozId"
        label="课程序号">
      </el-table-column>
      <el-table-column
        prop="cozName"
        label="课程名">
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
    </el-table>
  </el-main>
</template>

<script>
export default {
  name: 'TchCourses',
  props: ['courseList'],
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      dayMap: new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']])
    }
  }
}
</script>

<style scoped>

</style>
