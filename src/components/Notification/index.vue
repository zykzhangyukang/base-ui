<template>
  <div class="notification-wrapper" @click="handleNotificationClick">
    <el-badge :value="count"  class="item" >
      <el-icon class="el-icon-chat-dot-square" aria-label="Notification"></el-icon>
    </el-badge>
  </div>
</template>

<script>
  import SockJS from 'sockjs-client';
  import Stomp from 'stompjs';
  import { getAccessToken } from "../../utils/cookie";
  import {getNotificationCount} from "../../api/auth";

  export default {
    name: 'Notification',
    data() {
      return {
        count: 0,
        stompClient: null,
        reconnectAttempts: 0,
        maxReconnectAttempts: 10,
        timer: null,
        reconnectTimer: null
      };
    },
    created() {
      this.getUnReadCount();
      this.connectWebSocket();
    },
    beforeUnmount() {
      this.disconnectWebSocket();
    },
    methods: {
      getUnReadCount(){
         getNotificationCount().then(res => {
          this.count = res.result.count;
        });
      },
      connectWebSocket() {
        console.log('正在尝试连接 WebSocket...');
        const socket = new SockJS(process.env.VUE_APP_BASE_API + '/sys_websocket');
        this.stompClient = Stomp.over(socket);
        this.stompClient.heartbeat.outgoing = 20000;
        this.stompClient.heartbeat.incoming = 20000;
        this.stompClient.debug = (str) => {
          console.log('STOMP debug: ', str);
        };

        const headers = {
          Authorization: getAccessToken(),
        };

        this.stompClient.connect(headers, () => {
          this.reconnectAttempts = 0;
          console.log('WebSocket 连接成功');
          this.subscribeToTopics();
          this.startHeartbeat();
        }, (err) => {
          console.log('WebSocket 连接失败', err);
          this.handleReconnect();
        });
      },

      subscribeToTopics() {
        this.stompClient.subscribe('/topic/sysMsg', this.subSysMsg, {
          id: 'sub-0',
          Authorization: getAccessToken(),
        });
        let userId = this.$store.state.user.userInfo.userId;
        this.stompClient.subscribe(`/user/${userId}/sysMsg`, this.subUserMsg, {
          id: 'sub-1',
          Authorization: getAccessToken(),
        });
      },

      subSysMsg(msg) {
        console.log('系统消息: ', msg);
      },

      subUserMsg(msg) {
        const body = JSON.parse(msg.body);
        this.count +=1;
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
          const backoffTime = this.getFibonacciBackoffTime(this.reconnectAttempts) * 1000; // 斐波那契退避
          console.log(`将在 ${backoffTime / 1000} 秒后重连...`);
          this.reconnectTimer = setTimeout(() => {
            this.connectWebSocket();
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

      disconnectWebSocket() {
        if (this.stompClient) {
          this.stompClient.disconnect();
        }
        if (this.timer) clearInterval(this.timer);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      },

      handleNotificationClick() {
        console.log('Notification clicked');
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
