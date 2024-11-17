<template xmlns="http://www.w3.org/1999/html">
  <div class="home-wrapper">
    <h2 style="text-align: center;margin-top: 100px;margin-bottom:20px;color: #303030;font-weight: 600">
      {{userInfo.realName}} <small style="color: red"> ({{ userInfo.username }})</small>你好，欢迎您使用系统！</h2>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  }
}
</script>

<style lang="less">
</style>
