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
  import {cutFile} from "./cutFile";
  import {uploadFileChunkStart, uploadFileChunk} from "../../api/common";
  import {computeFileHash} from "./computeFileHash";

  export default {
    data() {
      return {
        loading: false,
        fileList: [],
        chunkList: [],
        fileHash: '',
      };
    },
    methods: {
      handleUploadChange(file, fileList) {
        if (fileList.length > 0) {
          this.fileList = [fileList[fileList.length - 1]];
        }
      },
      beforeUpload(file) {
        this.fileHash = '';
        this.chunkList = [];
      },
      async httpRequest(option) {
        const loading = this.$message.warning({
          message: '解析中',
          iconClass: 'el-icon-loading',
          duration: 0
        });

        // 文件切片
        let file = option.file;
        this.chunkList = await cutFile(file).finally(() => {
          loading.close();
        });

        // 计算文件的 hash
        this.fileHash = await computeFileHash(this.chunkList, file.name, file.size);

        // 开始上传任务
        const { result: { uploadId, uploaded } } = await this._uploadStart(file, this.fileHash, this.chunkList.length);

        // 分片上传
        for (const chunk of this.chunkList) {
          await this._uploadChunk(this.fileHash, chunk, uploadId, file.name);
        }
      },
      // 上传分片文件
      async _uploadChunk(hash, chunk, uploadId, fileName) {
        const formData = new FormData();
        formData.append('uploadId', uploadId);
        formData.append('fileHash', hash);
        formData.append('file', chunk.blob);
        formData.append('fileName', fileName);
        formData.append('partNumber', chunk.index + 1);
        return uploadFileChunk(formData);
      },
      // 开始上传分片
      async _uploadStart(file, hash, totalParts) {
        const formData = new FormData();
        formData.append('fileName', file.name);
        formData.append('fileHash', hash);
        formData.append('totalParts', totalParts);
        return uploadFileChunkStart(formData);
      }
    }
  };
</script>

<style scoped>
  .upload-demo {
    margin: 20px;
  }
</style>
