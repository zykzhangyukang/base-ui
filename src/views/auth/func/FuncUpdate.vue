<template>
  <el-dialog
      title="更新功能"
      :visible.sync="visible"
      width="35%"
      class="dialog-form"
      :before-close="handleClose"
      :close-on-click-modal="false"
  >
    <span v-loading="loading">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="功能名称" prop="funcName">
        <el-input v-model="form.funcName" clearable placeholder="功能名称"></el-input>
      </el-form-item>
      <el-form-item label="功能标识" prop="funcKey">
        <el-input v-model="form.funcKey" clearable placeholder="功能标识"></el-input>
      </el-form-item>
      <el-form-item label="功能类型" prop="funcType">
        <el-select v-model="form.funcType" placeholder="功能类型" clearable>
          <el-option :label="funcTypeGName[item.code]" v-for="item in funcTypeG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否可见" prop="hide" v-if="form.funcType === 'dir'">
        <el-radio v-model="form.hide" :label="item.code" v-for="item in funcHideG" :key="item.code" :value="item.code">{{ funcHideGName[item.code] }}</el-radio>
      </el-form-item>
      <el-form-item label="功能排序" prop="funcSort">
        <el-input-number v-model="form.funcSort" :min="0" :max="100" label="排序"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="btnLoading">保存</el-button>
        <el-button type="info" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
    </span>
    <el-divider>资源列表</el-divider>
    <el-select
        v-model="searchList"
        :multiple="false"
        filterable
        remote
        clearable
        reserve-keyword
        :style="{width: '100%', 'margin-bottom': '15px'}"
        placeholder="请输入资源url或资源名称进行搜索"
        :remote-method="remoteMethod"
        @change="searchSelect"
        :loading="searchLoading">
      <el-option
          v-for="item in options"
          :key="item.rescId"
          :label="`${item.rescUrl}   ${item.rescName} `"
          :value="item.rescId">
      </el-option>
    </el-select>
    <el-table
        :data="rescVOList"
        style="width: 100%">
      <el-table-column
          prop="rescName"
          label="资源名称"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="rescUrl"
          label="资源url"
          align="center"
          show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
          prop="rescDomain"
          label="所属系统"
          align="center"
      >
        <template slot-scope="scope">
          {{projectDomainGName[scope.row.rescDomain]}}
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          label="操作">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeFuncResc(scope.row.rescId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>

import {adminDomain, formatConst, getConst} from "@/utils";
import {getFuncDetail, updateFunc, updateFuncResc} from "@/api/func";
import {searchResc} from "@/api/resc";

export default {
  name: 'FuncUpdate',
  components: {},
  data() {
    return {
      visible: false,
      btnLoading: false,
      searchLoading: false,
      loading: false,
      searchList: [],
      options: [],
      deptList: [],
      rescVOList: [],
      form: {}
    }
  },
  computed: {
    funcHideG() {
      return getConst("func_hide_group", adminDomain)
    },
    funcHideGName() {
      return formatConst(this.funcHideG);
    },
    funcTypeG() {
      return getConst("func_type_group", adminDomain)
    },
    funcTypeGName() {
      return formatConst(this.funcTypeG);
    },
    projectDomainG(){
      return getConst("project_domain", adminDomain)
    },
    projectDomainGName(){
      return formatConst(this.projectDomainG);
    },
  },
  methods: {
    searchSelect: function (val) {
      if (!val) {
        return;
      }
      this.searchList = [];
      updateFuncResc({type: 'add', funcId: this.form.funcId, rescId: val}).then(res => {
        const one = this.options.find(e => e.rescId === val);
        if(one){
          this.rescVOList.push(one);
        }
        this.$message.success("添加成功");
      })
    },
    removeFuncResc(rescId){
      this.$confirm('此操作移除该功能的资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateFuncResc({type: 'remove', funcId: this.form.funcId, rescId: rescId}).then(res => {
          this.rescVOList = this.rescVOList.filter(obj => obj.rescId !== rescId);
          this.$message.success("移除成功");
        })
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true;
        searchResc(query).then(res=>{
          this.options = res.result;
        }).finally(()=>{
          this.searchLoading = false;
        })
      } else {
        this.options = [];
      }
    },
    handleClose() {
      this.visible = false;
      this.options = [];
      this.searchList = [];
      this.resetForm('form');
    },
    async handleOpen(id) {
      this.visible = true;
      this.loading = true;
      getFuncDetail(id).then(res => {
        this.form = res.result;
        this.rescVOList = res.result.rescVOList;
      }).finally(() => {
        this.loading = false;
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit() {
      this.btnLoading = true;
      updateFunc(this.form).then(res => {
        this.$message.success("更新成功！");
      }).finally(() => {
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
