<template xmlns="http://www.w3.org/1999/html">
  <div class="table-log-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="日志模块" prop="logModule">
        <el-select v-model="searchForm.logModule" placeholder="日志模块" clearable>
          <el-option :label="logModuleGName[item.code]" v-for="item in logModuleG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日志等级" prop="logLevel">
        <el-select v-model="searchForm.logLevel" placeholder="日志等级" clearable>
          <el-option :label="logLevelGName[item.code]" v-for="item in logLevelG" :value="item.code" :key="item.code"></el-option>
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
      <el-form-item label="IP地址" prop="ipAddress">
        <el-input v-model="searchForm.ipAddress" placeholder="IP地址" ></el-input>
      </el-form-item>
      <el-form-item label="设备信息" prop="deviceInfo">
        <el-input v-model="searchForm.deviceInfo" placeholder="设备信息" ></el-input>
      </el-form-item>
      <el-form-item label="操作人" prop="realName">
        <el-input v-model="searchForm.realName" placeholder="操作人" ></el-input>
      </el-form-item>
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="searchForm.username" placeholder="用户账号" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" :loading="loading">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
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
          prop="logInfo"
          label="日志信息"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="realName"
          label="操作人"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="logModule"
          label="日志模块"
          align="center"
          sortable
      >
        <template  slot-scope="scope">
          {{logModuleGName[scope.row.logModule]}}
        </template>
      </el-table-column>
      <el-table-column
          prop="logLevel"
          label="日志等级"
          align="center"
          sortable
      >
        <template  slot-scope="scope">
          {{logLevelGName[scope.row.logLevel]}}
        </template>
      </el-table-column>
      <el-table-column
          prop="deviceInfo"
          label="设备信息"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="ipAddress"
          label="IP地址"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="location"
          label="IP归属地"
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
  </div>
</template>

<script>
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import MyTable from '@/components/MyTable/index'
import {getLogPage} from "@/api/auth";

export default {
  name: 'LogList',
  components: {
    MyTable
  },
  data() {
    return {
      loading: false,
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      tableLoading: true,
      searchForm: {
        startTime: null,
        endTime: null,
        currentPage: 1,
        pageSize: 20,
        logModule: '',
        logLevel: '',
        ipAddress: '',
        deviceInfo: '',
        realName: ''
      }
    }
  },
  computed:{
    logModuleG(){
      return getConst("log_module_group", adminDomain)
    },
    logModuleGName(){
      return formatConst(this.logModuleG);
    },
    logLevelG(){
      return getConst("log_level_group", adminDomain)
    },
    logLevelGName(){
      return formatConst(this.logLevelG);
    },
  },
  methods: {
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
      getLogPage(this.searchForm).then(res => {
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
<style lang="less">
.pagination-wrapper{
  margin-top: 25px;
  .el-pagination{
    float: right;
  }
}
</style>
