<template xmlns="http://www.w3.org/1999/html">
  <div class="table-plan-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="计划编号" prop="planCode">
        <el-input v-model="searchForm.planCode" placeholder="计划编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="计划状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="计划状态" clearable >
          <el-option :label="planStatusGName[item.code]" v-for="item in planStatusG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="源数据库" prop="srcDb">
        <el-input v-model="searchForm.srcDb" placeholder="源数据库" clearable></el-input>
      </el-form-item>
      <el-form-item label="目标数据库" prop="destDb">
        <el-input v-model="searchForm.destDb" placeholder="目标数据库" clearable></el-input>
      </el-form-item>
      <el-form-item label="源系统" prop="srcProject">
        <el-select v-model="searchForm.srcProject" placeholder="源系统" clearable >
          <el-option :label="srcProjectGName[item.code]" v-for="item in srcProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标系统" prop="destProject">
        <el-select v-model="searchForm.destProject" placeholder="目标系统" clearable >
          <el-option :label="destProjectGName[item.code]" v-for="item in destProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" v-permission="'sync_plan_page'" :loading="loading">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd" v-permission="'sync_plan_add'">新增</el-button>
        <el-button plain  @click="handleRefresh" :loading="refreshLoading" v-permission="'sync_plan_refresh'">刷新缓存</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格栏 -->
    <my-table
        border
        stripe
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
          width="200px"
      >
      </el-table-column>
      <el-table-column
          prop="planCode"
          label="计划编号"
          sortable
          width="180px"
      >
        <template slot-scope="scope">
          <div class="ellipsis">
               <span  class="ellipsis-button link" @click="$refs.planContentRef.handleOpen(scope.row.planContent)">
                 {{scope.row.planCode}}
              </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="计划状态"
          align="center"
      >
        <template slot-scope="scope">
          <el-switch
              width="35"
              v-model="scope.row.status ==='normal' "
              active-color="#19be6b"
              @change="((val)=>{changeStatus(val,scope.row.uuid)})"
              >
          </el-switch>
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
      <el-table-column
          label="操作"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row.uuid)" v-permission="'sync_plan_update'">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDel(scope.row.uuid)" v-permission="'sync_plan_delete'">删除</el-button>
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
    <plan-add ref="addRef" @success="handAddSuccess"></plan-add>
    <!-- 更新弹框-->
    <plan-update ref="updateRef" @success="handUpdateSuccess"></plan-update>
    <!-- 查看内容 -->
    <plan-content ref="planContentRef"></plan-content>
  </div>
</template>

<script>
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import PlanAdd from "@/views/sync/plan/PlanAdd.vue";
import PlanContent from "@/views/sync/plan/PlanContent.vue";
import PlanUpdate from "@/views/sync/plan/PlanUpdate.vue";
import MyTable from '@/components/MyTable/index'
import {deletePlan, getPlanPage, refreshPlan, updatePlanStatus} from "@/api/sync";

export default {
  name: 'SyncPlan',
  components: {
    PlanAdd,
    PlanContent,
    PlanUpdate,
    MyTable
  },
  data() {
    return {
      loading: false,
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
        srcDb: '',
        destDb: ''
      },
      refreshLoading: false,
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
    changeStatus(status, uuid) {
      let msg = status ? '启用' : '禁用';
      this.$confirm('此操作将' + msg + '该同步计划, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updatePlanStatus({uuid: uuid, status: status ? 'normal' : 'forbid'}).then(res => {
          this.$message.success(msg + "成功！");
          this.onSubmit();
        })
      });
    },
    handleDel(uuid){
      this.$confirm('此操作将删除该同步计划, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePlan(uuid).then(res=>{
          this.$message.success("删除成功！");
          this.onSubmit();
        })
      });
    },
    handleRefresh(){
      this.$confirm('是否刷新同步计划缓存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refreshLoading = true;
        refreshPlan().then(res => {
          this.$message.success("刷新缓存成功！");
        }).finally(()=>{
          this.refreshLoading = false;
        })
      });
    },
    handleAdd(){
      this.$refs.addRef.handleOpen();
    },
    handleUpdate(uuid){
      this.$refs.updateRef.handleOpen(uuid);
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
      this.loading = true;
      this.tableLoading = true;
      getPlanPage(this.searchForm).then(res => {
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
<style lang="less" scoped>
.pagination-wrapper{
  margin-top: 25px;
  .el-pagination{
    float: right;
  }
}
/* 容器和按钮均需要设置省略号效果 */
.ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-button {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.link{
  color: #2d8cf0;
  cursor: pointer;
}
</style>
