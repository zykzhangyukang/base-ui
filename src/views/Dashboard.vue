<template>
  <div class="home-wrapper">
    <h1 style="text-align: center;margin-top: 100px;font-size: 20px">{{userInfo.realName}}你好，欢迎您使用系统！</h1>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
    }
  },
  computed:{
    userInfo(){
      return this.$store.state.user.userInfo;
    },
  }
}
</script>

<style lang="less">
</style>
