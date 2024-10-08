<template>
  <el-dialog
      :title="null"
      :visible.sync="visible"
      width="35%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <div class="content-wrap" v-loading="loading">
      <p v-if="count > 0">共有 <b class="red">{{ count }}</b> 个字段不一致</p>

      <table v-for="(item, index) in validTables" :key="index" cellpadding="0">
        <thead>
        <tr>
          <th colspan="2">{{ item.srcTable }} → {{ item.destTable }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="table-header">字段</td>
          <td class="table-header">值</td>
        </tr>
        <tr v-for="(srcColumn, idx) in item.srcColumnList" :key="idx">
          <td class="table-data">
            {{ srcColumn }} → {{ item.destColumnList[idx] }}
          </td>
          <td class="table-data" :class="{'red': item.srcResultList[idx] !== item.destResultList[idx]}">
            {{ item.srcResultList[idx] }} → {{ item.destResultList[idx] }}
          </td>
        </tr>
        </tbody>
      </table>

      <div class="isCenter" v-if="validTables.length === 0">
        <el-empty description="暂无数据" :image-size="50"></el-empty>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { validResultData } from "@/api/sync";

export default {
  name: 'ValidResult',
  data() {
    return {
      visible: false,
      loading: false,
      count: 0,
      validTables: [],
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    handleOpen(msgContent) {
      this.visible = true;
      this.loading = true;

      validResultData({ msgContent }).then(res => {
        this.validTables = res.result;
        this.count = this.validTables.reduce((total, item) => {
          return total + item.srcResultList.filter((srcResult, index) => srcResult !== item.destResultList[index]).length;
        }, 0);
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped lang="less">
.red {
  color: #ff4400;
}

.dialog-form {
  .content-wrap {
    max-height: 400px;
    overflow-y: auto;
    font-size: 12px;
    padding: 10px;
  }

  p {
    margin-top: 0;
    font-size: 16px;
    text-align: center;
    color: #333;
  }

  table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;

    thead th {
      background-color: #eee;
      text-align: center;
      padding: 10px;
      font-weight: 500;
      color: #333;
    }

    tbody tr:nth-child(odd) {
      background-color: #f9f9f9;
    }

    tbody tr:nth-child(even) {
      background-color: #fff;
    }

    .table-header {
      text-align: center;
      background-color: #f8f8f9;
      font-weight: bold;
      padding: 8px;
    }

    .table-data {
      text-align: center;
      padding: 8px;
      border: 1px solid #ebeef5;
    }
  }

  .isCenter {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: #999;
  }
}
</style>



