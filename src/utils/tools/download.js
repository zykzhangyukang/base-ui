/**
 * 同步blob下线
 * @param blob
 * @param filename
 */
export function downloadFromBlob(blob, filename) {

    const a = document.createElement('a');
    a.download = filename;
    const blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    document.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
}

/**
 * 导出表格公共方法
 * @param content 文件内容
 * @param format 文件格式（如 xlsx, txt 等）
 * @param name 文件名（默认使用时间戳）
 */
export function downloadFile(content, format, name = Date.now() + '') {
    const blob = new Blob([content]);
    const fileName = `${name}.${format}`;

    if ('download' in document.createElement('a')) {
        // 非IE下载
        const link = document.createElement('a');
        link.download = fileName;
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 正确删除节点
        URL.revokeObjectURL(link.href); // 在删除后释放 URL
    } else if (navigator.msSaveBlob) {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName);
    } else {
        console.error('当前浏览器不支持文件下载功能！');
    }
}

