<template>
  <div>
    <div class="notification-wrapper" @click="handleNotificationClick">
      <el-badge :value="count"  class="item" :hidden="count === 0" >
        <el-icon class="el-icon-chat-dot-square" aria-label="Notification"></el-icon>
      </el-badge>
    </div>
    <!-- 消息中心 -->
    <notify-center ref="notifyCenterRef"></notify-center>
  </div>
</template>

<script>
  import {getNotificationCount} from "@/api/common";
  import MyWebSock from "../../utils/socketJs/socket";
  import NotifyCenter from "./NotifyCenter";
  export default {
    name: 'Notification',
    components:{
      NotifyCenter
    },
    data() {
      return {
        count: 0,
        webSocketClient: null
      };
    },
    created() {
      this.getUnReadCount();
      this.webSocketClient = new MyWebSock();
    },
    beforeDestroy() {
      if (this.webSocketClient) {
        this.webSocketClient.disconnect();
      }
    },
    methods: {
      getUnReadCount(){
         getNotificationCount().then(res => {
          this.count = res.result;
        });
      },
      handleNotificationClick() {
        this.$refs.notifyCenterRef.handleOpen();
      },
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
    .el-icon-chat-dot-square {
      font-size: 20px !important;
      vertical-align: middle;
    }
  }
</style>
