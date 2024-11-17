<template>
  <div class="trade-fund-wrapper">
    <!-- 提示框 -->
    <el-alert
            title="理财有风险，投资需谨慎 , Websocket实时监控中..."
            type="success"
            show-icon
            closable
            class="alert-box"
    />

    <!-- 工具栏 -->
    <div class="tool-bar">
      <el-button icon="el-icon-refresh" plain @click="fetchData" :loading="loading">
        刷新
      </el-button>
      <el-button icon="el-icon-setting" plain @click="openSetting" :loading="loading" v-permission="'trade_fund_setting'">
        设置
      </el-button>
    </div>

    <!-- 表格内容 -->
    <el-table
            size="mini"
            v-loading="loading"
            border
            show-summary
            :summary-method="getSummaries"
            :data="tableData"
            class="table-content"
    >
      <el-table-column prop="fundCode" label="基金编号" align="center">
        <template slot-scope="scope">
          <span>
          <el-button size="mini" type="text" @click="showImage(scope.row.fundCode)" class="fund_code">
            {{ scope.row.fundCode }}
          </el-button>
              <el-icon class="el-icon-document-copy"
                       v-clipboard:cut="scope.row.fundCode"
                       v-clipboard:success="onCutSuccess"
              ></el-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="fundName" label="基金名称" align="center" show-overflow-tooltip width="200"  />
      <el-table-column label="净值数据" align="center">
        <el-table-column label="30天均值" prop="jz30"  align="center" />
        <el-table-column label="20天均值" prop="jz20"  align="center" />
        <el-table-column label="10天均值" prop="jz10"  align="center" />
        <el-table-column label="5天均值" prop="jz5"  align="center" />
        <el-table-column label="昨天净值" prop="gsz"  align="center">
          <template slot-scope="scope">{{ scope.row.gsz }}</template>
        </el-table-column>
        <el-table-column label="今日估值" prop="dwjz"  align="center" />
      </el-table-column>
      <el-table-column label="估值时间" prop="gztime" align="center" width="150" />
      <el-table-column label="估算涨跌%" prop="gszzl" align="center">
        <template slot-scope="scope">
            <span :style="{ color: scope.row.gszzl > 0 ? 'red' : scope.row.gszzl < 0 ? 'green' : '' }">
              {{ scope.row.gszzl > 0 ? '+' : '' }}{{ scope.row.gszzl ? scope.row.gszzl + '%' : '-' }}
            </span>
        </template>
      </el-table-column>
      <el-table-column label="持有份额" prop="bonds" align="center" />
      <el-table-column label="持仓成本价" prop="costPrise" align="center" />

      <el-table-column label="收益率" prop="incomePercent" align="center">
        <template slot-scope="scope">
          {{ scope.row.incomePercent ? scope.row.incomePercent + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="累计收益" prop="income" align="center">
        <template slot-scope="scope">
          {{ formatIncome(scope.row.income) }}
        </template>
      </el-table-column>
      <el-table-column label="今日收益" prop="todayIncome" align="center" fixed="right">
        <template slot-scope="scope">
          {{ formatIncome(scope.row.todayIncome) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 图片展示弹窗 -->
    <el-dialog
            width="500px"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
    >
      <el-image :src="url" :fit="fit" class="image-display">
        <template #placeholder>
          <div class="image-loading">
            加载中<span class="el-icon-loading"></span>
          </div>
        </template>
      </el-image>
    </el-dialog>
    <!-- 设置弹框 -->
    <el-dialog title="基金设置" :visible.sync="settingVisible" width="670px" center>
      <el-table :data="settingData" border  height="350" v-loading="tableLoading">
        <el-table-column property="date" label="基金编号" align="center">
          <template slot-scope="scope">
            <el-input  v-model="scope.row.fundCode" placeholder="" style="width: 100%"  ></el-input>
          </template>
        </el-table-column>
        <el-table-column property="costPrise" label="持仓成本价" align="center" >
          <template slot-scope="scope">
            <el-input-number  v-model="scope.row.costPrise" placeholder=""  style="width: 100%" :precision="4" ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column property="bonds" label="持有份额" align="center">
          <template slot-scope="scope">
            <el-input-number  v-model="scope.row.bonds" placeholder=""  style="width: 100%" :precision="2" ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100"  align="center">
          <template slot-scope="scope">
            <el-button @click="delSetting(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSetting">新增一行</el-button>
        <el-button type="primary" @click="saveSetting">保存设置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getFundListData, getFundSetting, saveFundSetting} from "@/api/common";

  export default {
    name: "TradeFund",
    data() {
      return {
        loading: false,
        tableLoading: false,
        dialogVisible: false,
        settingVisible: false,
        url: "",
        tableData: [],
        settingData: [{}]
      };
    },
    methods: {
      onCutSuccess(){
        this.$message.success("复制成功!");
      },
      openSetting(){
        this.settingVisible = true;
        this.tableLoading = true;
        getFundSetting().then(res=>{
          this.settingData = res.result || [];
        }).finally(()=>{
          this.tableLoading = false;
        })
      },
      delSetting(index){
         this.settingData.splice(index, 1);
      },
      addSetting(){
        this.settingData.push({})
      },
      saveSetting(){
        saveFundSetting(this.settingData).then(res=>{
          this.$message.success("设置成功");
          this.settingVisible = false;
          this.fetchData();
        })
      },
      async fetchData() {
        this.loading = true;
        try {
          const res = await getFundListData();
          this.tableData = res.result;
        } finally {
          this.loading = false;
        }
      },
      showImage(code) {
        this.url = `https://j4.dfcfw.com/charts/pic7/${code}.png?${new Date().getTime()}`;
        this.dialogVisible = true;
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        // 指定需要计算合计的列名
        const sumColumns = ['todayIncome','income'];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const property = column.property;
          if (sumColumns.includes(property)) {
            const values = data.map(item => Number(item[property]));
            const sum = values.reduce((prev, curr) => {
              const value = Number(curr);
              return !isNaN(value) ? prev + value : prev;
            }, 0);
            sums[index] = sum > 0 ? '+' + sum.toFixed(2) : sum.toFixed(2);
          } else {
            sums[index] = '';  // 不需要合计的列为空
          }
        });
        return sums;
      },
      formatIncome(value) {
        return value > 0 ? `+${value}` : value < 0 ? value : "+0.00";
      },
      handleClose(done) {
        done();
      },
    },
    created() {
      this.fetchData();
    },
  };
</script>

<style scoped lang="less">
  .trade-fund-wrapper {
    .fund_code{
      color: dodgerblue;
      margin-right: 5px;
      font-weight: 500;
    }
    .el-icon-document-copy{
      cursor: pointer;
    }
    .alert-box {
      margin-bottom: 10px;
    }
    .tool-bar {
      margin: 5px 0;
    }
    .table-content {
      width: 100%;
    }
    .image-display {
      width: 451px;
      height: 281px;
    }
    .image-loading {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      .el-icon-loading {
        margin-left: 5px;
      }
    }
  }
</style>
