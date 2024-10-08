import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {getAccessToken} from './cookie'

class MyWebSock {
    url = process.env.VUE_APP_BASE_API + '/sys_websocket';

    constructor(userId) {
        this.stompClient = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.timer = null;
        this.reconnectTimer = null;
        this.userId = userId;

        this.connect();
    }

    connect() {
        console.log('正在尝试连接 WebSocket...');
        const socket = new SockJS(this.url);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = null;

        const headers = {
            Authorization: getAccessToken()
        };

        this.stompClient.connect(headers, () => {
                this.reconnectAttempts = 0;
                console.log('WebSocket 连接成功');
                this.subscribeToTopics();

                // 重置心跳定时器
                this.startHeartbeat();
            },
            err => {
                console.log('WebSocket 连接失败', err);
                
                this.handleReconnect();
            }
        );
    }

    startHeartbeat() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.sendHeartbeat();
        }, 10000);
    }

    sendHeartbeat() {
        try {
            this.stompClient.send('heartbeat');
        } catch (err) {
            console.log('WebSocket 连接丢失: ' + err);
            this.handleReconnect();
        }
    }

    handleReconnect() {
        if (this.timer) clearInterval(this.timer);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const backoffTime = this.getFibonacciBackoffTime(this.reconnectAttempts) * 1000; // 斐波那契退避
            console.log(`将在 ${backoffTime / 1000} 秒后重连...`);
            this.reconnectTimer = setTimeout(() => {
                this.connect();
            }, backoffTime);
            this.reconnectAttempts += 1;
        } else {
            
            console.log('达到最大重连次数。放弃重连。');
        }
    }

    getFibonacciBackoffTime(attempt) {
        if (attempt <= 1) return attempt;
        let a = 0, b = 1, temp;
        for (let i = 2; i <= attempt; i++) {
            temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    subscribeToTopics() {
        const headers = {
            Authorization: getAccessToken()
        };
        //this.stompClient.subscribe('/topic/sysMsg', this.subSysMsg, headers);
        if (this.userId) {
            this.stompClient.subscribe(`/user/`+this.userId+`/sysMsg`, this.subUserMsg, headers);
        }
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
        if (this.timer) clearInterval(this.timer);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    }

    subSysMsg(msg) {
        console.log("系统消息")
    }

    subUserMsg(msg) {
        const body = JSON.parse(msg.body);
        console.log("用户消息")
    }
}

export default MyWebSock;
