<template>
  <el-dialog
      title="新增用户"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptCode">
        <el-select v-model="form.deptCode" placeholder="">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="userStatus">
        <el-radio v-model="form.userStatus" :label="userStatusGName[item.code]" v-for="item in userStatusG" :key="item.code"></el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="onSubmit">保存</el-button>
        <el-button type="info" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

import {adminDomain, formatConst, getConst} from "@/utils";

export default {
  props:['addModalVisible'],
  name: 'UserAdd',
  components: {
  },
  data() {
    return {
      visible:false,
      form:{
        username: '',
        password: '',
        deptCode: '',
        userStatus: null,
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
    handleOpen(){
      this.visible = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit(){

    }
  },
  created() {
  }
}
</script>
<style scoped lang="less">

</style>
