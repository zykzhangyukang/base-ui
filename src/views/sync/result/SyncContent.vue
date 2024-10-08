<template>
  <el-dialog
      title="同步内容"
      :visible.sync="visible"
      width="40%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <div class="sync-content">
      <pre v-text="content">
    </pre>
    </div>
  </el-dialog>
</template>
<script>


export default {
  name: 'SyncContent',
  components: {},
  data() {
    return {
      visible: false,
      content: ''
    }
  },
  computed: {},
  methods: {
    handleClose() {
      this.visible = false;
    },
    handleOpen(content) {
      const parsedData = JSON.parse(content);
      this.content = JSON.stringify(parsedData, null, 5);
      this.visible = true;
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
.sync-content {
  width: 100%;
  overflow: hidden;
  overflow-x: scroll;
  overflow-y: auto;
  font-family: Candara, serif;
  background: #f8f8f9;
  padding: 5px;
  border-radius: 5px;
  max-height: 650px;
}
</style>
