<template xmlns="http://www.w3.org/1999/html">
  <div class="table-callback-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="源系统" prop="srcProject">
        <el-select v-model="searchForm.srcProject" placeholder="源系统"  :style="{width:'180px'}">
          <el-option :label="srcProjectGName[item.code]" v-for="item in srcProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标系统" prop="destProject">
        <el-select v-model="searchForm.destProject" placeholder="目标系统" :style="{width:'180px'}" >
          <el-option :label="destProjectGName[item.code]" v-for="item in destProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item label="回调次数" prop="repeatCount">
        <el-select v-model="searchForm.repeatCount" placeholder="回调次数" clearable  :style="{width:'180px'}">
          <el-option :label="repeatCountGName[item.code]" v-for="item in repeatCountG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回调状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="回调状态" clearable :style="{width:'180px'}">
          <el-option :label="callbackStatusGName[item.code]" v-for="item in callbackStatusG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息ID" prop="msgId">
        <el-input v-model="searchForm.msgId" placeholder="消息ID"  :style="{width:'250px'}" ></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="msgContent">
        <el-input v-model="searchForm.msgContent" placeholder="消息内容"  :style="{width:'250px'}" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button plain @click="handleCallback" :loading="callbackLoading">重新回调</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格栏 -->
    <my-table
        border
        stripe
        ref="tableList"
        v-loading="tableLoading"
        :data="tableData"
        @sort-change="sortChange"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"  label="选择" align="center"></el-table-column>
      <el-table-column
          prop="msgId"
          label="消息id"
          width="250"
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
          prop="msgContent"
          label="消息内容"
          width="150px"
      >
        <template  slot-scope="scope">
          <div class="ellipsis">
             <span  class="ellipsis-button link" v-text="scope.row.msgContent" @click="$refs.msgContentRef.handleOpen(scope.row.msgContent)">
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="回调状态"
          align="center"
      >
        <template slot-scope="scope">
          <a :title="scope.row.errorMsg" >{{callbackStatusGName[scope.row.status]}}</a>
        </template>
      </el-table-column>
      <el-table-column
          prop="repeatCount"
          label="回调次数"
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
          prop="ackTime"
          label="回调时间"
          align="center"
          sortable
      >
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注信息"
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
    <!-- 查看同步内容 -->
    <msg-content ref="msgContentRef"></msg-content>
  </div>
</template>

<script>
import {adminDomain, formatConst, getConst, toLine} from "@/utils";
import MyTable from '@/components/MyTable/index'
import {getCallbackPage, repeatCallBack, repeatSync} from "@/api/sync";
import MsgContent from "@/views/sync/result/MsgContent.vue";

export default {
  name: 'SyncCallback',
  components: {
    MsgContent,
    MyTable
  },
  data() {
    return {
      callbackLoading: false,
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      tableLoading: true,
      multipleSelection: [],
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        srcProject: '',
        repeatCount: null,
        destProject: 'sync',
        status: '',
        msgId: '',
        msgContent: '',
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
    callbackStatusG(){
      return getConst("callback_status",adminDomain)
    },
    callbackStatusGName(){
      return formatConst(this.callbackStatusG)
    },
    repeatCountG(){
      return getConst("repeat_times",adminDomain)
    },
    repeatCountGName(){
      return formatConst(this.repeatCountG)
    },
  },
  methods: {
    handleCallback(){
      if(this.multipleSelection.length ===0){
        return this.$message.warning("请勾选一条记录进行操作！");
      }
      this.$confirm(`是否要重新回调这些记录?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.repeatSyncLoading = true;
        let uuidList = this.multipleSelection.map(e=>e.uuid);
        repeatCallBack({uuidList: uuidList, destProject: this.searchForm.destProject}).then(res=>{
          this.$message.success("操作成功！已进入回调队列。")
        }).finally(()=>{
          this.repeatSyncLoading = false;
        })
      });
    },
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
      getCallbackPage(this.searchForm).then(res => {
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
<style lang="less" scoped>
.pagination-wrapper{
  margin-top: 25px;
  .el-pagination{
    float: right;
  }
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
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.link{
  color: #2d8cf0;
  cursor: pointer;
}
</style>
