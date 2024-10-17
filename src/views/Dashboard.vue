<template xmlns="http://www.w3.org/1999/html">
  <div class="home-wrapper">
    <h3 style="text-align: center;margin-top: 100px;font-size: 21px;color: #303030;box-shadow:  #2f3e45">
      {{ userInfo.realName }}你好，欢迎您使用系统！
    </h3>
    <h6 style="text-align: center;margin-top: 30px;font-size: 12px;color: red">
      {{ fundTips }}
      <br/>
      <br/>
      <el-button size="mini" type="text" @click="showImage" icon="el-icon-picture-outline">
      查看图片
    </el-button>
    </h6>
    <el-dialog
        :title="null"
        width="500px"
        :visible.sync="dialogVisible"
        :before-close="handleClose">
      <el-image
          style="width: 451px; height: 281px"
          :src="url"
          :fit="fit">
        <div slot="placeholder" class="image-slot">
          <div class="image-loading">
            加载中<span class="el-icon-loading"></span>
          </div>
        </div>
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      dialogVisible: false,
      url: '',
    }
  },
  methods: {
    handleClose(done) {
      done();
    },
    showImage() {
      this.url  = 'https://j4.dfcfw.com/charts/pic7/161725.png?'+new Date().getTime();
      this.dialogVisible = true;
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    fundTips() {
      return this.$store.state.notification.fundTips;
    },
  }
}
</script>

<style lang="less">
.image-slot {
  width: 451px;
  height: 281px;
  background: #f5f7fa;
}
.image-loading{
  text-align: center;
  background: #f5f7fa;
  padding-top: 120px;
}
</style>
