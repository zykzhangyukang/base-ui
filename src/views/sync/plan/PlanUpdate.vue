<template>
  <el-dialog
      title="编辑计划"
      :visible.sync="visible"
      width="40%"
      class="dialog-form"
      :close-on-click-modal="false"
      :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="" label-position="top" v-loading="loading">
      <el-form-item label="" prop="planContent">
        <el-input v-model="form.planContent"  clearable type="textarea" :rows="12"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="onSubmit" :loading="btnLoading">保存</el-button>
        <el-button type="info" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>


import {getPlanContent, updatePlan} from "@/api/sync";

export default {
  name: 'RoleAdd',
  components: {
  },
  data() {
    return {
      loading: false,
      visible:false,
      btnLoading: false,
      form:{
      },
    }
  },
  computed:{
  },
  methods:{
    handleClose() {
      this.visible = false;
      this.resetForm('form');
    },
    handleOpen(uuid){
      this.visible = true;
      this.form.uuid = uuid;
      this.loading = true;
      getPlanContent(uuid).then(res=>{
        this.form = res.result;
      }).finally(()=>{
        this.loading = false;
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit(){
      this.btnLoading = true;
      updatePlan(this.form).then(res=>{
        this.$message.success("更新成功！");
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
