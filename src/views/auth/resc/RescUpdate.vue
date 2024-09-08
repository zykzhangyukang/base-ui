<template>
  <el-dialog
      title="更新资源"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <span  v-loading="loading">
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
          <el-button type="primary"  @click="onSubmit" :loading="btnLoading">更新</el-button>
        </el-form-item>
      </el-form>
    </span>
  </el-dialog>
</template>
<script>

import {adminDomain, formatConst, getConst} from "@/utils";
import {getRescDetail, updateResc} from "@/api/resc";

export default {
  name: 'RescUpdate',
  components: {
  },
  data() {
    return {
      visible:false,
      btnLoading: false,
      loading: false,
      deptList: [],
      form:{
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
    async handleOpen(id) {
      this.visible = true;
      this.loading = true;
      getRescDetail(id).then(res => {
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
      updateResc(this.form).then(res=>{
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
