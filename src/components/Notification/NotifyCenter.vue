<template>
    <el-dialog
            title="消息中心"
            :visible.sync="visible"
            width="40%"
            :close-on-click-modal="false"
            :before-close="handleClose"
    >
      <div class="tool-bar">
          <el-radio-group v-model="searchForm.module" size="mini" @input="handleInput">
              <el-radio-button :label="item.code" :name="item.code" v-for="item in notificationModuleG" :key="item.code">
                  {{ notificationModuleGName[item.code] }} ({{getUnReadCount(item.code)}})
              </el-radio-button>
          </el-radio-group>
        <el-button style="float: right;margin-left: 10px" plain icon="el-icon-finished">全部已读</el-button>
        <el-select v-model="searchForm.isRead" :style="{width: '100px'}" clearable placeholder="请选择" style="float: right" @change="handleInput">
          <el-option
              v-for="item in isReadG"
              :key="item.code"
              :label="isReadGName[item.code]"
              :value="item.code">
          </el-option>
        </el-select>
      </div>
        <el-table
                v-loading="tableLoading"
                :data="tableData"
                stripe
                height="350"
                style="width: 100%;margin-top: 10px;">
            <el-table-column
                    prop="notificationType"
                    width="100"
                    label="消息标题">
                <template slot-scope="scope">
                    {{notificationTypeGName[scope.row.notificationType]}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="message"
                    label="消息内容">
                <template slot-scope="scope">
                    {{scope.row.message}}
                </template>
            </el-table-column>
            <el-table-column
                    width="100px"
                    align="center"
                    label="是否已读">
                <template slot-scope="scope">
                    <span v-if="scope.row.isRead === 1">
                          <span class="read_flag">已读</span>
                    </span>
                    <span v-else>
                         <span class="un_read_flag">未读</span>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                @current-change="handleCurrentChange"
                style="margin-top: 10px;position: relative;"
                layout="prev, pager, next"
                :total="total">
        </el-pagination>
    </el-dialog>
</template>
<script>
import {adminDomain, formatConst, getConst} from "@/utils";
import {getNotificationPage} from "@/api/common";

export default {
        name: 'NotifyCenter',
      data() {
        return {
          visible: false,
          tableLoading: false,
          tableData: [],
          result:{},
          total: 0,
          searchForm: {
            currentPage: 1,
            pageSize: 10,
            isRead: null,
            module: 'all'
          },
        }
      },
      computed: {
        notificationModuleG() {
          return getConst("notification_module", adminDomain)
        },
        notificationModuleGName() {
          return formatConst(this.notificationModuleG);
        },
        notificationTypeG() {
          return getConst("notification_type", adminDomain)
        },
        notificationTypeGName() {
          return formatConst(this.notificationTypeG);
        },
        isReadG() {
          return getConst("is_read", adminDomain)
        },
        isReadGName() {
          return formatConst(this.isReadG);
        },
      },
        methods: {
            getUnReadCount(code){
                return  this.result[code] || 0;
            },
            handleInput(val){
                this.searchForm.currentPage = 1;
                this.fetchData();
            },
            fetchData() {
                this.tableLoading = true;
                getNotificationPage(this.searchForm).then(res=>{
                    this.tableData = res.result.pageInfo.dataList;
                    this.total = res.result.pageInfo.totalRow;
                    // 消息未读数
                    this.result = res.result;
                }).finally(()=>{
                    this.tableLoading = false;
                })
            },
            handleCurrentChange(val) {
                this.searchForm.currentPage = val;
                this.fetchData();
            },
            handleClose() {
                this.visible = false;
            },
            handleOpen() {
                this.visible = true;
                this.fetchData();
            },
            onSubmit() {
                this.handleClose();
            }
        },
        created() {
        }
    }
</script>
<style scoped lang="less">
    .item {
    }
    .el-icon-message{
      color: #666;
    }
    .un_read_flag{
        color: #ff4400;
    }
    .el-icon-finished{
      color: #19be6b;
    }
    .tool-bar{
      background: #f0f0f0;
      padding: 10px;
    }
</style>
