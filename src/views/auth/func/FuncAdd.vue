<template>
  <el-dialog
      title="新增功能"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="上级功能" prop="funcParentName" v-if="parentNode">
        <el-input v-model="parentNode.funcName"  disabled readonly placeholder="上级功能"></el-input>
      </el-form-item>
      <el-form-item label="功能名称" prop="funcName">
        <el-input v-model="form.funcName"   placeholder="功能名称"></el-input>
      </el-form-item>
      <el-form-item label="功能标识" prop="funcKey">
        <el-input v-model="form.funcKey"   placeholder="功能标识"></el-input>
      </el-form-item>
      <el-form-item label="功能类型" prop="funcType">
        <el-select v-model="form.funcType" placeholder="功能类型" clearable>
          <el-option :label="funcTypeGName[item.code]" v-for="item in funcTypeG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否可见" prop="hide" v-if="form.funcType === 'dir'">
        <el-radio v-model="form.hide" :label="item.code" v-for="item in funcHideG" :key="item.code" :value="item.code">{{funcHideGName[item.code]}}</el-radio>
      </el-form-item>
      <el-form-item label="功能排序" prop="funcSort">
        <el-input-number v-model="form.funcSort" :min="0" :max="100"  label="排序"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="onSubmit" :loading="btnLoading">保存</el-button>
        <el-button type="info" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

  import {adminDomain, formatConst, getConst} from "@/utils";
  import {saveFunc} from "@/api/auth";
  export default {
  name: 'FuncAdd',
  components: {
  },
  data() {
    return {
      visible:false,
      btnLoading: false,
      parentNode: null,
      form:{
        funcName: '',
        funcKey: '',
        funcType: '',
        funcSort: 0,
        hide: 0
      }
    }
  },
  computed:{
    funcHideG(){
      return getConst("func_hide_group", adminDomain)
    },
    funcHideGName(){
      return formatConst(this.funcHideG);
    },
    funcTypeG(){
      return getConst("func_type_group", adminDomain)
    },
    funcTypeGName(){
      return formatConst(this.funcTypeG);
    },
  },
  methods:{
    handleClose() {
      this.visible = false;
      this.resetForm('form');
    },
    handleOpen(node){
      this.parentNode  = node;
      this.visible = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit(){
      this.btnLoading = true;
      if(this.parentNode && this.parentNode.funcId){
        this.form.parentId = this.parentNode.funcId;
      }
      saveFunc(this.form).then(res=>{
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
