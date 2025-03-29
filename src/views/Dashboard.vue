<template xmlns="http://www.w3.org/1999/html">
  <div class="home-wrapper">
    <h2 style="text-align: center;margin-top: 100px;margin-bottom:20px;color: #303030;font-weight: 600">
      {{userInfo.realName}}<small style="color: red"> {{ userInfo.username }} </small>你好，欢迎您使用系统！</h2>
      <el-result icon="info" >
        <template slot="extra">
          <el-button type="primary" size="medium" icon="el-icon-chat-line-square" @click="handleOpenGPT">智能助手</el-button>
        </template>
      </el-result>
      <ChatGPT ref="chatGptRef"></ChatGPT>
  </div>
</template>

<script>
import ChatGPT from "@/components/ChatGPT/index.vue";
export default {
  name: 'Dashboard',
  components:{
    ChatGPT
  },
  data() {
    return {}
  },
  methods:{
    handleOpenGPT(){
      this.$refs.chatGptRef.handleOpen();
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  }
}
</script>

<style lang="less">
</style>
