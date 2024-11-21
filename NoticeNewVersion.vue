<template>
  <transition name="init-transform" mode="out-in">
    <div class="notice-new-version" v-if="show">
      <svg-icon class="icon" name="icon_version" />
      <span>{{ message }}</span>
      <el-tooltip class="item" effect="dark" content="更新前记得保存正在编辑表单数据" placement="bottom">
        <span class="btn" @click="handeSubmit">点击更新</span>
      </el-tooltip>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'NoticeNewVersion',
  data() {
    return {
      show: false,
      message: '新版本已推送，请点击刷新'
    }
  },
  methods: {
    open(message) {
      this.show = true
      if (message) {
        this.message = message
      }
    },

    handeSubmit() {
      this.show = false
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
.notice-new-version {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: #fff;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  line-height: 1.1;
  z-index: 10;

  .icon {
    margin-right: 6px;
    font-size: 16px;
  }
  .btn {
    margin-left: 10px;
    font-size: 12px;
    color: var(--primary-color);
    line-height: 1;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
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
