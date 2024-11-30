<template>
  <el-dialog
      :title="null"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
      :before-close="handleClose">
    <el-result icon="warning" title="异地登录系统" :subTitle="showDeviceMsg">
      <template slot="extra">
        <el-button type="primary" size="medium" @click="handleOk">确定</el-button>
      </template>
    </el-result>
  </el-dialog>
</template>
<script>
export default {
  name: "DeviceCheckMsg.vue",
  data(){
    return {
      dialogVisible: false,
    }
  },
  computed: {
    showDeviceMsg() {
      return this.$store.state.notification.showDeviceMsg;
    }
  },
  methods:{
    handleClose(){
      this.handleOk();
    },
    handleOk(){
      this.$store.commit('user/REMOVE_TOKEN');
      this.$router.push('/login')
    }
  },
  watch:{
    showDeviceMsg(newVal){
      if(newVal){
        this.dialogVisible = true;
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
