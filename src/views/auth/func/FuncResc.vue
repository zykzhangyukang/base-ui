<template>
  <el-dialog
      title="资源列表"
      :visible.sync="visible"
      width="30%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <div v-for="item in list" :key="item.rescId" class="item">
      {{item.rescUrl}}
      <div class="desc">{{item.rescName}}</div>
    </div>
  </el-dialog>
</template>
<script>

export default {
  name: 'FuncResc',
  components: {
  },
  data() {
    return {
      visible:false,
      list: []
    }
  },
  computed:{
  },
  methods:{
    handleClose() {
      this.visible = false;
    },
    handleOpen(list){
      this.visible = true;
      this.list = list;
    },
  },
  created() {
  }
}
</script>
<style scoped lang="less">
.desc{
  float: right;
  font-weight: 700;
}
.item{
  background: #eee;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  margin-bottom: 10px;
}
</style>
