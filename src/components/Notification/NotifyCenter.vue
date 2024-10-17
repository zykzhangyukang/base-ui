<template>
    <el-dialog
            title="消息中心"
            :visible.sync="visible"
            width="40%"
            class="dialog-form"
            :before-close="handleClose"
    >
        <el-tabs :tab-position="'top'" v-model="module"  type="card">
            <el-tab-pane :label="notificationModuleGName[item.code]" :name="item.code" v-for="item in notificationModuleG" :key="item.code"></el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>
<script>
    import {adminDomain, formatConst, getConst} from "@/utils";
    export default {
        name: 'NotifyCenter',
        data() {
            return {
                visible: false,
                module: 'all'
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
