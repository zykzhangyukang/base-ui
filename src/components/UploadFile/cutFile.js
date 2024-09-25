import Worker from 'worker-loader!@/components/UploadFile/worker.js';
export const CHUNK_SIZE = 1024 * 1024 * 5;

export async function cutFile(file) {
    return new Promise(resolve => {
        const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
        const threadChunkCount = Math.ceil(chunkCount / (navigator.hardwareConcurrency || 4));
        const result = [];
        let finishCount = 0;

        for (let i = 0; i < (navigator.hardwareConcurrency || 4); i++) {
            const worker = new Worker();
            const start = i * threadChunkCount;
            let end = (i + 1) * threadChunkCount;

            if (end > chunkCount) {
                end = chunkCount;
            }

            worker.postMessage({
                file,
                CHUNK_SIZE,
                startChunkIndex: start,
                endChunkIndex: end
            });

            worker.onmessage = e => {
                for (let j = start; j < end; j++) {
                    result[j] = e.data[j - start];
                }
                worker.terminate();
                finishCount++;

                if (finishCount === (navigator.hardwareConcurrency || 4)) {
                    resolve(result);
                }
            };
        }
    });
}

