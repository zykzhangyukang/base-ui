<template xmlns="http://www.w3.org/1999/html">
  <div class="table-plan-wrapper">
    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchForm" class="searchForm" ref="searchForm">
      <el-form-item label="源系统" prop="srcProject">
        <el-select v-model="searchForm.srcProject" placeholder="源系统"  >
          <el-option :label="srcProjectGName[item.code]" v-for="item in srcProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标系统" prop="destProject">
        <el-select v-model="searchForm.destProject" placeholder="目标系统"  >
          <el-option :label="destProjectGName[item.code]" v-for="item in destProjectG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送状态" prop="sendStatus">
        <el-select v-model="searchForm.sendStatus" placeholder="发送状态"  >
          <el-option :label="sendStatusGName[item.code]" v-for="item in sendStatusG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="dealStatus">
        <el-select v-model="searchForm.dealStatus" placeholder="处理状态"  >
          <el-option :label="dealStatusGName[item.code]" v-for="item in dealStatusG" :value="item.code" :key="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="msgCreateTimeRange">
        <el-date-picker
            v-model="searchForm.createTimeRange"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="消息ID" prop="msgId">
        <el-input v-model="searchForm.msgId" placeholder="消息ID"  :style="{width:'250px'}" ></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="msgContent">
        <el-input v-model="searchForm.msgContent" placeholder="消息内容"  :style="{width:'250px'}" ></el-input>
      </el-form-item>
      <el-form-item label="MQ消息ID" prop="mid">
        <el-input v-model="searchForm.mid" placeholder="MQ消息ID"  :style="{width:'250px'}" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
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
          prop="uuid"
          label="消息ID"
          align="center"
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
          prop="mid"
          label="MQ消息"
          align="center"
          width="220px"
      >
        <template slot-scope="scope">
        <div class="ellipsis">
             <span  class="ellipsis-button">
               {{scope.row.mid}}
            </span>
        </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="sendStatus"
          label="发送状态"
          align="center"
      >
        <template slot-scope="scope">
          <a  >{{sendStatusGName[scope.row.sendStatus]}}</a>
        </template>
      </el-table-column>
      <el-table-column
          prop="dealStatus"
          label="处理状态"
          align="center"
      >
        <template slot-scope="scope">
          <a >{{dealStatusGName[scope.row.dealStatus]}}</a>
        </template>
      </el-table-column>
      <el-table-column
          prop="msgContent"
          label="消息内容"
          width="180"
      >
        <template  slot-scope="scope">
          <div class="ellipsis">
             <span  class="ellipsis-button link" v-text="scope.row.msgContent" @click="$refs.msgContentRef.handleOpen(scope.row.msgContent)">
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="dealCount"
          label="处理次数"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="sendTime"
          label="发送时间"
          width="180"
      >
      </el-table-column>
      <el-table-column
          prop="ackTime"
          label="ACK时间"
          width="180"
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
import {getMessagePage} from "@/api/sync";
import MsgContent from "@/views/sync/result/MsgContent.vue";

export default {
  name: 'SyncMessage',
  components: {
    MsgContent,
    MyTable
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // 数据总条数
      total: 0,
      // 表格数据数组
      tableData: [],
      tableLoading: true,
      searchForm: {
        currentPage: 1,
        pageSize: 20,
        planCode: '',
        srcProject: 'admin',
        destProject: '',
        dealStatus: '',
        sendStatus: '',
        msgId: '',
        msgContent: '',
        mid: '',
        createTimeRange: ''
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
    sendStatusG(){
      return getConst("send_status",adminDomain)
    },
    sendStatusGName(){
      return formatConst(this.sendStatusG)
    },
    dealStatusG(){
      return getConst("deal_status",adminDomain)
    },
    dealStatusGName(){
      return formatConst(this.dealStatusG)
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
      this.tableLoading = true;
      getMessagePage(this.searchForm).then(res => {
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
  width: 100%; /* 保证按钮占满容器 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center; /* 如果需要文字对齐左边 */
  font-family: Arial,serif;
}
.link{
  color: #2d8cf0;
  cursor: pointer;
}
</style>
