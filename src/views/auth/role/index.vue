<template xmlns="http://www.w3.org/1999/html">
  <div class="table-role-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="searchForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" v-permission="'auth_role_page'">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd" v-permission="'auth_role_add'">新增</el-button>
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
          prop="userVOList"
          label="用户列表"
          align="center"
      >
        <template slot-scope="scope">
          <span class="userVOList">{{scope.row.userVOList.map(e=>e.realName).join(',') || '暂未分配'}}</span>
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
          <el-button size="mini" type="text" @click="handleUpdate(scope.row.roleId)" v-permission="'auth_role_update'">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDel(scope.row.roleId)" v-permission="'auth_role_delete'">删除</el-button>
          <el-button size="mini" type="text" @click="$router.push(`/auth/role/func/${scope.row.roleId}`)">分配功能</el-button>
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
    <role-add ref="addRef" @success="handAddSuccess"></role-add>
    <!-- 更新弹框-->
    <role-update ref="updateRef" @success="handUpdateSuccess"></role-update>
    <!-- 角色分配用户 -->
    <role-update-user ref="updateUserRef" @success="handUpdateSuccess"></role-update-user>
  </div>
</template>

<script>
import {toLine} from "@/utils";
import RoleAdd from "@/views/auth/role/RoleAdd.vue";
import RoleUpdate from "@/views/auth/role/RoleUpdate.vue";
import RoleUpdateUser from "@/views/auth/role/RoleUpdateUser.vue";
import MyTable from '@/components/MyTable/index'
import {deleteRole, getRolePage} from "@/api/auth";

export default {
  name: 'RoleList',
  components: {
    RoleAdd,
    RoleUpdate,
    RoleUpdateUser,
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
    handleUpdate(id){
      this.$refs.updateRef.handleOpen(id);
    },
    handleUpdateUser(id){
      this.$refs.updateUserRef.handleOpen(id);
    },
    handleDel(id){
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
