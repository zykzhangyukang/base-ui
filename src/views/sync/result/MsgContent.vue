<template>
    <el-dialog
            title="消息内容"
            :visible.sync="visible"
            width="40%"
            class="dialog-form"
            :before-close="handleClose">
        <div style="float: right">
            <el-icon class="el-icon-document-copy"
                     v-clipboard:cut="codeSnippet"
                     v-clipboard:success="onCutSuccess"
            ></el-icon>
        </div>
        <pre><code class="json">{{ codeSnippet }}</code></pre>
    </el-dialog>
</template>
<script>
    import hljs from 'highlight.js';
    import 'highlight.js/styles/googlecode.min.css';
    export default {
        name: 'MsgContent',
        components: {},
        data() {
            return {
                visible: false,
                codeSnippet: ''
            }
        },
        computed: {},
        methods: {
            onCutSuccess(){
                this.$message.success("复制成功!");
            },
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
    .el-icon-document-copy{
        cursor: pointer;
    }
</style>
