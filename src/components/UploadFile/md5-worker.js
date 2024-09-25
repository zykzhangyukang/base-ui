// md5-worker.js
import SparkMD5 from 'spark-md5';

self.onmessage = function (e) {
    const { file, uid } = e.data;
    const chunkSize = 1024 * 1024;
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5();

    const updateProgress = (processedChunk) => {
        const percent = Math.min(1, processedChunk / chunks) * 100;
        self.postMessage({
            status: 'progress',
            uid,
            percent: percent.toFixed(1),
        });
    };

    const getFileMd5 = () => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                spark.appendBinary(e.target.result);
                updateProgress(++currentChunk);

                if (currentChunk < chunks) {
                    loadNextChunk();
                } else {
                    resolve(spark.end());
                }
            };

            fileReader.onerror = (e) => {
                reject(e);
            };

            const loadNextChunk = () => {
                const start = currentChunk * chunkSize;
                const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                fileReader.readAsBinaryString(file.slice(start, end));
            };

            loadNextChunk();
        });
    };

    getFileMd5()
        .then((md5) => {
            self.postMessage({ status: 'success', uid, md5 });
        })
        .catch((error) => {
            self.postMessage({ status: 'failed', uid, error });
        });
};
