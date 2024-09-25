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
      <el-button slot="trigger" type="primary" :loading="loading" icon="el-icon-upload">
        <span v-if="!loading">选择文件</span>
        <span v-else>解析中...</span>
      </el-button>
    </el-upload>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5';
import {cutFile} from "./cutFile";
import {uploadFileChunk} from "@/api/file";

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
      this.loading = true;
      const chunkList = await cutFile(option.file).finally(() => {
        this.loading = false;
      });
      chunkList.forEach(e => {
        this.spark.append(e.hash);
      });
      const hash = this.spark.end();
      for (const chunk of chunkList) {
         await this._uploadChunk(hash, chunk);
      }
    },
    async _uploadChunk(hash, chunk) {
      const formData = new FormData();
      formData.append('hash', hash)
      formData.append('file', chunk.blob)
      formData.append('index', chunk.index)
      return uploadFileChunk(formData);
    },
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
