<template>
  <el-dialog
      title="分配用户"
      :visible.sync="visible"
      width="605px"
      class="dialog-form"
      :before-close="handleClose"
  >
    <span v-loading="loading">
       <el-transfer
           filterable
           :titles="['未分配', '已分配']"
           :filter-method="filterMethod"
           filter-placeholder="请输入用户名"
           v-model="value"
           :data="dataList">
         </el-transfer>
    </span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
     <el-button type="primary" @click="onSubmit" :loading="btnLoading">保存</el-button>
  </span>
  </el-dialog>
</template>
<script>

import {getRoleUserInit, updateRoleUser} from "@/api/role";

export default {
  name: 'RoleUpdateUser',
  components: {},
  data() {
    return {
      roleId: null,
      visible: false,
      btnLoading: false,
      loading: false,
      dataList: [],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
    }
  },
  computed: {},
  methods: {
    handleClose() {
      this.visible = false;
      this.dataList = [];
      this.value = [];
    },
    async handleOpen(id) {
      this.visible = true;
      this.loading = true;
      this.roleId = id;
      getRoleUserInit(id).then(res => {
        const userList = res.result.userList;
        const tempList = [];
        userList.forEach(e => {
          tempList.push({
            key: e.userId,
            label: `${e.realName} (${e.username})`,
            disabled: false
          })
          this.dataList = tempList;
          this.value = res.result.userIdList;
        })
      }).finally(() => {
        this.loading = false;
      })
    },
    onSubmit() {
      this.btnLoading = true;
      updateRoleUser({roleId: this.roleId , userIdList: this.value}).then(res=>{
        this.handleClose();
        this.$message.success("分配用户成功！")
        this.$emit('success')
      }).finally(()=>{
        this.btnLoading = false;
      })
    }
  },
  created() {
  }
}
</script>
<style scoped lang="less">

</style>
