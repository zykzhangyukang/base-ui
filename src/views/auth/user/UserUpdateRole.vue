<template>
  <el-dialog
      title="分配角色"
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
           filter-placeholder="请输入角色名称"
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

import {getUserRoleInit, updateUserRole} from "@/api/user";

export default {
  name: 'RoleUpdateUser',
  components: {},
  data() {
    return {
      userId: null,
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
      this.userId = id;
      getUserRoleInit(id).then(res => {
        const roleList = res.result.roleList;
        const tempList = [];
        roleList.forEach(e => {
          tempList.push({
            key: e.roleId,
            label: `${e.roleName}`,
            disabled: false
          })
          this.dataList = tempList;
          this.value = res.result.roleIdList;
        })
      }).finally(() => {
        this.loading = false;
      })
    },
    onSubmit() {
      this.btnLoading = true;
      updateUserRole({userId: this.userId , roleIdList: this.value}).then(res=>{
        this.handleClose();
        this.$message.success("分配角色成功！")
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
