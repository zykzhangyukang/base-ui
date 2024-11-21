<template>
    <div v-if="visible" class="notice-new-version">
        <p>检测到新版本，是否刷新页面？</p>
        <button @click="handleRefresh">刷新</button>
        <button @click="handleIgnore">忽略</button>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "NoticeNewVersion",
        props: {
            pollingTime: {
                type: Number,
                default: 1000 * 60 * 30, // 默认半小时
            },
        },
        data() {
            return {
                currentVersion: "", // 当前版本号
                timer: null, // 定时器句柄
                visible: false, // 是否显示提示框
            };
        },
        mounted() {
            this.getCurrentVersion();
            this.startPolling();
            window.addEventListener("focus", this.handleWindowFocus);
        },
        beforeDestroy() {
            clearInterval(this.timer);
            window.removeEventListener("focus", this.handleWindowFocus);
        },
        methods: {
            // 获取当前版本号
            getCurrentVersion() {
                const metaList = document.querySelectorAll("meta");
                this.currentVersion = this.extractVersionFromMeta(metaList);
            },

            // 启动版本轮询
            startPolling() {
                this.checkForUpdates(); // 初次检测
                this.timer = setInterval(() => {
                    this.checkForUpdates();
                }, this.pollingTime);
            },

            // 检查更新
            async checkForUpdates() {
                try {
                    const timestamp = new Date().getTime();
                    const response = await axios.get(`${window.location.origin}?time=${timestamp}`);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.data, "text/html");
                    const newVersion = this.extractVersionFromMeta(doc.querySelectorAll("meta"));

                    if (newVersion && newVersion !== this.currentVersion) {
                        this.visible = true;
                    }
                } catch (error) {
                    console.error("Failed to fetch new version:", error);
                }
            },

            // 提取版本号
            extractVersionFromMeta(metaList) {
                for (let i = 0; i < metaList.length; i++) {
                    const item = metaList[i];
                    if (item.name === "version_no") {
                        return item.content;
                    }
                }
                return "";
            },

            // 用户确认刷新
            handleRefresh() {
                clearInterval(this.timer);
                window.location.reload();
            },

            // 用户忽略更新
            handleIgnore() {
                this.visible = false;
            },

            // 窗口聚焦时立即检测
            handleWindowFocus() {
                this.checkForUpdates();
            },
        },
    };
</script>

<style scoped>
    .notice-new-version {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #ccc;
        padding: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }
    .notice-new-version p {
        margin: 0 0 10px;
    }
    .notice-new-version button {
        margin-right: 5px;
    }
</style>
