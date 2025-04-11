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
              :loading="isUploading"
              class="upload-btn"
      >
        {{ isUploading ? statusText : '选择文件' }}
      </el-button>
    </el-upload>

    <!-- 上传进度 -->
    <div class="upload-progress" v-if="isUploading && uploadProgress > 0">
      <span>上传进度：{{ uploadProgress }}%</span>
      <el-progress :percentage="uploadProgress" status="active" />
    </div>

    <!-- 上传结果 -->
    <div class="upload-result" v-if="uploadedUrl">
      <a :href="uploadedUrl" target="_blank">{{ uploadedUrl }}</a>
      <el-button
              v-if="isPreview(uploadedUrl)"
              size="mini"
              type="text"
              @click="handlePreview"
      >
        预览
      </el-button>
    </div>

    <!-- 文件预览弹窗 -->
    <el-dialog
            :title="previewTitle"
            :visible.sync="previewVisible"
            width="50%"
            top="10vh"
    >
      <div v-if="canPreview">
        <img
                v-if="isImage(uploadedUrl)"
                :src="uploadedUrl"
                class="preview-img"
        />
        <iframe
                v-else-if="isPDF(uploadedUrl)"
                :src="uploadedUrl"
                width="100%"
                height="500px"
                frameborder="0"
        ></iframe>
      </div>
      <div v-else>
        <p style="color: #999; text-align: center;">该文件类型暂不支持预览</p>
      </div>
    </el-dialog>
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
        fileHash: "",
        uploadProgress: 0,
        isUploading: false,
        statusText: "",
        uploadId: "",
        fileName: "",
        uploadedUrl: "",
        previewVisible: false,
        canPreview: false,
        previewTitle: "文件预览"
      };
    },
    methods: {
      handleUploadChange(file, fileList) {
        if (fileList.length > 0) {
          this.fileList = [fileList[fileList.length - 1]];
        }
      },
      beforeUpload(file) {
        this.fileHash = "";
        this.chunkList = [];
        this.uploadProgress = 0;
        this.isUploading = true;
        this.statusText = "解析中";
        this.uploadedUrl = "";
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

          this.chunkList = await cutFile(file);
          this.statusText = "计算 Hash";
          this.fileHash = await this.computeFileHash(this.chunkList);

          this.statusText = "准备上传";
          const {
            result: { uploadId, uploaded = [] }
          } = await this._uploadStart(file, this.fileHash, this.chunkList.length);
          this.uploadId = uploadId;

          this.statusText = "上传中";
          const uploadedSet = new Set(uploaded);
          let uploadedCount = 0;
          const totalChunks = this.chunkList.length;

          for (const chunk of this.chunkList) {
            const partNumber = chunk.index + 1;
            if (uploadedSet.has(partNumber)) {
              uploadedCount++;
              this.uploadProgress = Math.floor(
                      (uploadedCount / totalChunks) * 100
              );
              continue;
            }
            await this._uploadChunk(
                    this.fileHash,
                    chunk.blob,
                    uploadId,
                    file.name,
                    partNumber
            );
            uploadedCount++;
            this.uploadProgress = Math.floor(
                    (uploadedCount / totalChunks) * 100
            );
            await this.$nextTick();
          }

          this.statusText = "合并文件";
          const { result } = await this._uploadFinish(this.fileHash);
          this.uploadedUrl = result;
        } catch (error) {
          console.error(error);
          this.$message.error("上传失败，请重试！");
        } finally {
          this.isUploading = false;
          this.statusText = "";
          this.uploadProgress = 0;
        }
      },
      async _uploadChunk(hash, file, uploadId, fileName, partNumber) {
        const formData = new FormData();
        formData.append("uploadId", uploadId);
        formData.append("fileHash", hash);
        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("partNumber", partNumber);
        return uploadFileChunk(formData);
      },
      async _uploadStart(file, hash, totalParts) {
        const formData = new FormData();
        formData.append("fileName", file.name);
        formData.append("fileHash", hash);
        formData.append("totalParts", totalParts);
        return uploadFileChunkStart(formData);
      },
      async _uploadFinish(fileHash) {
        const formData = new FormData();
        formData.append("fileHash", fileHash);
        return uploadChunkFinish(formData);
      },
      handlePreview() {
        const url = this.uploadedUrl;
        if (!url) return;
        this.canPreview = this.isImage(url) || this.isPDF(url);
        this.previewVisible = true;
      },
      isImage(url) {
        return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
      },
      isPDF(url) {
        return /\.pdf$/i.test(url);
      },
      isPreview(url) {
        return this.isImage(url) || this.isPDF(url);
      }
    }
  };
</script>

<style scoped>
  .upload-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    max-width: 600px;
  }

  .upload-btn {
    width: 100%;
  }

  .upload-progress {
    font-size: 11px;
    padding-left: 4px;
  }

  .upload-result {
    font-size: 11px;
    color: #333;
    word-break: break-all;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .upload-result a {
    color: #409eff;
    text-decoration: none;
  }

  .preview-img {
    width: 100%;
    max-height: 500px;
    object-fit: contain;
  }
</style>
