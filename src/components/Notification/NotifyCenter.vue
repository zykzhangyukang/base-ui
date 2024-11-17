<template>
    <el-dialog
            title="消息中心"
            :visible.sync="visible"
            width="40%"
            :close-on-click-modal="false"
            :before-close="handleClose"
    >
      <div class="tool-bar">
        <el-row>
          <el-col :span="16">
            <el-radio-group v-model="searchForm.module" size="mini" @input="handleInput">
              <el-radio-button :label="item.code" :name="item.code" v-for="item in notificationModuleG" :key="item.code">
                {{ notificationModuleGName[item.code] }} ({{getUnReadCount(item.code)}})
              </el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="8">
            <el-select v-model="searchForm.isRead" :style="{width: '100px'}" placeholder="请选择" style="float: right" @change="handleInput">
              <el-option
                  v-for="item in isReadG"
                  :key="item.code"
                  :label="isReadGName[item.code]"
                  :value="item.code">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
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
                    <el-button v-if="scope.row.isRead === 1" @click="rowClick(scope.row)" size="mini" type="text" :loading="scope.row.readLoading">
                          <span class="read_flag">已读</span>
                    </el-button>
                    <el-button @click="rowClick(scope.row)" v-else size="mini" type="text"  :loading="scope.row.readLoading">
                         <span class="un_read_flag">未读</span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                v-if="this.total > this.searchForm.pageSize"
                @current-change="handleCurrentChange"
                style="margin-top: 10px;position: relative;"
                layout="prev, pager, next"
                :total="total">
        </el-pagination>
    </el-dialog>
</template>
<script>
import {getNotificationPage, maskNotificationRead} from "@/api/common";

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
            isRead: 0,
            module: 'all'
          },
        }
      },
      computed: {
        notificationModuleG() {
          return this.$getConst("notification_module")
        },
        notificationModuleGName() {
          return this.$formatConst(this.notificationModuleG);
        },
        notificationTypeG() {
          return this.$getConst("notification_type")
        },
        notificationTypeGName() {
          return this.$formatConst(this.notificationTypeG);
        },
        isReadG() {
          return this.$getConst("is_read")
        },
        isReadGName() {
          return this.$formatConst(this.isReadG);
        },
      },
        methods: {
            rowClick(row){
              if(row.isRead === 0){
                this.$set(row, 'readLoading', true);
                maskNotificationRead(row.notificationId).then(res=>{
                  if(res.code===200){
                    this.$message.success("消息已读");
                    row.isRead = 1;
                    const  index = this.tableData.findIndex(e=>e.notificationId === row.notificationId);
                    this.tableData.splice(index, 1);
                  }
                }).finally(()=>{
                  this.$set(row, 'readLoading', false);
                });
              }
            },
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
        color: red;
    }
    .read_flag{
      color: darkgreen;
    }
    .tool-bar{
      background: #f0f0f0;
      padding: 10px;
    }
</style>
