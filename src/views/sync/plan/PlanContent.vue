<template>
  <el-dialog
          v-if="visible"
          :title="description"
          :visible.sync="visible"
          width="35%"
          class="dialog-form"
          :before-close="handleClose"
  >
    <div style="float: right">
      <el-icon class="el-icon-document-copy"
               v-clipboard:cut="codeSnippet"
               v-clipboard:success="onCutSuccess"
      ></el-icon>
    </div>
    <pre v-loading="loading">
      <code class="xml">{{ codeSnippet }}</code>
    </pre>
  </el-dialog>
</template>

<script>
  import { getPlanContent } from "@/api/sync";
  import hljs from 'highlight.js';
  import 'highlight.js/styles/monokai-sublime.min.css'

  export default {
    name: 'PlanContent',
    data() {
      return {
        visible: false,
        loading: false,
        description: '',
        codeSnippet: ''
      };
    },
    methods: {
      onCutSuccess(){
        this.$message.success("复制成功!");
      },
      handleClose() {
        this.visible = false;
      },
      handleOpen(uuid) {
        this.visible = true;
        this.loading = true;
        getPlanContent(uuid)
                .then(res => {
                  this.codeSnippet = res.result.planContent || '';
                  this.description = res.result.description;
                })
                .finally(() => {
                  this.highlightCode();
                  this.loading = false;
                });
      },
      highlightCode() {
        this.$nextTick(() => {
          this.$el.querySelectorAll('pre code').forEach(block => {
            if (!block.getAttribute('data-highlighted')) {
              hljs.highlightElement(block);
            }
          });
        });
      }
    },
  };
</script>

<style scoped lang="less">
  code {
    font-family: "Consolas",serif;
    font-size: 13px;
  }
  .el-icon-document-copy{
    cursor: pointer;
  }
</style>
