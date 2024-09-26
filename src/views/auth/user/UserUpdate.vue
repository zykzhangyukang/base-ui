<template>
  <el-dialog
      title="编辑用户"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <span  v-loading="loading">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户账号" prop="username" >
          <el-input v-model="form.username"  placeholder="用户账号" clearable readonly disabled></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="真实姓名"  clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="联系方式"  clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="form.email" placeholder="邮箱地址"  clearable></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="form.deptId" placeholder="所属部门">
            <el-option v-for="item in deptList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="userStatus">
          <el-radio v-model="form.userStatus" :label="item.code" v-for="item in userStatusG" :key="item.code" :value="item.code">{{userStatusGName[item.code]}}</el-radio>
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
import {getUserDeptList} from "@/api/dept";
import {getUserDetail, updateUser} from "@/api/user";

export default {
  name: 'UserUpdate',
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
    userStatusG(){
      return getConst("user_status_group", adminDomain)
    },
    userStatusGName(){
      return formatConst(this.userStatusG);
    }
  },
  methods:{
    handleClose() {
      this.visible = false;
      this.resetForm('form');
    },
    async handleOpen(id){
      this.visible = true;
      this.loading = true;
      try {
        await getUserDetail(id).then(res=>{
          this.form = res.result;
        })
        await getUserDeptList().then(res=>{
          this.deptList = res.result;
        });
      }finally {
        this.loading = false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit(){
      this.btnLoading = true;
      updateUser(this.form).then(res=>{
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
