<template xmlns="http://www.w3.org/1999/html">
  <div class="table-plan-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="计划编号" prop="planCode">
        <el-input v-model="searchForm.planCode" placeholder="计划编号"></el-input>
      </el-form-item>
      <el-form-item label="计划状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="计划状态" clearable :style="{width : '180px'}">
          <el-option :label="planStatusGName[item.code]" v-for="item in planStatusG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="源系统" prop="srcProject">
        <el-select v-model="searchForm.srcProject" placeholder="源系统" clearable :style="{width : '180px'}">
          <el-option :label="srcProjectGName[item.code]" v-for="item in srcProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标系统" prop="destProject">
        <el-select v-model="searchForm.destProject" placeholder="目标系统" clearable :style="{width : '180px'}">
          <el-option :label="destProjectGName[item.code]" v-for="item in destProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格栏 -->
    <my-table
        border
        ref="tableList"
        v-loading="tableLoading"
        :data="tableData"
        @sort-change="sortChange"
        style="width: 100%"
    >
      <el-table-column
          prop="description"
          label="描述信息"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="planCode"
          label="计划编号"
          align="center"
          sortable
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini">{{scope.row.planCode}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="计划状态"
          align="center"
      >
        <template slot-scope="scope">
          <span style="color: #19be6b" v-if="scope.row.status ==='normal' ">启用</span>
          <span style="color: #ed4014" v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="srcDb"
          label="源数据库"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="destDb"
          label="目标数据库"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="srcProject"
          label="源系统"
          align="center"
      >
        <template slot-scope="scope">
          {{srcProjectGName[scope.row.srcProject]}}
        </template>
      </el-table-column>
      <el-table-column
          prop="destProject"
          label="目标系统"
          align="center"
      >
        <template slot-scope="scope">
          {{destProjectGName[scope.row.destProject]}}
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
    <plan-add ref="addRef" @success="handAddSuccess"></plan-add>
    <!-- 更新弹框-->
    <role-update ref="updateRef" @success="handUpdateSuccess"></role-update>
  </div>
</template>

<script>
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import PlanAdd from "@/views/sync/plan/PlanAdd.vue";
import RoleUpdate from "@/views/auth/role/RoleUpdate.vue";
import MyTable from '@/components/MyTable/index'
import {deleteRole} from "@/api/auth";
import {getPlanPage} from "@/api/sync";

export default {
  components: {
    PlanAdd,
    RoleUpdate,
    MyTable
  },
  data() {
    return {
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
        planCode: '',
        status: '',
        srcProject: '',
        destProject: '',
      }
    }
  },
  computed:{
    srcProjectG(){
      return getConst("src_project",adminDomain)
    },
    srcProjectGName(){
      return formatConst(this.srcProjectG)
    },
    destProjectG(){
      return getConst("dest_project",adminDomain)
    },
    destProjectGName(){
      return formatConst(this.destProjectG)
    },
    planStatusG(){
      return getConst("plan_status",adminDomain)
    },
    planStatusGName(){
      return formatConst(this.planStatusG)
    },
  },
  methods: {
    handleAdd(){
      this.$refs.addRef.handleOpen();
    },
    handeUpdate(id){
      this.$refs.updateRef.handleOpen(id);
    },
    handeDel(id){
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(id).then(res=>{
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
      getPlanPage(this.searchForm).then(res => {
        this.tableData = res.result.dataList;
        this.total = res.result.totalRow;
      }).finally(() => {
        this.tableLoading = false;
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
.userVOList{
}
</style>
