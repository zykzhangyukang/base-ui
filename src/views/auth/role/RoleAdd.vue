<template>
  <el-dialog
      title="新增角色"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName"  clearable></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="form.roleDesc"  clearable type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="onSubmit" :loading="btnLoading">保存</el-button>
        <el-button type="info" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

import {saveRole} from "@/api/role";

export default {
  name: 'RoleAdd',
  components: {
  },
  data() {
    return {
      visible:false,
      btnLoading: false,
      deptList: [],
      form:{
        username: '',
        password: '',
        deptCode: '',
        realName: '',
        userStatus: 1,
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
      saveRole(this.form).then(res=>{
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
