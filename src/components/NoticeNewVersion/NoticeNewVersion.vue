<template>
  <transition name="init-transform" mode="out-in">
  <div v-if="visible" class="notice-new-version">
    <el-icon class="icon el-icon-s-promotion"></el-icon>
    <span>检测到新版本，是否刷新页面？</span>
    <el-tooltip class="item" effect="dark" content="更新前记得保存正在编辑表单数据" placement="bottom">
      <span class="btn" @click="handleRefresh">点击更新</span>
    </el-tooltip>
  </div>
  </transition>
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
      visible: true, // 是否显示提示框
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
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  line-height: 1.1;

  .btn {
    margin-left: 5px;
    font-size: 12px;
    color:  #2d8cf0;
    line-height: 1;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .icon {
    margin-right: 6px;
    font-size: 16px;
    color: #2d8cf0;
  }
}

.init-transform-leave-active,
.init-transform-enter-active {
  transition: all 0.5s;
}

.init-transform-enter {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.init-transform-leave-to {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
