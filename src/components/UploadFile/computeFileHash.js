import SparkMD5 from 'spark-md5';

/**
 * 计算文件的 MD5 hash
 * @param {Array} chunkList - 文件分片的数组
 * @param {string} fileName - 文件名
 * @param {number} fileSize - 文件大小
 * @returns {Promise<string>} 返回文件的 MD5 hash
 */
export async function computeFileHash(chunkList, fileName, fileSize) {
    const spark = new SparkMD5();

    // 拼接所有分片的 hash 字符串
    const combinedHashString = chunkList.map(chunk => chunk.hash).join('');

    // 进行二次 hash 计算
    spark.append(combinedHashString + fileName + fileSize);

    // 返回最终的文件 hash
    return spark.end();
}
