<template>
  <el-dialog
          :title="description"
          :visible.sync="visible"
          width="35%"
          class="dialog-form"
          :before-close="handleClose"
  >
    <pre><code class="xml">{{ codeSnippet }}</code></pre>
  </el-dialog>
</template>

<script>
  import { getPlanContent } from "@/api/sync";
  import hljs from 'highlight.js';
  import 'highlight.js/styles/googlecode.min.css';

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
                  this.loading = false;
                  this.highlightCode();
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
    font-family: Consolas,serif;
  }
</style>
