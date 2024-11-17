/**
 * 获取前n天的时间
 * @param days
 * @returns {string}
 */
export function getNDaysAgo(days) {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - days);
    targetDate.setHours(0, 0, 0);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
    const day = String(targetDate.getDate()).padStart(2, '0');
    const hours = String(targetDate.getHours()).padStart(2, '0');
    const minutes = String(targetDate.getMinutes()).padStart(2, '0');
    const seconds = String(targetDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
