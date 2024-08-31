<template xmlns="http://www.w3.org/1999/html">
  <div class="user-wrapper">
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label="用户账号">
        <el-input v-model="searchForm.username" placeholder="用户账号"></el-input>
      </el-form-item>
      <el-form-item label="真实名称">
        <el-input v-model="searchForm.realName" placeholder="真实名称"></el-input>
      </el-form-item>
      <el-form-item label="用户状态">
        <el-select v-model="searchForm.userStatus" placeholder="用户状态">
          <el-option label="启用" value="启用"></el-option>
          <el-option label="禁用" value="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchDataList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        border
        ref="tableList"
        v-loading="tableLoading"
        :data="tableList"
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
      >
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="lastLoginTime"
          label="最近登录时间"
          align="center"
      >
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import {getUserPage} from "@/api/user";

export default {
  data() {
    return {
      tableList: [],
      tableLoading: true,
      multipleSelection: [],
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        username: '',
        realName: '',
        userStatus: ''
      }
    }
  },
  methods: {
    fetchDataList() {
      this.tableLoading = true;
      getUserPage(this.searchForm).then(res => {
        this.tableList = res.result.dataList;
      }).finally(() => {
        this.tableLoading = false;
      })
    },
  },
  created() {
    this.fetchDataList();
  }
}
</script>
<style lang="less">
.user-wrapper {
  margin-top: 20px;
}
</style>
