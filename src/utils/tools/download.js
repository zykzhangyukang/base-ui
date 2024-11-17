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
 * @param content
 * @param format
 * @param name
 */
export function toXlsx(content, format, name = Date.now() + '') {
    const blob = new Blob([content]);
    const fileName = `${name}.` + format;

    if ('download' in document.createElement('a')) {
        // 非IE下载
        const link = document.createElement('a');
        link.download = fileName;
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.removeChild(link);
    } else {
        // IE10+下载
        navigator.msSaveBlob(fileName)
    }
}
