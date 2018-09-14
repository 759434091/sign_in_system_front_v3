<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    const vm = this
    this.$ajax.interceptors.response.use(res => res, (res) => {
      if (res && res.response && res.response.status === 401) {
        vm.$router.push('/logout')
        return Promise.reject(res)
      }
      return res
    })
  }
}
</script>

<style>
  body {
    min-height: 930px;
    min-width: 1280px;
    background-color: #F9FaFc;
  }

  .course-table {
    width: 100%;
    color: #000000;
  }

  .course-table .el-table__body tr:hover > td {
    background-color: #FFFFFF;
  }

  .course-table tr td{
    border-right: 0;
    border-bottom: 1px dashed #ebeef5;
  }

  .course-table tr:last-of-type td{
    border-right: 0;
    border-bottom: 0;
  }

  .last-item .el-submenu__title {
    border-top-right-radius: 5px;
  }

  .suv-expand-form .el-form-item label {
    color: #99a9bf !important;
  }
</style>
