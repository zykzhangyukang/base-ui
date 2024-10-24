<template>
  <div>
    <el-upload
        ref="upload"
        class="upload-demo"
        action=""
        :multiple="false"
        :file-list="fileList"
        :show-file-list="false"
        :auto-upload="true"
        :http-request="httpRequest"
        :before-upload="beforeUpload"
        :on-change="handleUploadChange"
    >
      <el-button slot="trigger" type="primary" icon="el-icon-upload">
         选择文件
      </el-button>
    </el-upload>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5';
import {cutFile} from "./cutFile";
import {uploadFileChunkStart, uploadFileChunk} from "../../api/common";

export default {
  data() {
    return {
      loading: false,
      spark : new SparkMD5.ArrayBuffer(),
      fileList: [],
    };
  },
  methods: {
    handleUploadChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
      }
    },
    beforeUpload(file){
    },
    async httpRequest(option) {
      const loading = this.$message.warning({
        message: '解析中',
        iconClass: 'el-icon-loading',
        duration: 0
      })
      // 文件切片
      let file = option.file;
      const chunkList = await cutFile(file).finally(() => {loading.close();});
      chunkList.forEach(e => {
        this.spark.append(e.hash);
      });
      const hash = this.spark.end();

      // 开始上传任务
      const {result: uploadId} = await this._uploadStart(file);

      for (const chunk of chunkList) {
         await this._uploadChunk(hash, chunk);
      }
    },
    // 上传分片文件
    async _uploadChunk(hash, chunk) {
      const formData = new FormData();
      formData.append('hash', hash)
      formData.append('file', chunk.blob)
      formData.append('index', chunk.index)
      return uploadFileChunk(formData);
    },
    // 开始上传分片
    async _uploadStart(file) {
      const formData = new FormData();
      formData.append('fileName', file.name)
      return uploadFileChunkStart(formData);
    }
  },
  created() {
  }
};
</script>

<style scoped>
.upload-demo {
  margin: 20px;
}
</style>
