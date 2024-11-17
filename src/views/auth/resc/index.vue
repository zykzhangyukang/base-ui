<template xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
  <div class="table-resc-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="资源名称" prop="rescName">
        <el-input v-model="searchForm.rescName" placeholder="资源名称" ></el-input>
      </el-form-item>
      <el-form-item label="资源URL" prop="rescUrl">
        <el-input v-model="searchForm.rescUrl" placeholder="资源URL" ></el-input>
      </el-form-item>
      <el-form-item label="所属系统" prop="rescDomain">
        <el-select v-model="searchForm.rescDomain" placeholder="所属系统" clearable :style="{width:'180px'}">
          <el-option :label="projectDomainGName[item.code]" v-for="item in projectDomainG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
            :clearable="false"
            v-model="searchForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="请求方式" prop="methodType">
        <el-select v-model="searchForm.methodType" placeholder="请求方式" clearable :style="{width:'180px'}">
          <el-option :label="methodTypeGName[item.code]" v-for="item in methodTypeG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能标识" prop="funcKey">
        <el-input v-model="searchForm.funcKey" placeholder="功能标识" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" v-permission="'auth_resc_page'" :loading="loading">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd" v-permission="'auth_resc_add'">新增</el-button>
        <el-button plain @click="handleRefresh" :loading="refreshLoading" v-permission="'auth_resc_refresh'">刷新资源</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格栏 -->
    <my-table
        border
        ref="tableList"
        v-loading="tableLoading"
        :data="tableData"
        @sort-change="sortChange"
    >
      <el-table-column
          prop="rescName"
          label="资源名称"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="rescUrl"
          label="资源URL"
          align="left"
          sortable
      >
        <template slot-scope="scope">
           {{scope.row.rescUrl}}
        </template>
      </el-table-column>
      <el-table-column
          prop="rescDomain"
          label="所属项目"
          align="center"
          sortable
      >
        <template slot-scope="scope">
          <span>{{projectDomainGName[scope.row.rescDomain]}}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="methodType"
          label="方法类型"
          align="center"
          sortable
      >
        <template slot-scope="scope">
          <span>{{methodTypeGName[scope.row.methodType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          label="操作"
          width="180"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text"  @click="handleUpdate(scope.row.rescId)" v-permission="'auth_resc_update'">编辑</el-button>
          <el-button size="mini" type="text"  @click="handleDel(scope.row.rescId)" v-permission="'auth_resc_delete'">删除</el-button>
        </template>
      </el-table-column>
    </my-table>
    <!-- 分页栏 -->
    <div class="pagination-wrapper">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.currentPage"
          :page-sizes="[10, 15, 20, 50]"
          :page-size="searchForm.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total">
      </el-pagination>
    </div>
    <!-- 添加弹框 -->
    <resc-add ref="addRef" @success="handAddSuccess"></resc-add>
    <!-- 更新弹框-->
    <resc-update ref="updateRef" @success="handUpdateSuccess"></resc-update>
  </div>
</template>

<script>
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import RescAdd from "@/views/auth/resc/RescAdd.vue";
import RescUpdate from "@/views/auth/resc/RescUpdate.vue";
import MyTable from '@/components/MyTable/index'
import {deleteResc, getRescPage, refreshResc} from "@/api/auth";


export default {
  name: 'RescList',
  components: {
    RescAdd,
    RescUpdate,
    MyTable
  },
  data() {
    return {
      loading: false,
      refreshLoading: false,
      addModalVisible: false,
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      tableLoading: true,
      multipleSelection: [],
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        rescName: '',
        rescUrl: '',
        rescDomain: '',
        methodType: '',
        funcKey: '',
        startTime: null,
        endTime: null
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
  methods: {
    handleRefresh(){
      this.$confirm('刷新系统资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refreshLoading = true;
        refreshResc().then(res=>{
          this.$message.success("刷新资源成功！");
        }).finally(()=>{
          this.refreshLoading = false;
        })
      });
    },
    handleAdd(){
      this.$refs.addRef.handleOpen();
    },
    handleUpdate(id){
      this.$refs.updateRef.handleOpen(id);
    },
    handleDel(id){
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResc(id).then(res=>{
          this.$message.success("删除成功！");
          this.onSubmit();
        })
      });
    },
    handAddSuccess(){
      this.onSubmit();
    },
    handUpdateSuccess(){
      this.onSubmit();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit() {
      this.searchForm.currentPage = 1
      this.fetchData()
    },
    sortChange({prop, order }){
      if(order){
        this.searchForm.sortField = toLine(prop);
        this.searchForm.sortType = order === 'ascending' ? 'asc' : 'desc';
      }else {
        this.searchForm.sortField = '';
        this.searchForm.sortType = '';
      }
      this.fetchData();
    },
    fetchData() {
      this.tableLoading = true;
      this.loading = true;
      getRescPage(this.searchForm).then(res => {
        this.tableData = res.result.dataList;
        this.total = res.result.totalRow;
      }).finally(() => {
        this.tableLoading = false;
        this.loading = false;
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.searchForm.currentPage = val;
      this.fetchData();
    },
  },
  created() {
    this.fetchData();
  }
}
</script>
<style lang="less">
.pagination-wrapper{
  margin-top: 25px;
  .el-pagination{
    float: right;
  }
}
</style>
