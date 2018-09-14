<template>
  <el-main>
    <el-row type="flex" gutter="20">
      <el-col :span="5">
        <el-card class="att-rate-card">
          <el-container>
            <el-header>
              <h2 style="text-align: center">总到勤率</h2>
            </el-header>
            <el-main>
              <el-row type="flex" justify="center">
                <el-progress type="circle" :percentage="attRate"></el-progress>
              </el-row>
            </el-main>
          </el-container>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="att-rank-card">
          <el-container>
            <el-header><h2>缺勤榜</h2></el-header>
            <el-main>
              <el-table :data="absRankList" height="500px">
                <el-table-column prop="usrId" label="学号"></el-table-column>
                <el-table-column prop="usrName" label="姓名"></el-table-column>
                <el-table-column prop="absTimes" label="总缺勤数"></el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
  name: 'Statistics',
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  data () {
    return {
      attRate: 0,
      limitNum: 20,
      absRankList: []
    }
  },
  created () {
    this.$ajax
      .get('/administrator/statistics/att-rate', this.ajaxConfig)
      .then(res => {
        if (res && res.status === 200) {
          this.attRate = res.data.avgAttRate * 100
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
      .get('/administrator/statistics/abs-rank', Object.assign({
        params: {
          limitNum: this.limitNum
        }
      }, this.ajaxConfig))
      .then(res => {
        if (res && res.status === 200) {
          this.absRankList = res.data.absRankList
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
}
</script>

<style scoped>
  h2 {
    font-weight: 400;
    font-size: 1.5rem;
  }
</style>
