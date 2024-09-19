<template xmlns="http://www.w3.org/1999/html">
  <div class="table-user-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
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
        <el-dropdown>
          <el-button>
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-icon class="el-icon-setting"></el-icon>重置密码
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon class="el-icon-set-up"></el-icon>分配角色
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon class="el-icon-turn-off"></el-icon>切换登录
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon class="el-icon-delete"></el-icon>批量删除
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="handeStatus"><el-icon class="el-icon-warning-outline"></el-icon>启用/禁用</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
          <el-tag :type="scope.row.userStatus ===1 ? 'success' : 'danger'">{{userStatusGName[scope.row.userStatus]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="roleList"
          label="角色列表"
          align="center"
          show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.roleList.map(e=>e.roleName).join(',') || '暂未分配'}}
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
          <el-button type="text" icon="el-icon-edit-outline" @click="handeUpdate(scope.row.userId)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handeDel(scope.row.userId)">删除</el-button>
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
    <user-add ref="addRef" @success="handAddSuccess"></user-add>
    <!-- 更新弹框-->
    <user-update ref="updateRef" @success="handUpdateSuccess"></user-update>
  </div>
</template>

<script>
import {deleteUser, disableUser, enableUser, getUserPage} from "@/api/user";
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import UserAdd from "@/views/auth/user/UserAdd.vue";
import UserUpdate from "@/views/auth/user/UserUpdate.vue";

export default {
  components: {
    UserAdd,
    UserUpdate
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
  mounted() {
    this.resetTableHeight();
    window.onresize = this.resetTableHeight;
  },
  methods: {
    handeStatus(){
      const data = this.$refs.tableList.selection;
      if(data.length === 0){
        return this.$message.warning("请勾选记录后进行操作！");
      }
      if(data.length !==1){
        return this.$message.warning("只支持勾选一条记录操作！");
      }
      let rowData = data[0];
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
      this.searchForm.sortField = toLine(prop);
      this.searchForm.sortType = order === 'ascending' ? 'asc' : 'desc';
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
