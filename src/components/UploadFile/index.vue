<template>
  <div class="upload-wrapper">
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
      <el-button
              slot="trigger"
              type="primary"
              icon="el-icon-upload"
              :loading="isUploading"
              class="upload-btn"
      >
        {{ isUploading ? statusText : '选择文件' }}
      </el-button>
    </el-upload>

    <!-- 上传进度 -->
    <div class="upload-progress" v-if="isUploading && uploadProgress > 0">
      <span>上传进度：{{ uploadProgress }}%</span>
    </div>

    <!-- 文件下载地址 -->
    <div class="upload-result" v-if="uploadedUrl">
      <span>文件地址：</span>
      <a :href="uploadedUrl" target="_blank">{{ uploadedUrl }}</a>
    </div>
  </div>
</template>

<script>
  import { cutFile } from "./cutFile";
  import {
    uploadChunkFinish,
    uploadFileChunk,
    uploadFileChunkStart
  } from "../../api/common";
  import SparkMD5 from "spark-md5";

  export default {
    data() {
      return {
        fileList: [],
        chunkList: [],
        fileHash: '',
        uploadProgress: 0,
        isUploading: false,
        statusText: '',
        uploadId: '',
        fileName: '',
        uploadedUrl: ''
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
        this.uploadProgress = 0;
        this.isUploading = true;
        this.statusText = '解析中';
        this.uploadedUrl = '';
      },
      async computeFileHash(chunkList) {
        const spark = new SparkMD5();
        for (let chunk of chunkList) {
          spark.append(chunk.hash);
          await this.$nextTick();
        }
        return spark.end();
      },
      async httpRequest(option) {
        try {
          const file = option.file;
          this.fileName = file.name;

          // 1. 切片
          this.chunkList = await cutFile(file);

          // 2. 计算 hash
          this.statusText = '计算 Hash';
          this.fileHash = await this.computeFileHash(this.chunkList);

          // 3. 通知后端准备上传
          this.statusText = '准备上传';
          const { result: { uploadId, uploaded = [] } } = await this._uploadStart(file, this.fileHash, this.chunkList.length);
          this.uploadId = uploadId;

          // 4. 上传分片（进度展示从这里开始）
          this.statusText = '上传中';
          const uploadedSet = new Set(uploaded);
          let uploadedCount = 0;
          const totalChunks = this.chunkList.length;

          for (const chunk of this.chunkList) {
            const partNumber = chunk.index + 1;
            if (uploadedSet.has(partNumber)) {
              uploadedCount++;
              this.uploadProgress = Math.floor((uploadedCount / totalChunks) * 100);
              continue;
            }

            await this._uploadChunk(this.fileHash, chunk.blob, uploadId, file.name, partNumber);
            uploadedCount++;
            this.uploadProgress = Math.floor((uploadedCount / totalChunks) * 100);
            await this.$nextTick();
          }

          // 5. 上传完成后合并
          this.statusText = '合并文件';
          const { result } = await this._uploadFinish(this.fileHash);
          this.uploadedUrl = result;

        } catch (error) {
          console.error(error);
          this.$message.error("上传失败，请重试！");
        } finally {
          this.isUploading = false;
          this.statusText = '';
          this.uploadProgress = 0;
        }
      },
      async _uploadChunk(hash, file, uploadId, fileName, partNumber) {
        const formData = new FormData();
        formData.append('uploadId', uploadId);
        formData.append('fileHash', hash);
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('partNumber', partNumber);
        return uploadFileChunk(formData);
      },
      async _uploadStart(file, hash, totalParts) {
        const formData = new FormData();
        formData.append('fileName', file.name);
        formData.append('fileHash', hash);
        formData.append('totalParts', totalParts);
        return uploadFileChunkStart(formData);
      },
      async _uploadFinish(fileHash) {
        const formData = new FormData();
        formData.append('fileHash', fileHash);
        return uploadChunkFinish(formData);
      }
    }
  };
</script>

<style scoped>
  .upload-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    max-width: 400px;
  }

  .upload-btn {
    width: 100%;
  }

  .upload-progress {
    font-size: 13px;
    color: #409EFF;
    padding-left: 4px;
  }

  .upload-result {
    font-size: 13px;
    color: #333;
    word-break: break-all;
  }

  .upload-result a {
    color: #409EFF;
    text-decoration: none;
  }

  .upload-result a:hover {
    text-decoration: underline;
  }
</style>
