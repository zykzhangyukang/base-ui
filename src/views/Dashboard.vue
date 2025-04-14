<template>
  <div class="home-wrapper">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h2 class="welcome-title">
          <span class="greeting">尊敬的，</span>
          <span class="name">{{userInfo.realName}}</span>
          <small class="username">({{ userInfo.username }})</small>
        </h2>
        <p class="welcome-subtitle">欢迎回来！今天是{{ currentDate }}，祝您工作愉快！</p>
      </div>
      <div class="user-avatar">
        <el-avatar :size="80" :src="userInfo.avatar"></el-avatar>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="data-overview">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background-color: #f0f7ff;">
                <i class="el-icon-user-solid" style="color: #409EFF;"></i>
              </div>
              <div class="stat-info">
                <div class="stat-title">用户总数</div>
                <div class="stat-value">1,248</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background-color: #f0f9eb;">
                <i class="el-icon-s-order" style="color: #67C23A;"></i>
              </div>
              <div class="stat-info">
                <div class="stat-title">订单数量</div>
                <div class="stat-value">356</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background-color: #fdf6ec;">
                <i class="el-icon-s-data" style="color: #E6A23C;"></i>
              </div>
              <div class="stat-info">
                <div class="stat-title">销售额</div>
                <div class="stat-value">¥89,245</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background-color: #fef0f0;">
                <i class="el-icon-message-solid" style="color: #F56C6C;"></i>
              </div>
              <div class="stat-info">
                <div class="stat-title">未读消息</div>
                <div class="stat-value">12</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-row :gutter="20">
        <!-- 左侧内容 -->
        <el-col :xs="24" :sm="24" :md="16" :lg="16">
          <!-- 快捷操作 -->
          <el-card shadow="hover" class="quick-actions">
            <div slot="header" class="card-header">
              <span>快捷操作</span>
            </div>
            <div class="action-buttons">
              <el-button type="primary" icon="el-icon-plus">新增用户</el-button>
              <el-button type="success" icon="el-icon-goods">创建订单</el-button>
              <el-button type="warning" icon="el-icon-setting">系统设置</el-button>
              <el-button type="info" icon="el-icon-document">查看报表</el-button>
            </div>
          </el-card>

          <!-- 最近活动 -->
          <el-card shadow="hover" class="recent-activities">
            <div slot="header" class="card-header">
              <span>最近活动</span>
              <el-button type="text" class="view-all">查看全部</el-button>
            </div>
            <el-timeline>
              <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :timestamp="activity.time"
                  placement="top"
              >
                <el-card shadow="never">
                  <p>{{ activity.content }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <!-- 智能助手 -->
          <el-card shadow="hover" class="assistant-card">
            <div slot="header" class="card-header">
              <span>智能助手</span>
            </div>
            <div class="assistant-content">
              <el-result icon="info">
                <template slot="extra">
                  <el-button
                      type="primary"
                      size="medium"
                      icon="el-icon-chat-line-square"
                      @click="handleOpenGPT"
                  >
                    开启对话
                  </el-button>
                </template>
              </el-result>
              <div class="tips">
                <p>💡 小提示：您可以询问助手关于系统使用、数据分析等问题</p>
              </div>
            </div>
          </el-card>

          <!-- 系统公告 -->
          <el-card shadow="hover" class="notice-card">
            <div slot="header" class="card-header">
              <span>系统公告</span>
            </div>
            <ul class="notice-list">
              <li v-for="(notice, index) in notices" :key="index" class="notice-item">
                <div class="notice-title">{{ notice.title }}</div>
                <div class="notice-time">{{ notice.time }}</div>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <ChatGPT ref="chatGptRef"></ChatGPT>
  </div>
</template>

<script>
import ChatGPT from "@/components/ChatGPT/index.vue";

export default {
  name: 'Dashboard',
  components: {
    ChatGPT,
  },
  data() {
    return {
      currentDate: this.formatDate(new Date()),
      activities: [
        { time: '2023-05-01 09:12', content: '用户张三创建了一个新订单 #12345' },
        { time: '2023-05-01 10:30', content: '系统进行了版本更新 (v2.1.0)' },
        { time: '2023-04-30 16:45', content: '李四修改了个人资料信息' },
        { time: '2023-04-30 14:20', content: '新增了10个注册用户' },
      ],
      notices: [
        { title: '系统将于5月10日凌晨进行维护升级', time: '2023-05-01' },
        { title: '新增数据分析报表功能', time: '2023-04-28' },
        { title: '劳动节期间客服工作时间调整', time: '2023-04-27' },
      ]
    }
  },
  methods: {
    handleOpenGPT() {
      this.$refs.chatGptRef.handleOpen();
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
      return `${year}年${month}月${day}日 星期${week}`;
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  }
}
</script>

<style lang="less" scoped>
.home-wrapper {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

// 欢迎区域
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  padding: 25px 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  .welcome-content {
    .greeting {
      font-size: 20px;
      color: #606266;
    }

    .name {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      margin: 0 5px;
    }

    .username {
      font-size: 16px;
      color: #909399;
    }

    .welcome-subtitle {
      margin-top: 10px;
      font-size: 14px;
      color: #909399;
    }
  }

  .user-avatar {
    /deep/ .el-avatar {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  }
}

// 数据概览卡片
.data-overview {
  margin-bottom: 20px;

  .stat-card {
    margin-bottom: 20px;
    border-radius: 8px;
    border: none;

    .stat-content {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;

        i {
          font-size: 24px;
        }
      }

      .stat-info {
        .stat-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 22px;
          font-weight: bold;
          color: #303133;
        }
      }
    }
  }
}

// 卡片公共样式
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #303133;

  .view-all {
    padding: 0;
    font-weight: normal;
  }
}

// 快捷操作
.quick-actions {
  margin-bottom: 20px;
  border-radius: 8px;

  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .el-button {
      flex: 1;
      min-width: 120px;
    }
  }
}

// 最近活动
.recent-activities {
  margin-bottom: 20px;
  border-radius: 8px;

  /deep/ .el-timeline-item__timestamp {
    color: #909399;
    font-size: 13px;
  }

  /deep/ .el-card__body {
    padding: 10px;
  }
}

// 智能助手卡片
.assistant-card {
  margin-bottom: 20px;
  border-radius: 8px;

  .assistant-content {
    text-align: center;

    .tips {
      margin-top: 15px;
      padding: 10px;
      background-color: #f8f8f8;
      border-radius: 4px;
      font-size: 13px;
      color: #909399;
    }
  }
}

// 系统公告
.notice-card {
  border-radius: 8px;

  .notice-list {
    list-style: none;
    padding: 0;
    margin: 0;

    .notice-item {
      padding: 10px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .notice-title {
        font-size: 14px;
        color: #303133;
        margin-bottom: 5px;
        cursor: pointer;

        &:hover {
          color: #409EFF;
        }
      }

      .notice-time {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;

    .user-avatar {
      margin-top: 15px;
    }
  }

  .quick-actions .action-buttons .el-button {
    min-width: 100%;
  }
}
</style>
