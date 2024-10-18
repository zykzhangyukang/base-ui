<template xmlns="http://www.w3.org/1999/html">
    <div class="home-wrapper">
        <h2 style="margin: 10px 0">基金信息</h2>
        <el-table
                stripe
                border
                fixed="left"
                show-summary
                :summary-method="getSummaries"
                :data="fundData"
                style="width: 100%">
            <el-table-column
                    prop="fundcode"
                    label="基金编号"
            >
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="name"
                    label="基金名称"
            >
            </el-table-column>
            <el-table-column
                    label="估算净值"
                    prop="gsz"
            >
            </el-table-column>
            <el-table-column
                    label="净值日期"
                    prop="jzrq"
            >
            </el-table-column>
            <el-table-column
                    label="估算涨跌百分比"
                    prop="gszzl"
            >
            </el-table-column>
            <el-table-column
                    label="当日估值"
                    prop="dwjz"
            >
            </el-table-column>
            <el-table-column
                    label="估值时间"
                    prop="gztime"
            >
            </el-table-column>
            <el-table-column
                    label="持有份额"
                    prop="bonds"
            >
            </el-table-column>
            <el-table-column
                    label="持仓成本价"
                    prop="costPrise"
            >
            </el-table-column>
            <el-table-column
                    label="收益率"
                    prop="incomePercent"
            >
            </el-table-column>
            <el-table-column
                    label="累计收益"
                    prop="income"
            >
                <template slot-scope="scope">
                    {{ scope.row.income > 0 ? '+' + scope.row.income : scope.row.income < 0 ? scope.row.income : '+0.00' }}
                </template>
            </el-table-column>
            <el-table-column
                    label="今日收益"
                    prop="todayIncome"
            >
                <template slot-scope="scope">
                    {{ scope.row.todayIncome > 0 ? '+' + scope.row.todayIncome : scope.row.todayIncome < 0 ? scope.row.todayIncome : '+0.00' }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'Dashboard',
        data() {
            return {}
        },
        methods: {
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '汇总';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (index < 10) {
                        sums[index] = '';
                    } else {
                        const sum = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + value;
                            }
                            return prev;
                        }, 0);
                        sums[index] = sum.toFixed(2) + ' 元'; // 保留两位小数
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
