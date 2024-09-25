<template>
    <div>
        <el-upload
                ref="upload"
                class="upload-demo"
                action=""
                :multiple="false"
                :limit="1"
                :file-list="fileList"
                :show-file-list="false"
                :auto-upload="true"
                :http-request="httpRequest"
        >
            <el-button slot="trigger" type="primary">选择文件</el-button>
        </el-upload>
    </div>
</template>

<script>
    import SparkMD5 from 'spark-md5';
    import {cutFile} from "./cutFile";
    import {uploadFileChunk} from "../../api/file";

    export default {
        data() {
            return {
                worker: null,
                fileList: []
            };
        },
        methods: {
            async httpRequest(option) {
                const spark = new SparkMD5.ArrayBuffer();
                const chunkList = await cutFile(option.file);
                // 计算整个文件的 hash
                chunkList.forEach(e => {
                    spark.append(e.hash);
                });
                const hash = spark.end();
                // 逐个上传分片
                for (const chunk of chunkList) {
                    await this._uploadChunk(hash, chunk);
                }
            },
            async _uploadChunk(hash, chunk) {
                console.log(chunk)
                const formData = new FormData();
                formData.append('hash', hash)
                formData.append('file', chunk.blob)
                formData.append('num', chunk.index)
                try {
                    const response = await uploadFileChunk(formData);
                    console.log('Chunk uploaded successfully:', response);
                } catch (error) {
                    console.error('Error uploading chunk:', error);
                    // 可以添加重试逻辑或其他处理逻辑
                }
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
