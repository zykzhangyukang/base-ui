<template>
  <el-dropdown class="user-avatar-wrapper" @command="handleCommand">
    <div class="avatar-box">
      <el-avatar size="small" :src="avatarSrc" />
      <i class="el-icon-caret-bottom" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
      <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import Avatar from '../../assets/img/avatar.png'

  export default {
  name: 'UserAvatar',
  data() {
    return {
      avatarSrc: Avatar
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'userCenter') {
        this.$router.push({ path: '/user-center' })
      }
      if (command === 'loginOut') {
        this.loginOut()
      }
    },
    loginOut() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('user/REMOVE_TOKEN');
        window.location.reload();
      })
    }
  }
}
</script>

<style lang="less">
.user-avatar-wrapper {
  float: left;
  width: 48px;
  padding: 3px 0 3px 20px;
  margin-left: 20px;
  cursor: pointer;
  .avatar-box {
    outline: none;
  }
  .el-avatar--small {
    display: inline-block;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
  i {
    display: inline-block;
    vertical-align: middle;
    margin-left: 2px;
  }
}
</style>
