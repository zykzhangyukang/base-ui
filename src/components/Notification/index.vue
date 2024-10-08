<template>
  <div class="notification-wrapper">
    <el-badge is-dot class="item">
      <el-icon class="el-icon-bell"></el-icon>
    </el-badge>
  </div>
</template>

<script>
  import MyWebSock from "../../utils/socket";
  export default {
    name: 'Notification',
    data() {
      return {
      };
    },
    beforeUnmount() {
      if(this.stompClient){
        this.stompClient.disconnect()
      }
    },
    created() {
      this.stompClient = new MyWebSock(this.$store.state.user.userInfo.userId);
    },
    methods: {
    },
  };
</script>

<style lang="less">
  .notification-wrapper {
    float: left;
    width: 22px;
    height: 22px;
    padding: 4px;
    cursor: pointer;
    .el-icon-bell {
      font-size: 20px !important;
      vertical-align: middle;
    }
  }
</style>
