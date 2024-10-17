<template>
  <div class="home-wrapper">
    <h3 style="text-align: center;margin-top: 100px;font-size: 21px;color: #303030;box-shadow:  #2f3e45">{{userInfo.realName}}你好，欢迎您使用系统！</h3>
   <h6 style="text-align: center;margin-top: 50px;font-size: 11px;color: #f40;"> {{fundTips}}</h6>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
    }
  },
  computed:{
    userInfo(){
      return this.$store.state.user.userInfo;
    },
    fundTips(){
      return this.$store.state.notification.fundTips;
    },
  }
}
</script>

<style lang="less">
</style>
