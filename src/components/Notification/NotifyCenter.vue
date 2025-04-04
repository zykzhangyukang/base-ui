<template>
  <span class="notify-center">
    <!-- 消息中心主弹窗 -->
    <el-dialog
        title="消息中心"
        top="5vh"
        :visible.sync="visible"
        width="40%"
        :close-on-click-modal="false"
        :before-close="handleClose"
    >
      <div class="notify-center__container">
        <!-- 工具栏 -->
        <div class="notify-center__toolbar">
          <div class="toolbar-content">
            <el-radio-group v-model="searchForm.module" size="mini" @input="handleInput">
              <el-radio-button
                  :label="item.code"
                  :name="item.code"
                  v-for="item in notificationModuleG"
                  :key="item.code"
              >
                {{ notificationModuleGName[item.code] }} ({{ getUnReadCount(item.code) }})
              </el-radio-button>
            </el-radio-group>
            <div class="toolbar-actions">
              <el-select
                  v-model="searchForm.isRead"
                  style="width: 100px;"
                  placeholder="请选择"
                  size="mini"
                  @change="handleInput"
              >
                <el-option label="全部状态" value=""></el-option>
                <el-option
                    v-for="item in isReadG"
                    :key="item.code"
                    :label="isReadGName[item.code]"
                    :value="item.code"
                >
                </el-option>
              </el-select>
              <el-button
                  size="mini"
                  type="primary"
                  @click="markAllAsRead"
                  :loading="markAllLoading"
                  v-if="hasUnreadMessages"
              >
                全部已读
              </el-button>
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="notify-center__list-container" v-loading="tableLoading">
          <div v-if="tableData.length === 0" class="empty-message">
            <el-empty description="暂无消息"></el-empty>
          </div>
          <div
              v-for="item in tableData"
              :key="item.notificationId"
              class="message-card"
              :class="{'unread': item.isRead === 0}"
              @click="handleMessageClick(item)"
          >
            <div class="message-header">
              <span class="message-title">{{ notificationTypeGName[item.notificationType] }}</span>
              <span class="message-time">{{ formatDate(item.createTime) }}</span>
            </div>
            <div class="message-content">
              {{ item.message }}
            </div>
            <div class="message-footer">
              <el-button
                  size="mini"
                  type="text"
                  @click.stop="markAsRead(item)"
                  :loading="item.readLoading"
              >
                <span :class="['status-tag', item.isRead === 1 ? 'read' : 'unread']">
                  {{ item.isRead === 1 ? '已读' : '未读' }}
                </span>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="notify-center__pagination-container" v-if="total > searchForm.pageSize">
          <el-pagination
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>

    <!-- 消息详情弹窗 -->
    <el-dialog
        :title="null"
        :visible.sync="detailVisible"
        width="40%"
        :close-on-click-modal="false"
    >
      <div class="notify-center__detail">
        <div class="notify-center__detail-title">
          <h3>{{ formatNotificationType(currentDetail.notificationType) }}</h3>
          <div class="notify-center__detail-time">
            {{ formatDate(currentDetail.createTime) }}
          </div>
        </div>
        <div class="notify-center__detail-content">
          {{ currentDetail.message }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关 闭</el-button>
        <el-button
            v-if="currentDetail.isRead === 0"
            type="primary"
            @click="markAsRead(currentDetail)"
            :loading="readLoading"
        >
          标记为已读
        </el-button>
      </span>
    </el-dialog>

    <device-check-msg/>
  </span>
</template>

<script>
import { getNotificationPage, maskNotificationRead, markAllAsRead } from "@/api/common";
import DeviceCheckMsg from "@/components/Notification/DeviceCheckMsg.vue";

export default {
  components: {
    DeviceCheckMsg
  },
  name: 'NotifyCenter',
  data() {
    return {
      visible: false,
      detailVisible: false,
      tableLoading: false,
      readLoading: false,
      markAllLoading: false, // 全部已读按钮loading状态
      tableData: [],
      result: {},
      currentDetail: {},
      total: 0,
      searchForm: {
        currentPage: 1,
        pageSize: 5,
        isRead: '',
        module: 'all'
      },
    }
  },
  computed: {
    notificationModuleG() {
      return this.$getConst("notification_module")
    },
    notificationModuleGName() {
      return this.$formatConst(this.notificationModuleG);
    },
    notificationTypeG() {
      return this.$getConst("notification_type")
    },
    notificationTypeGName() {
      return this.$formatConst(this.notificationTypeG);
    },
    isReadG() {
      return this.$getConst("is_read")
    },
    isReadGName() {
      return this.$formatConst(this.isReadG);
    },
    // 检查是否有未读消息
    hasUnreadMessages() {
      return this.tableData.some(item => item.isRead === 0);
    }
  },
  methods: {
    formatNotificationType(value) {
      return this.notificationTypeGName[value] || value;
    },
    formatDate(value) {
      if (!value) return '';
      return new Date(value).toLocaleString();
    },

    // 点击消息卡片
    handleMessageClick(item) {
      this.currentDetail = { ...item };
      this.detailVisible = true;

      // 如果是未读消息，自动标记为已读
      if (item.isRead === 0) {
        this.markAsRead(item);
      }
    },

    // 标记为已读
    markAsRead(item) {
      this.$set(item, 'readLoading', true);
      maskNotificationRead(item.notificationId).then(res => {
        if (res.code === 200) {
          item.isRead = 1;
          if (this.currentDetail.notificationId === item.notificationId) {
            this.currentDetail.isRead = 1;
          }
          this.$message.success('标记已读成功');
        }
      }).finally(() => {
        this.$set(item, 'readLoading', false);
      });
    },

    // 全部已读
    markAllAsRead() {
      this.markAllLoading = true;
      markAllAsRead({ module: this.searchForm.module }).then(res => {
        if (res.code === 200) {
          this.tableData.forEach(item => {
            item.isRead = 1;
          });
          this.$message.success('全部标记已读成功');
          this.fetchData(); // 刷新数据更新未读数量
        }
      }).finally(() => {
        this.markAllLoading = false;
      });
    },

    getUnReadCount(code) {
      return this.result[code] || 0;
    },

    handleInput(val) {
      this.searchForm.currentPage = 1;
      this.fetchData();
    },

    fetchData() {
      this.tableLoading = true;
      getNotificationPage(this.searchForm).then(res => {
        this.tableData = res.result.pageInfo.dataList.map(item => ({
          ...item,
          readLoading: false
        }));
        this.total = res.result.pageInfo.totalRow;
        this.result = res.result;
      }).finally(() => {
        this.tableLoading = false;
      })
    },

    handleCurrentChange(val) {
      this.searchForm.currentPage = val;
      this.fetchData();
    },

    handleClose() {
      this.visible = false;
    },

    handleOpen() {
      this.visible = true;
      this.fetchData();
    },

    onSubmit() {
      this.handleClose();
    }
  }
}
</script>

<style lang="less" scoped>
.notify-center {
  &__container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 400px;
  }

  &__toolbar {
    margin-bottom: 10px;

    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  &__list-container {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 5px;

    .empty-message {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }

  .message-card {
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 3px;
    background-color: #f8f8f8;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 2px solid transparent;

    &:hover {
      background-color: #f0f0f0;
      transform: none; /* 移除上移效果 */
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    &.unread {
      border-left-color: #409EFF;
      background-color: #f0f7ff;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .message-title {
      font-weight: bold;
      color: #333;
      font-size: 13px;
    }

    .message-time {
      font-size: 11px;
      color: #999;
    }

    .message-content {
      color: #666;
      margin-bottom: 6px;
      line-height: 1.4;
      font-size: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .message-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 4px;
    }

    .status-tag {
      font-size: 11px;
      padding: 1px 5px;
      border-radius: 8px;
      &.read {
        color: #67C23A;
        background-color: #f0f9eb;
      }

      &.unread {
        color: #F56C6C;
        background-color: #fef0f0;
      }
    }
  }

  &__pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eee;
  }

  &__detail {
    &-title {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;

      h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
      }
    }

    &-time {
      margin-top: 5px;
      font-size: 12px;
      color: #999;
    }

    &-content {
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  /deep/ .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  @media (max-width: 768px) {
    /deep/ .el-dialog {
      width: 90% !important;

      &__body {
        padding: 15px;
      }
    }

    &__toolbar {
      .toolbar-content {
        flex-direction: column;
        align-items: flex-start;

        .toolbar-actions {
          width: 100%;
          margin-top: 10px;

          .el-select {
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>
