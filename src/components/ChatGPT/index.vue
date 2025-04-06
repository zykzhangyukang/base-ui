<template>
  <div class="chat-gpt-wrapper">
    <el-dialog
        title="智能助手"
        :visible.sync="visible"
        :close-on-click-modal="false"
        top="5vh"
        width="48%"
        @closed="handleClose"
    >
      <div class="chat-container">
        <!-- 消息列表 -->
        <div class="message-list" ref="messageList">
          <div
              v-for="(message, index) in messages"
              :key="index"
              :class="['message-item', message.role]"
          >
            <div class="message-avatar">
              <el-avatar
                  :icon="message.role === 'user' ? 'el-icon-user' : 'el-icon-star-on'"
                  :style="{ backgroundColor: message.role === 'user' ? '#409EFF' : '#67C23A' }"
              ></el-avatar>
            </div>
            <div class="message-content">
              <div class="message-role">{{ message.role === 'user' ? '你' : 'AI助手' }}</div>
              <div class="message-text" v-html="message.html || renderMarkdown(message.content)"></div>
            </div>
          </div>
          <div v-if="loading" class="message-item assistant">
            <div class="message-avatar">
              <el-avatar icon="el-icon-star-on" style="background-color: #67C23A" size="medium"></el-avatar>
            </div>
            <div class="message-content">
              <div class="message-role">AI助手</div>
              <div class="message-text">
                <span v-html="renderMarkdown(currentResponse)"></span>
                <span class="typing-cursor">|</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <el-input
              ref="inputBox"
              type="textarea"
              :rows="3"
              maxlength="100"
              show-word-limit
              placeholder="请输入您的问题..."
              v-model="inputMessage"
              @keydown.enter.native.prevent="handleSend"
              :disabled="loading && !showStopButton"
          ></el-input>
          <div class="action-buttons">
            <el-button
                type="primary"
                @click="handleMainButtonClick"
                :loading="loading && !showStopButton"
                :disabled="!inputMessage.trim() && !showStopButton"
                :icon="showStopButton ? 'el-icon-video-pause' : 'el-icon-s-promotion'"
            >
              {{ showStopButton ? '停止生成' : '发送消息' }}
            </el-button>
            <el-button @click="handleClear">清空对话</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.min.css';
import {getAccessToken} from "@/utils/storage/cookie";
import { fetchEventSource } from '@microsoft/fetch-event-source';

export default {
  name: 'ChatGPT',
  data() {
    return {
      visible: false,
      inputMessage: '',
      messages: [],
      loading: false,
      currentResponse: '',
      abortController: null,
      md: null,
      showStopButton: false,
      isStopped: false
    };
  },
  methods: {
    handleOpen() {
      this.visible = true;
      this.$nextTick(() => {
        this.scrollToBottom();
        this.$refs.inputBox.focus();
      });
    },
    handleClose() {
      this.handleClear();
    },
    handleSend() {
      if (!this.inputMessage.trim() || this.loading) return;

      const userMessage = {
        role: 'user',
        content: this.inputMessage,
        html: this.md.render(this.inputMessage)
      };

      this.messages.push(userMessage);
      this.inputMessage = '';
      this.loading = true;
      this.currentResponse = '';
      this.showStopButton = true;
      this.isStopped = false;

      this.$nextTick(() => {
        this.scrollToBottom();
      });

      this.initSSE(userMessage.content);
    },
    initSSE(prompt) {
      this.closeSSE();
      this.abortController = new AbortController();
      fetchEventSource(process.env.VUE_APP_BASE_API + '/common/chat/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ prompt, sessionId: getAccessToken() }),
        onopen: async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP 错误! 状态码: ${response.status}`);
          }
        },
        onmessage: (event) => {
          if (this.isStopped) {
            return;
          }

          const data = event.data;
          if (data === '[DONE]') {
            this.finalizeResponse();
            return;
          }

          try {
            const jsonData = JSON.parse(data);
            if (jsonData.text) {
              this.currentResponse += jsonData.text;
              this.$nextTick(() => {
                this.scrollToBottom();
              });
            }
          } catch (error) {
            console.error('解析 SSE 数据出错:', error);
          }
        },
        onerror: (error) => {
          this.currentResponse = '🚨 网络连接异常，请稍后重试！';
          this.finalizeResponse();
          throw error;
        },
        signal: this.abortController.signal,
      });
    },
    stopGeneration() {
      this.isStopped = true;
      this.closeSSE();
      this.loading = false;
      this.showStopButton = false;

      if (this.currentResponse) {
        this.messages.push({
          role: 'assistant',
          content: this.currentResponse,
          html: this.md.render(this.currentResponse)
        });
      }

      this.currentResponse = '';
      this.$nextTick(() => {
        this.scrollToBottom();
        this.$refs.inputBox.focus();
      });
    },
    finalizeResponse() {
      if (this.currentResponse) {
        this.messages.push({
          role: 'assistant',
          content: this.currentResponse,
          html: this.md.render(this.currentResponse)
        });
      }

      this.currentResponse = '';
      this.loading = false;
      this.showStopButton = false;
      this.closeSSE();

      this.$nextTick(() => {
        this.scrollToBottom();
        this.$refs.inputBox.focus();
      });
    },
    closeSSE() {
      if (this.abortController) {
        this.abortController.abort();
      }
    },
    handleClear() {
      this.messages = [];
      this.currentResponse = '';
      this.closeSSE();
      this.loading = false;
      this.showStopButton = false;
      this.isStopped = false;
    },
    scrollToBottom() {
      const container = this.$refs.messageList;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    renderMarkdown(content) {
      return this.md.render(content || '');
    },
    handleMainButtonClick() {
      if (this.showStopButton) {
        this.stopGeneration();
      } else {
        this.handleSend();
      }
    }
  },
  created() {
    this.md = new MarkdownIt({
      html: false,
      linkify: false,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, {
              language: lang,
              ignoreIllegals: true
            }).value;
          } catch (__) {}
        }
        return hljs.highlightAuto(str).value;
      }
    });
  },
  beforeDestroy() {
    this.closeSSE();
  }
};
</script>

<style scoped lang="less">
.chat-gpt-wrapper {
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 65vh;

    .message-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 8px;
      margin-bottom: 12px;
      border: 1px solid #e6e8eb;
      border-radius: 3px;

      .message-item {
        display: flex;
        margin-bottom: 12px;

        &.user {
          flex-direction: row-reverse;

          .message-content {
            margin-right: 10px;
            margin-left: 0;
            align-items: flex-end;
          }

          .message-role {
            color: #409EFF;
            font-size: 11px;
            margin-bottom: 3px;
          }

          .message-text {
            background-color: #f5faff;
            padding: 8px 12px;
          }
        }

        &.assistant {
          .message-content {
            margin-left: 10px;
            margin-right: 0;
            align-items: flex-start;
          }

          .message-role {
            color: #67C23A;
            font-size: 11px;
            margin-bottom: 3px;
          }

          .message-text {
            background-color: #f5fef5;
            padding: 8px 12px;
          }
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          margin: 0 10px;
          max-width: 85%;
        }

        .message-text {
          border-radius: 6px;
          word-break: break-word;
          line-height: 1.4;
          font-size: 13px;

          ::v-deep {
            p {
              margin: 0.3em 0;
              line-height: 1.4;
            }

            a {
              color: inherit;
              text-decoration: underline;
            }

            strong {
              font-weight: bold;
            }

            em {
              font-style: italic;
            }

            ul, ol {
              padding-left: 1.5em;
              margin: 0.3em 0;
            }

            blockquote {
              border-left: 2px solid #ddd;
              color: #666;
              padding-left: 0.8em;
              margin: 0.3em 0;
            }

            hr {
              border: none;
              border-top: 1px solid #eee;
              margin: 0.8em 0;
            }

            table {
              border-collapse: collapse;
              margin: 0.3em 0;
              width: 100%;
              font-size: 12px;

              th, td {
                border: 1px solid #ddd;
                padding: 0.3em 0.5em;
              }

              th {
                background-color: #f5f5f5;
              }
            }

            pre {
              background: #23241f !important;
              border-radius: 6px;
              padding: 12px;
              overflow: auto;
              margin: 0.5em 0;
              position: relative;

              code {
                background: transparent !important;
                padding: 0 !important;
                color: #f8f8f2 !important;
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                font-size: 0.9em;
                line-height: 1.5;
              }
            }

            code:not(pre code) {
              background-color: rgba(35, 36, 31, 0.2);
              color: #f92672;
              border-radius: 4px;
              padding: 0.2em 0.4em;
              font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
              font-size: 0.85em;
            }
          }
        }
      }
    }

    .input-area {
      .action-buttons {
        margin-top: 8px;
        text-align: right;

        .el-button {
          padding: 8px 12px;
        }
      }
    }
  }
}

.typing-cursor {
  animation: blink 1s infinite;
  font-weight: bold;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
