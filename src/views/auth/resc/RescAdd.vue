<template>
  <el-dialog
      title="新增资源"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="资源名称" prop="rescName">
        <el-input v-model="form.rescName"  clearable placeholder="资源名称"></el-input>
      </el-form-item>
      <el-form-item label="资源URL" prop="rescUrl">
        <el-input v-model="form.rescUrl"  clearable placeholder="资源URL"></el-input>
      </el-form-item>
      <el-form-item label="请求方式" prop="methodType">
        <el-select v-model="form.methodType" placeholder="请求方式" clearable>
          <el-option :label="methodTypeGName[item.code]" v-for="item in methodTypeG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属项目" prop="rescDomain">
        <el-select v-model="form.rescDomain" placeholder="请求方式" clearable>
          <el-option :label="projectDomainGName[item.code]" v-for="item in projectDomainG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="onSubmit" :loading="btnLoading">保存</el-button>
        <el-button type="info" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

import {saveResc} from "@/api/resc";
import {adminDomain, formatConst, getConst} from "@/utils";

export default {
  name: 'RescAdd',
  components: {
  },
  data() {
    return {
      visible:false,
      btnLoading: false,
      form:{
        rescName: '',
        rescUrl: '',
        methodType: '',
        rescDomain: ''
      }
    }
  },
  computed:{
    methodTypeG(){
      return getConst("method_type", adminDomain)
    },
    methodTypeGName(){
      return formatConst(this.methodTypeG);
    },
    projectDomainG(){
      return getConst("project_domain", adminDomain)
    },
    projectDomainGName(){
      return formatConst(this.projectDomainG);
    },
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
      saveResc(this.form).then(res=>{
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
