<template>
  <div class="notification-wrapper" >
    <el-badge :value="2" class="item">
    <el-icon class="el-icon-bell"></el-icon>
    </el-badge>
  </div>
</template>

<script>

export default {
  name: 'Notification',
  data() {
    return {
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
  }
}
</script>

<style lang="less">
.notification-wrapper {
  float: left;
  width: 22px;
  height: 22px;
  padding: 4px;
  cursor: pointer;
  .el-icon-bell {
    font-size: 20px!important;
    vertical-align: middle
  }
}
</style>
