<template>
  <el-dialog
      :title="plan.description"
      :visible.sync="visible"
      width="35%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <xmp v-loading="loading" class="plan_content">
      {{ plan.planContent }}
    </xmp>
  </el-dialog>
</template>
<script>

import {getPlanContent} from "@/api/sync";

export default {
  name: 'PlanContent',
  components: {},
  data() {
    return {
      visible: false,
      loading: false,
      plan: {},
    }
  },
  computed: {},
  methods: {
    handleClose() {
      this.visible = false;
    },
    handleOpen(uuid) {
      this.visible = true;
      this.loading = true;
      getPlanContent(uuid).then(res => {
        this.plan = res.result;
      }).finally(() => {
        this.loading = false;
      })
    },
  },
  created() {
  }
}
</script>
<style scoped lang="less">
.plan_content {
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
  overflow-y: auto;
  font-family: Candara, serif;
  background: #eeeeee;
  padding: 5px;
  border-radius: 5px;
  max-height: 600px;
}
</style>
