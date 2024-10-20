<template xmlns="http://www.w3.org/1999/html">
    <div class="home-wrapper">
      <el-alert
          :title="'理财有风险，投资需谨慎 ,   Websocket实时监控中：'+refreshTime"
          type="success"
          show-icon
          style="margin-bottom: 10px"
          :closable="true"
      >
      </el-alert>
        <el-table
                border
                fixed="left"
                show-summary
                :summary-method="getSummaries"
                :data="fundData"
                style="width: 100%">
            <el-table-column
                    prop="fundcode"
                    label="基金编号"
                    align="center"
                    sortable
            >
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="showImage(scope.row.fundcode)" >
                  {{ scope.row.fundcode }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="name"
                    label="基金名称"
                    align="center"
                    sortable
                    show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                    label="估算净值"
                    prop="gsz"
                    align="center"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    label="净值日期"
                    prop="jzrq"
                    align="center"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    label="估算涨跌百分比"
                    prop="gszzl"
                    align="center"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    label="当日估值"
                    prop="dwjz"
                    align="center"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    label="估值时间"
                    prop="gztime"
                    align="center"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    label="持有份额"
                    prop="bonds"
                    align="center"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    label="持仓成本价"
                    prop="costPrise"
                    align="center"
                    sortable
            >
            </el-table-column>
            <el-table-column
                    label="收益率"
                    prop="incomePercent"
                    align="center"
                    sortable
            >
              <template slot-scope="scope">
                {{scope.row.incomePercent + '%' }}
              </template>
            </el-table-column>
            <el-table-column
                    label="累计收益"
                    prop="income"
                    align="center"
                    sortable
            >
                <template slot-scope="scope">
                    {{ scope.row.income > 0 ? '+' + scope.row.income : scope.row.income < 0 ? scope.row.income : '+0.00' }}
                </template>
            </el-table-column>
            <el-table-column
                    label="今日收益"
                    prop="todayIncome"
                    align="center"
                    sortable
            >
                <template slot-scope="scope">
                    {{ scope.row.todayIncome > 0 ? '+' + scope.row.todayIncome : scope.row.todayIncome < 0 ? scope.row.todayIncome : '+0.00' }}
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                :title="null"
                width="500px"
                :visible.sync="dialogVisible"
                :before-close="handleClose">
            <el-image
                    style="width: 451px; height: 281px"
                    :src="url"
                    :fit="fit">
                <div slot="placeholder" class="image-slot">
                    <div class="image-loading">
                        加载中<span class="el-icon-loading"></span>
                    </div>
                </div>
            </el-image>
        </el-dialog>

    </div>
</template>

<script>
    import {getFormattedDate} from "@/utils";

    export default {
        name: 'Dashboard',
        data() {
            return {
                refreshTime: '',
                dialogVisible: false,
                url: '',
            }
        },
        methods: {
            showImage(code) {
                this.url  = 'https://j4.dfcfw.com/charts/pic7/'+code+'.png?'+new Date().getTime();
                this.dialogVisible = true;
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (index < 10 || index > 11) {
                        sums[index] = '';
                    } else {
                        const sum = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + value;
                            }
                            return prev;
                        }, 0);
                        if(sum > 0){
                          sums[index] ='+' + sum.toFixed(2);
                        }else {
                          sums[index] = sum.toFixed(2) + '';
                        }
                    }
                });
                return sums;
            },
            handleClose(done) {
                done();
            },
        },
        computed: {
            userInfo() {
                return this.$store.state.user.userInfo;
            },
          fundData() {
            this.refreshTime = getFormattedDate();
            return this.$store.state.notification.fundData;
          },
        }
    }
</script>

<style lang="less">
    .image-slot {
        width: 451px;
        height: 281px;
        background: #f5f7fa;
    }

    .image-loading {
        text-align: center;
        background: #f5f7fa;
        padding-top: 120px;
    }
</style>
