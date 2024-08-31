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
    </el-form>
    <!-- 表格栏 -->
    <el-table
        border
        ref="tableList"
        v-loading="tableLoading"
        :data="tableData"
        @sort-change="sortChange"
        style="width: 100%"
        max-height="250"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="userId"
          label="用户编号"
          align="center"
      >
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
      >
      </el-table-column>
      <el-table-column
          prop="deptName"
          label="所属部门"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="userStatus"
          label="用户状态"
          align="center"
      >
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.userStatus === 1"
              active-color="#13ce66"
              inactive-color="#ff4949"
          >
          </el-switch>
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
    <user-add ref="userAddRef"></user-add>
  </div>
</template>

<script>
import {getUserPage} from "@/api/user";
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import UserAdd from "@/views/auth/user/UserAdd.vue";

export default {
  components: {
    UserAdd
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
    handleAdd(){
      this.$refs.userAddRef.handleOpen();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit() {
      this.searchForm.currentPage = 1
      this.fetchData()
    },
    sortChange({ column, prop, order }){
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
