<template>
  <div>logout...</div>
</template>

<script>
export default {
  name: 'Logout',
  computed: {
    ajaxConfig () {
      return this.$store.state.ajaxConfig
    }
  },
  created () {
    this.$store.commit('logout')
    localStorage.removeItem('session')
    this.$router.push('/login')
  }
}
</script>

<style scoped>

</style>
