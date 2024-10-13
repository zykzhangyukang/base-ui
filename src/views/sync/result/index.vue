<template xmlns="http://www.w3.org/1999/html">
  <div class="table-result-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
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
            placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划编号" prop="planCode">
        <el-input v-model="searchForm.planCode" placeholder="计划编号" :style="{width : '180px'}"></el-input>
      </el-form-item>
      <el-form-item label="源系统" prop="srcProject">
        <el-select v-model="searchForm.srcProject" placeholder="源系统" clearable :style="{width : '180px'}">
          <el-option :label="srcProjectGName[item.code]" v-for="item in srcProjectG" :value="item.code" :key="item.code" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标系统" prop="destProject">
        <el-select v-model="searchForm.destProject" placeholder="目标系统" clearable :style="{width : '180px'}">
          <el-option :label="destProjectGName[item.code]" v-for="item in destProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="同步状态" prop="syncStatus">
        <el-select v-model="searchForm.syncStatus" placeholder="同步状态" clearable :style="{width : '180px'}">
          <el-option :label="resultStatusGName[item.code]" v-for="item in resultStatusG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息来源" prop="msgSrc">
        <el-select v-model="searchForm.msgSrc" placeholder="消息来源" clearable :style="{width : '180px'}">
          <el-option :label="msgSrcGName[item.code]" v-for="item in msgSrcG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重试次数" prop="repeatCount">
        <el-select v-model="searchForm.repeatCount" placeholder="重试次数" clearable :style="{width : '180px'}">
          <el-option :label="repeatCountGName[item.code]" v-for="item in repeatCountG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索关键词" prop="keywords" >
        <el-input v-model="searchForm.keywords" placeholder="计划名称，消息内容，同步内容" :style="{width : '250px'}"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" :loading="searchLoading">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button plain @click="handleRepeatSync" :loading="repeatSyncLoading">重新同步</el-button>
        <el-button plain @click="handleSignSuccess" :loading="signSuccessLoading">标记成功</el-button>
        <el-button plain @click="handleValidResultData">数据校验</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格栏 -->
    <my-table
        fit
        stripe
        border
        ref="tableList"
        v-loading="tableLoading"
        :data="tableData"
        @sort-change="sortChange"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"  label="选择" align="center"></el-table-column>
      <el-table-column
          prop="planCode"
          label="计划编号"
          width="180px"
          show-overflow-tooltip
      >
        <template slot-scope="scope">
          <a  style="color: #2d8cf0" @click="$refs.planContentRef.handleOpen(scope.row.planUuid)">{{scope.row.planCode}}</a>
        </template>
      </el-table-column>
      <el-table-column
          prop="planName"
          label="计划名称"
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
          prop="msgSrc"
          label="消息来源"
          align="center"
      >
        <template slot-scope="scope">
          {{msgSrcGName[scope.row.msgSrc]}}
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="同步状态"
          align="center"
      >
        <template slot-scope="scope">
          <a :title="scope.row.errorMsg" :class="[scope.row.status === 'success' ?'success':'fail']">{{resultStatusGName[scope.row.status] }}</a> <small>{{' ('+((new Date(scope.row.syncTime).getTime())  - (new Date(scope.row.msgCreateTime).getTime()) ) / 1000+'s)'}}</small>
        </template>
      </el-table-column>
      <el-table-column
          prop="hlsSyncContent"
          label="同步内容"
          align="center"
          width="150px"
      >
        <template  slot-scope="scope">
          <div class="ellipsis">
            <span  class="ellipsis-button" v-html="scope.row.hlsSyncContent || scope.row.syncContent" @click="$refs.syncContentRef.handleOpen(scope.row.syncContent)">
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="hlsMsgContent"
          label="消息内容"
          align="center"
      >
        <template  slot-scope="scope">
          <div class="ellipsis">
             <span  class="ellipsis-button" v-html="scope.row.hlsMsgContent || scope.row.msgContent" @click="$refs.msgContentRef.handleOpen(scope.row.msgContent)">
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="repeatCount"
          label="重试次数"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="msgCreateTime"
          label="创建时间"
          align="center"
          width="180px"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="syncTime"
          label="同步时间"
          align="center"
          width="180px"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注内容"
          align="center"
          show-overflow-tooltip
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
    <!-- 查看内容 -->
    <plan-content ref="planContentRef"></plan-content>
    <!-- 查看同步内容 -->
    <sync-content ref="syncContentRef"></sync-content>
    <!-- 查看同步内容 -->
    <msg-content ref="msgContentRef"></msg-content>
    <!-- 数据校验 -->
    <valid-result ref="validResultRef"></valid-result>
  </div>
</template>

<script>
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import PlanAdd from "@/views/sync/plan/PlanAdd.vue";
import PlanContent from "@/views/sync/plan/PlanContent.vue";
import PlanUpdate from "@/views/sync/plan/PlanUpdate.vue";
import MyTable from '@/components/MyTable/index'

import {getResultPage, repeatSync, signSuccess} from "@/api/sync";
import SyncContent from "@/views/sync/result/SyncContent.vue";
import MsgContent from "@/views/sync/result/MsgContent.vue";
import ValidResult from "@/views/sync/result/ValidResult.vue";

export default {
  name: 'SyncResult',
  components: {
    ValidResult,
    SyncContent,
    MsgContent,
    PlanAdd,
    PlanContent,
    PlanUpdate,
    MyTable
  },
  data() {
    return {
      // loading安装
      searchLoading: false,
      repeatSyncLoading: false,
      signSuccessLoading: false,
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
        srcProject: '',
        destProject: '',
        syncStatus: '',
        msgSrc: '',
        keywords: '',
        repeatCount: null,
        startTime: '',
        endTime: ''
      },
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
    msgSrcG(){
      return getConst("msg_src",adminDomain)
    },
    msgSrcGName(){
      return formatConst(this.msgSrcG)
    },
    resultStatusG(){
      return getConst("result_status",adminDomain)
    },
    resultStatusGName(){
      return formatConst(this.resultStatusG)
    },
    repeatCountG(){
      return getConst("repeat_times",adminDomain)
    },
    repeatCountGName(){
      return formatConst(this.repeatCountG)
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit() {
      this.searchForm.currentPage = 1
      this.fetchData()
    },
    handleRepeatSync(){
      if(this.multipleSelection.length !==1){
        return this.$message.warning("请勾选一条记录进行操作！");
      }
      let rowData = this.multipleSelection[0];
      this.$confirm(`是否要重新同步该记录?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.repeatSyncLoading = true;
        repeatSync(rowData.uuid).then(res=>{
          this.$message.success("操作成功！已进入重试队列。")
        }).finally(()=>{
          this.repeatSyncLoading = false;
        })
      });
    },
    handleValidResultData(){
      if(this.multipleSelection.length !==1){
        return this.$message.warning("请勾选一条记录进行操作！");
      }
      let rowData = this.multipleSelection[0];
      this.$refs.validResultRef.handleOpen(rowData.msgContent)
    },
    handleSignSuccess(){
      if(this.multipleSelection.length !==1){
        return this.$message.warning("请勾选一条记录进行操作！");
      }
      let rowData = this.multipleSelection[0];
      this.$confirm(`是否要标记成功该记录?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.signSuccessLoading = true;
        signSuccess(rowData.uuid).then(res=>{
          this.$message.success("操作成功, 请刷新页面查看！")
        }).finally(()=>{
          this.signSuccessLoading =false;
        })
      });
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
      this.searchLoading = true;
      getResultPage(this.searchForm).then(res => {
        this.tableData = res.result.dataList;
        this.total = res.result.totalRow;
      }).finally(() => {
        this.tableLoading = false;
        this.searchLoading = false;
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
.success{
  color: #19be6b;
  cursor: text!important;
}
.fail{
  color: #ed4014;
  cursor: pointer!important;
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
  width: 100%; /* 保证按钮占满容器 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center; /* 如果需要文字对齐左边 */
  color: #2d8cf0;
  cursor: pointer;
}

</style>
