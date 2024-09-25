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
    export default {
        data() {
            return {
                worker: null,
                fileList: []
            };
        },
        methods: {
            async httpRequest(option){
                const spark = new SparkMD5.ArrayBuffer();
                let chunkList = await cutFile(option.file);
                chunkList.forEach(e=>{
                    spark.append(e.hash);
                })
                let hash = spark.end();
                this.uploadChunks(hash, chunkList);
            },
            uploadChunks(){

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
