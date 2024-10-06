<template>
  <el-dialog
      title="新增计划"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :close-on-click-modal="false"
      :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="" label-position="top">
      <el-form-item label="" prop="planContent">
        <el-input v-model="form.planContent"  clearable type="textarea" :rows="10"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="onSubmit" :loading="btnLoading">保存</el-button>
        <el-button type="info" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>


import {savePlan} from "@/api/sync";

export default {
  name: 'RoleAdd',
  components: {
  },
  data() {
    return {
      visible:false,
      btnLoading: false,
      form:{
        planContent: ''
      }
    }
  },
  computed:{
  },
  methods:{
    handleClose() {
      this.visible = false;
      this.resetForm('form');
    },
    handleOpen(){
      this.visible = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit(){
      this.btnLoading = true;
      savePlan(this.form).then(res=>{
        this.$message.success("保存成功！");
        this.handleClose();
        this.$emit('success')
      }).finally(()=>{
        this.btnLoading = false;
      })
    }
  },
  created() {
  }
}
</script>
<style scoped lang="less">

</style>
