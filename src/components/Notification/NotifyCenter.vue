<template>
    <el-dialog
            title="消息中心"
            :visible.sync="visible"
            width="40%"
            class="dialog-form"
            :before-close="handleClose"
    >
        <el-radio-group v-model="searchForm.module" size="mini" @input="handleInput">
            <el-radio-button :label="item.code" :name="item.code" v-for="item in notificationModuleG" :key="item.code">
                {{notificationModuleGName[item.code]}}
            </el-radio-button>
        </el-radio-group>
        <el-table
                v-loading="tableLoading"
                :data="tableData"
                stripe
                style="width: 100%;margin-top: 10px">
            <el-table-column
                    prop="notificationType"
                    width="100"
                    label="消息标题">
                <template slot-scope="scope">
                    {{notificationTypeGName[scope.row.notificationType]}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="data"
                    label="内容">
                <template slot-scope="scope">
                    {{scope.row.data}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                small
                @current-change="handleCurrentChange"
                background
                style="margin-top: 10px;position: relative;"
                layout="prev, pager, next"
                :total="total">
        </el-pagination>
    </el-dialog>
</template>
<script>
    import {adminDomain, formatConst, getConst} from "@/utils";
    import {getNotificationPage} from "../../api/common";

    export default {
        name: 'NotifyCenter',
        data() {
            return {
                visible: false,
                tableLoading: false,
                tableData: [],
                total: 0,
                searchForm: {
                    currentPage: 1,
                    pageSize: 5,
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
        },
        methods: {
            handleInput(val){
                this.searchForm.currentPage = 1;
                this.fetchData();
            },
            fetchData() {
                this.tableLoading = true;
                getNotificationPage(this.searchForm).then(res=>{
                    this.tableData = res.result.dataList;
                    this.total = res.result.totalRow;
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
        margin-top: 5px;
    }
</style>
