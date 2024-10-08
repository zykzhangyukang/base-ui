<template>
  <div class="notification-wrapper">
    <el-badge :value="2" class="item">
      <el-icon class="el-icon-bell"></el-icon>
    </el-badge>
  </div>
</template>

<script>
  import SockJS from 'sockjs-client';
  import Stomp from 'stompjs';
  import { getAccessToken } from '../../utils/cookie';

  export default {
    name: 'Notification',
    data() {
      return {
        stompClient: null,
        reconnectAttempts: 0,
        maxReconnectAttempts: 10,
        timer: null,
        reconnectTimer: null,
        url: process.env.VUE_APP_BASE_API + '/sys_websocket',
      };
    },
    mounted() {
      this.initWebSocket();
    },
    beforeDestroy() {
      this.disconnectWebSocket();
    },
    methods: {
      initWebSocket() {
        console.log('正在尝试连接 WebSocket...');
        const socket = new SockJS(this.url);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = null;

        const headers = {
          Authorization: getAccessToken(),
        };

        this.stompClient.connect(headers, () => {
                  this.reconnectAttempts = 0;
                  console.log('WebSocket 连接成功');
                  this.subscribeToTopics();
                  this.startHeartbeat();
                },
                err => {
                  console.log('WebSocket 连接失败', err);
                  this.handleReconnect();
                }
        );
      },

      startHeartbeat() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.sendHeartbeat();
        }, 10000);
      },

      sendHeartbeat() {
        try {
          this.stompClient.send('heartbeat');
        } catch (err) {
          console.log('WebSocket 连接丢失: ' + err);
          this.handleReconnect();
        }
      },

      handleReconnect() {
        if (this.timer) clearInterval(this.timer);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const backoffTime = this.getFibonacciBackoffTime(this.reconnectAttempts) * 1000;
          console.log(`将在 ${backoffTime / 1000} 秒后重连...`);
          this.reconnectTimer = setTimeout(() => {
            this.initWebSocket();
          }, backoffTime);
          this.reconnectAttempts += 1;
        } else {
          console.log('达到最大重连次数。放弃重连。');
        }
      },

      getFibonacciBackoffTime(attempt) {
        if (attempt <= 1) return attempt;
        let a = 0, b = 1, temp;
        for (let i = 2; i <= attempt; i++) {
          temp = a + b;
          a = b;
          b = temp;
        }
        return b;
      },

      subscribeToTopics() {
        const headers = {
          Authorization: getAccessToken(),
        };

        this.stompClient.subscribe('/topic/sysMsg', this.handleSysMsg, headers);
        const user = this.$store.state.user.userInfo;
        console.log(user)
        if (user) {
          this.stompClient.subscribe(`/user/${user.userId}/sysMsg`, this.handleUserMsg, headers);
        }
      },

      handleSysMsg(msg) {
        // 处理系统消息
        console.log('收到系统消息: ', msg);
      },

      handleUserMsg(msg) {
        const body = JSON.parse(msg.body);
        console.log('收到用户消息: ', body);
      },

      disconnectWebSocket() {
        if (this.stompClient) {
          this.stompClient.disconnect();
        }
        if (this.timer) clearInterval(this.timer);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
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
    .el-icon-bell {
      font-size: 20px !important;
      vertical-align: middle;
    }
  }
</style>
