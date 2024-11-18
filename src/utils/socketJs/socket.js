import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import store from '@/store';
import {getAccessToken} from "../storage/cookie";

class MyWebSock {
    url = process.env.VUE_APP_BASE_API + '/sys_websocket';

    constructor() {
        this.stompClient = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.timer = null;
        this.reconnectTimer = null;
        this.token = getAccessToken();

        this.connect();
    }

    connect() {
        const socket = new SockJS(this.url);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = null;

        const headers = {
            Authorization: this.token
        };

        this.stompClient.connect(headers, () => {
                this.reconnectAttempts = 0;
                this.subscribeToTopics();
                this.startHeartbeat();
            },
            err => {
                this.handleReconnect();
            }
        );
    }

    startHeartbeat() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.sendHeartbeat();
        }, 5000);
    }

    sendHeartbeat() {
        try {
            this.stompClient.send('heartbeat');
        } catch (err) {
            this.handleReconnect();
        }
    }

    handleReconnect() {
        if (this.timer) clearInterval(this.timer);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const backoffTime = this.getFibonacciBackoffTime(this.reconnectAttempts) * 1000; // 斐波那契退避
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

        // 订阅系统消息
        this.stompClient.subscribe('/topic/sysMsg', this.subSysMsg,  {
            id: 'sub-0',
            Authorization: this.token,
        });

        // 订阅用户消息
        const user = store.state.user.userInfo;
        if (user) {
            this.stompClient.subscribe(`/user/${user.userId}/sysMsg`, this.subUserMsg,  {
                id: 'sub-1',
                Authorization: this.token,
            });
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
        const body = JSON.parse(msg.body);
        // 基金信息更新
        if(body?.type === 'fund_tips'){
            store.commit('notification/SET_FUND_DATA', JSON.parse(body.message))
        }
    }

    subUserMsg(msg) {
        const body = JSON.parse(msg.body);
        console.log(body)
    }
}

export default MyWebSock;
