<template xmlns="http://www.w3.org/1999/html">
  <div class="table-user-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="searchForm.roleName" placeholder="角色名称"></el-input>
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
        height="600"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="roleDesc"
          label="角色描述"
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
              title="您确定要删除该角色吗？"
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
import {toLine} from "@/utils";
import RoleAdd from "@/views/auth/role/RoleAdd.vue";
import RoleUpdate from "@/views/auth/role/RoleUpdate.vue";
import {deleteRole, getRolePage} from "@/api/role";

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
      tableData: [],
      tableLoading: true,
      multipleSelection: [],
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        roleName: '',
        roleDesc: '',
      }
    }
  },
  computed:{
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
      getRolePage(this.searchForm).then(res => {
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
    }
  },
  created() {
    this.fetchData();
  }
}
</script>
<style lang="less">
.user-wrapper {
  margin-top: 20px;
}
.pagination-wrapper{
  margin-top: 25px;
  .el-pagination{
    float: right;
  }
}
</style>
