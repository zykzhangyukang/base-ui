<template>
  <el-dialog
      title="同步内容"
      :visible.sync="visible"
      width="40%"
      class="dialog-form"
      :before-close="handleClose"
  >
    <pre><code class="json">{{ codeSnippet }}</code></pre>
  </el-dialog>
</template>
<script>
  import hljs from 'highlight.js';
  import 'highlight.js/styles/googlecode.min.css';
export default {
  name: 'SyncContent',
  components: {},
  data() {
    return {
      visible: false,
      codeSnippet: ''
    }
  },
  computed: {},
  methods: {
    handleClose() {
      this.visible = false;
    },
    handleOpen(content) {
      const parsedData = JSON.parse(content);
      this.codeSnippet = JSON.stringify(parsedData, null, 5);
      this.visible = true;
      this.highlightCode();
    },
    onSubmit() {
      this.handleClose();
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
  created() {
  }
}
</script>
<style scoped lang="less">
  code {
    font-family: Consolas,serif;
  }
</style>
