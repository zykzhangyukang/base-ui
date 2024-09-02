<template xmlns="http://www.w3.org/1999/html">
  <div class="table-resc-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="资源名称" prop="rescName">
        <el-input v-model="searchForm.rescName" placeholder="资源名称"></el-input>
      </el-form-item>
      <el-form-item label="资源URL" prop="rescUrl">
        <el-input v-model="searchForm.rescUrl" placeholder="资源URL"></el-input>
      </el-form-item>
      <el-form-item label="所属系统" prop="rescDomain">
        <el-select v-model="searchForm.rescDomain" placeholder="所属系统" clearable>
          <el-option :label="projectDomainGName[item.code]" v-for="item in projectDomainG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求方式" prop="methodType">
        <el-select v-model="searchForm.methodType" placeholder="请求方式" clearable>
          <el-option :label="methodTypeGName[item.code]" v-for="item in methodTypeG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格栏 -->
    <el-table
        border
        ref="tableList"
        v-loading="tableLoading"
        :data="tableData"
        @sort-change="sortChange"
        style="width: 100%"
        :height="tableHeight"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="rescName"
          label="资源名称"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="rescUrl"
          label="资源URL"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="rescDomain"
          label="所属项目"
          align="center"
      >
        <template slot-scope="scope">
          <span>{{projectDomainGName[scope.row.rescDomain]}}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="methodType"
          label="方法类型"
          align="center"
      >
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
          align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit-outline" @click="handeUpdate(scope.row.roleId)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm
              title="您确定要删除该资源吗？"
              @confirm="handeDel(scope.row.roleId)">
            <el-button slot="reference"  type="text" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
    <role-add ref="addRef" @success="handAddSuccess"></role-add>
    <!-- 更新弹框-->
    <role-update ref="updateRef" @success="handUpdateSuccess"></role-update>
  </div>
</template>

<script>
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import RoleAdd from "@/views/auth/role/RoleAdd.vue";
import RoleUpdate from "@/views/auth/role/RoleUpdate.vue";
import {deleteRole, getRolePage} from "@/api/role";
import {getRescPage} from "@/api/resc";

export default {
  components: {
    RoleAdd,
    RoleUpdate
  },
  data() {
    return {
      addModalVisible: false,
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableHeight: 0,
      tableData: [],
      tableLoading: true,
      multipleSelection: [],
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        rescName: '',
        rescUrl: '',
        rescDomain: '',
        methodType: ''
      }
    }
  },
  mounted() {
    this.resetTableHeight();
    window.onresize = this.resetTableHeight;
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
    handleAdd(){
      this.$refs.addRef.handleOpen();
    },
    handeUpdate(id){
      this.$refs.updateRef.handleOpen(id);
    },
    handeDel(id){
      deleteRole(id).then(res=>{
        this.$message.success("删除成功！");
        this.onSubmit();
      })
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
      this.searchForm.sortField = toLine(prop);
      this.searchForm.sortType = order === 'ascending' ? 'asc' : 'desc';
      this.fetchData();
    },
    fetchData() {
      this.tableLoading = true;
      getRescPage(this.searchForm).then(res => {
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
    resetTableHeight(){
      this.$nextTick(()=>{
        let tableDom = this.$refs.tableList.$el;
        let top  = tableDom.getBoundingClientRect().top;
        let bottom = 100;
        this.tableHeight = window.innerHeight - top -bottom;
      })
    }
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
