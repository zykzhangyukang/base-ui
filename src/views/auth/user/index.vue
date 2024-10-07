<template xmlns="http://www.w3.org/1999/html">
  <div class="table-user-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm" v-permission="['admin', 'editor']">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="searchForm.username" placeholder="用户账号"></el-input>
      </el-form-item>
      <el-form-item label="真实名称" prop="realName">
        <el-input v-model="searchForm.realName" placeholder="真实名称"></el-input>
      </el-form-item>
      <el-form-item label="用户状态" prop="userStatus">
        <el-select v-model="searchForm.userStatus" placeholder="用户状态" clearable>
          <el-option :label="userStatusGName[item.code]" v-for="item in userStatusG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button>
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-icon class="el-icon-setting"></el-icon>重置密码
            </el-dropdown-item>
            <el-dropdown-item command="updateUserRole">
              <el-icon class="el-icon-set-up"></el-icon>分配角色
            </el-dropdown-item>
            <el-dropdown-item command="switchUserLogin">
              <el-icon class="el-icon-turn-off"></el-icon>切换登录
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon class="el-icon-delete"></el-icon>批量删除
            </el-dropdown-item>
            <el-dropdown-item command="updateUserStatus">
              <el-icon class="el-icon-warning-outline"></el-icon>启用/禁用
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户账号"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="realName"
          label="真实名称"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="userStatus"
          label="用户状态"
          align="center"
          sortable
      >
        <template slot-scope="scope">
          <span style="color: #19be6b" v-if="scope.row.userStatus ===1 ">启用</span>
          <span style="color: #ed4014" v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          show-overflow-tooltip
          sortable
      >
        >
        <template slot-scope="scope">
          <span>
              {{scope.row.phone}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
          prop="deptName"
          label="所属部门"
          align="center"
          sortable
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
          <el-button  size="mini"  type="text"   @click="handeUpdate(scope.row.userId)">编辑</el-button>
          <el-button size="mini"   type="text"   @click="handeDel(scope.row.userId)">删除</el-button>
          <el-button size="mini"   type="text"    @click="handleUpdateRole(scope.row.userId)">分配角色</el-button>
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
    <user-add ref="addRef" @success="handAddSuccess"></user-add>
    <!-- 更新弹框-->
    <user-update ref="updateRef" @success="handUpdateSuccess"></user-update>
    <!-- 用户分配角色 -->
    <user-update-role ref="updateRoleRef" @success="handUpdateSuccess"></user-update-role>
  </div>
</template>

<script>
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import UserAdd from "@/views/auth/user/UserAdd.vue";
import UserUpdate from "@/views/auth/user/UserUpdate.vue";
import MyTable from '@/components/MyTable/index'
import UserUpdateRole from "@/views/auth/user/UserUpdateRole.vue";
import store from "@/store";
import {deleteUser, disableUser, enableUser, getUserPage} from "@/api/auth";

export default {
  name: 'UserList',
  components: {
    UserAdd,
    UserUpdate,
    MyTable,
    UserUpdateRole
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
        username: '',
        realName: '',
        userStatus: '',
        sortField: '',
        sortType: ''
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
  methods: {
    handleCommand(command){
      if(command === 'updateUserStatus'){
        return  this.handleUpdateUserStatus();
      }
      if(command === 'updateUserRole'){
        this.handleUpdateRole();
      }
      if(command === 'switchUserLogin'){
        this.handleSwitchUserLogin();
      }
    },
    handleSwitchUserLogin() {
      if (this.multipleSelection.length !== 1) {
        return this.$message.warning("请勾选一条记录进行操作！");
      }
      let rowData = this.multipleSelection[0];
      this.$confirm(`您确定要切换用户【${rowData.realName}】的账号登录吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const loading = this.$message.info({
          message: '切换登录中',
          iconClass: 'el-icon-loading',
          duration: 0
        })
        store.dispatch('user/SWITCH_USER_LOGIN', this.multipleSelection[0].username).then(res => {
          if(res.code === 200){
            window.location.reload();
          }
        }).finally(()=>{
          loading.close();
        })
      });
    },
    handleUpdateUserStatus(){
      if(this.multipleSelection.length !==1){
        return this.$message.warning("请勾选一条记录进行操作！");
      }
      let rowData = this.multipleSelection[0];
      let type = rowData.userStatus === 0 ? '启用' : '禁用';
      this.$confirm(`您是否要${type}(${rowData.realName})的账号?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(type === '启用'){
          enableUser(rowData.userId).then(res=>{
            this.$message({
              type: 'success',
              message: type+'成功!'
            });
            this.onSubmit();
          })
        }else if(type === '禁用'){
          disableUser(rowData.userId).then(res=>{
            this.$message({
              type: 'success',
              message: type+'成功!'
            });
            this.onSubmit();
          })
        }
      });
    },
    handleUpdateRole(userId){
      if(!userId){
        if(this.multipleSelection.length !==1){
          return this.$message.warning("请勾选一条记录进行操作！");
        }
        userId = this.multipleSelection[0].userId;
      }
      this.$refs.updateRoleRef.handleOpen(userId);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAdd(){
      this.$refs.addRef.handleOpen();
    },
    handeUpdate(id){
      this.$refs.updateRef.handleOpen(id);
    },
    handeDel(id){
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(res=>{
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
      getUserPage(this.searchForm).then(res => {
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
.roleList{
}
</style>
