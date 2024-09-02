<template>
  <el-dialog
      title="编辑角色"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <span  v-loading="loading">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户账号" prop="roleName" >
          <el-input v-model="form.roleName"  clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"  clearable  type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="onSubmit" :loading="btnLoading">更新</el-button>
        </el-form-item>
      </el-form>
    </span>
  </el-dialog>
</template>
<script>

import {getRoleDetail, updateRole} from "@/api/role";

export default {
  name: 'RoleUpdate',
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
  },
  methods:{
    handleClose() {
      this.visible = false;
      this.resetForm('form');
    },
    async handleOpen(id) {
      this.visible = true;
      this.loading = true;
      getRoleDetail(id).then(res => {
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
      updateRole(this.form).then(res=>{
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
