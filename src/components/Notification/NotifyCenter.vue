<template>
    <el-dialog
            title="消息中心"
            :visible.sync="visible"
            width="40%"
            class="dialog-form"
            :before-close="handleClose"
    >
      <el-radio-group v-model="module" size="mini" >
        <el-radio-button  :label="notificationModuleGName[item.code]" :name="item.code" v-for="item in notificationModuleG" :key="item.code" ></el-radio-button>
      </el-radio-group>
      <el-table
          :data="tableData"
          stripe
          style="width: 100%;margin-top: 10px">
        <el-table-column
            prop="date"
            label="标题">
        </el-table-column>
        <el-table-column
            prop="date"
            label="发送人">
        </el-table-column>
        <el-table-column
            prop="address"
            label="创建时间">
        </el-table-column>
        <el-table-column
            prop="address"
            label="操作">
        </el-table-column>
      </el-table>
      <el-pagination
          small
          background
          style="margin-top: 10px;position: relative;"
          layout="prev, pager, next"
          :total="50">
      </el-pagination>
    </el-dialog>
</template>
<script>
    import {adminDomain, formatConst, getConst} from "@/utils";
    export default {
        name: 'NotifyCenter',
        data() {
            return {
                visible: false,
                module: 'all',
              tableData: []
            }
        },
        computed:{
            notificationModuleG(){
                return getConst("notification_module", adminDomain)
            },
            notificationModuleGName(){
                return formatConst(this.notificationModuleG);
            },
        },
        methods:{
            handleClose() {
                this.visible = false;
            },
            handleOpen(){
                this.visible = true;
            },
            onSubmit(){
                this.handleClose();
            }
        },
        created() {
        }
    }
</script>
<style scoped lang="less">

</style>
