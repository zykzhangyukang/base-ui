<template>
    <div>
        <el-upload
                ref="upload"
                class="upload-demo"
                action=""
                :before-upload="handleBeforeUpload"
                :file-list="fileList"
                :show-file-list="false"
        >
            <el-button slot="trigger" type="primary">选择文件</el-button>

            <el-button v-if="fileList.length > 0" type="success" @click="submitUpload">上传</el-button>
            <div v-if="progressPercent !== 0" class="progress-info">进度: {{ progressPercent }}%</div>
            <div v-if="md5Hash" class="md5-info">MD5: {{ md5Hash }}</div>
        </el-upload>
    </div>
</template>

<script>
    import Md5Worker from 'worker-loader!@/components/UploadFile/md5-worker.js';

    export default {
        data() {
            return {
                fileList: [],
                worker: null,
                progressPercent: 0,
                md5Hash: '',
            };
        },
        methods: {
            handleBeforeUpload(file) {
                this.fileList.push(file);
                this.startMD5Calculation(file);
                return false;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            startMD5Calculation(file) {
                this.worker = new Md5Worker();

                this.worker.onmessage = (e) => {
                    const { status, uid, md5, percent, error } = e.data;

                    if (status === 'progress') {
                        this.progressPercent = percent;
                    } else if (status === 'success') {
                        this.md5Hash = md5;
                        this.worker.terminate();
                    } else if (status === 'failed') {
                        this.md5Hash = `计算失败: ${error}`;
                        this.worker.terminate();
                    }
                };

                this.worker.postMessage({ file, uid: file.uid });
            },
        },
    };
</script>

<style scoped>
    .upload-demo {
        margin: 20px;
    }

    .progress-info {
        margin-top: 10px;
    }

    .md5-info {
        margin-top: 10px;
        font-weight: bold;
    }
</style>
