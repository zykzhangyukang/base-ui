import {createChunk} from './createChunk.js'

self.onmessage = async (e) => {
    const {
        file,
        CHUNK_SIZE,
        startChunkIndex: start,
        endChunkIndex: end,
    } = e.data;
    const proms = []
    for (let i = start; i < end; i++) {
        proms.push(createChunk(file, i, CHUNK_SIZE))
    }
    const chunks =  await Promise.all(proms)
    self.postMessage(chunks)
}