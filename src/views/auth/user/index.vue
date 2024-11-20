<template xmlns="http://www.w3.org/1999/html">
  <div class="table-user-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="searchForm.username" placeholder="用户账号" ></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-select v-model="searchForm.deptId" placeholder="所属部门">
          <el-option v-for="item in deptList" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="真实名称" prop="realName">
        <el-input v-model="searchForm.realName" placeholder="真实名称" ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="searchForm.phone" placeholder="手机号" ></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="searchForm.email" placeholder="邮箱地址" ></el-input>
      </el-form-item>
      <el-form-item label="用户状态" prop="userStatus">
        <el-select v-model="searchForm.userStatus" placeholder="用户状态" clearable>
          <el-option :label="userStatusGName[item.code]" v-for="item in userStatusG" :value="item.code" :key="item.code"></el-option>
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" v-permission="'auth_user_page'" :loading="loading">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleAdd" v-permission="'auth_user_add'">新增</el-button>
        <el-button @click="handExcel" v-permission="'auth_user_export'" :loading="downloadLoading">列表导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button>
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-permission="'auth_user_pwd_update'">
              <el-icon class="el-icon-setting"></el-icon>重置密码
            </el-dropdown-item>
            <el-dropdown-item command="updateUserRole" v-permission="'auth_user_role_update'">
              <el-icon class="el-icon-set-up"></el-icon>分配角色
            </el-dropdown-item>
            <el-dropdown-item command="switchUserLogin" v-permission="'auth_user_switch_login'">
              <el-icon class="el-icon-turn-off"></el-icon>切换登录
            </el-dropdown-item>
            <el-dropdown-item command="updateUserStatus" v-permission="'auth_user_update_status'">
              <el-icon class="el-icon-warning-outline"></el-icon>启用/禁用
            </el-dropdown-item>
            <el-dropdown-item command="exportUserList" v-permission="'auth_user_export'">
              <el-icon  class="el-icon-document"></el-icon>列表导出
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
          <el-tag :type="scope.row.userStatus ===1 ? 'success' : 'danger'" size="mini">{{userStatusGName[scope.row.userStatus]}}</el-tag>
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
              {{scope.row.phone}} <el-button type="text" size="mini" @click="lookPhone(scope.row)" :loading="scope.row.phoneLoading" icon="el-icon-view">查看</el-button>
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
          prop="email"
          label="邮箱地址"
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
          width="220px"
      >
        <template slot-scope="scope">
          <el-button  size="mini"  type="text"   @click="handeUpdate(scope.row.userId)" v-permission="'auth_user_update'">编辑</el-button>
          <el-button size="mini"   type="text"   @click="handeDel(scope.row.userId)" v-permission="'auth_user_delete'">删除</el-button>
          <el-button size="mini"   type="text"    @click="handleUpdateRole(scope.row.userId)" v-permission="'auth_user_role_update'">分配角色</el-button>
          <el-button size="mini"   type="text"    @click="handleSwitchUserLogin(scope.row)" v-permission="'auth_user_switch_login'">切换登录</el-button>
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
import UserAdd from "@/views/auth/user/UserAdd.vue";
import UserUpdate from "@/views/auth/user/UserUpdate.vue";
import MyTable from '@/components/MyTable/index'
import UserUpdateRole from "@/views/auth/user/UserUpdateRole.vue";
import store from "@/store";
import {
  deleteUser,
  disableUser,
  enableUser,
  exportUserList,
  getUserDeptList,
  getUserPage,
  getUserPhone
} from "@/api/auth";
import NProgress from "nprogress";

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
      loading: false,
      downloadLoading: false,
      addModalVisible: false,
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      tableLoading: true,
      multipleSelection: [],
      deptList: [],
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        username: '',
        realName: '',
        userStatus: '',
        sortField: '',
        sortType: '',
        phone: '',
        email: '',
        startTime: null,
        endTime: null
      }
    }
  },
  computed:{
    userStatusG(){
      return this.$getConst("user_status_group")
    },
    userStatusGName(){
      return this.$formatConst(this.userStatusG);
    }
  },
  methods: {
    lookPhone(row){
      this.$set(row, 'phoneLoading', true);
      getUserPhone(row.userId).then(async res => {
        await this.$alert(
            res.result,
            '用户手机号',
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              type: 'warning',
            }
        ).catch(e=>{
        });
      }).finally(()=>{
        this.$set(row, 'phoneLoading', false);
      })
    },
    handleCommand(command) {
      if (command === 'updateUserStatus') {
        return this.handleUpdateUserStatus();
      }
      if (command === 'updateUserRole') {
        this.handleUpdateRole();
      }
      if (command === 'switchUserLogin') {
        this.handleSwitchUserLogin();
      }
      if (command === 'exportUserList') {
        this.handExcel();
      }
    },
    handleSwitchUserLogin(rowData) {
      if(!rowData){
        if (this.multipleSelection.length !== 1) {
          return this.$message.warning("请勾选一条记录进行操作！");
        }
        rowData = this.multipleSelection[0];
      }
      this.$confirm(`您确定要切换用户“${rowData.realName}”的账号登录吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success({
          message: ' 切换登录中',
          iconClass: 'el-icon-loading',
          duration: 1000,
          onClose: function () {
            store.dispatch('user/SWITCH_USER_LOGIN', rowData.username).then(res => {
              if (res.code === 200) {
                window.location.reload();
              }
            })
          }
        })
      }).catch(e=>{});
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
    handExcel() {
      this.downloadLoading = true;
      NProgress.start();
      exportUserList(this.searchForm).then(res=>{
        this.$exportXlsx(res.data, 'xlsx', '用户列表')
      }).finally(()=>{
        this.downloadLoading = false;
        NProgress.done();
      });
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
        this.searchForm.sortField = this.$toLine(prop);
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
      getUserPage(this.searchForm).then(res => {
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
    getUserDeptList().then(res=>{
      this.deptList = res.result;
    })
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
