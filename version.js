const fs = require('fs')

/**版本号，当前时间戳，保证唯一 */
const versionNo = new Date().getTime()
const htmlPath = './dist/index.html'

insertVersionMeta()

/**
 * 版本更新
 */
// 获取当前的时间戳，插入 html head 里面
function insertVersionMeta() {
  let html = fs.readFileSync(htmlPath, 'utf-8')
  html = html.replace('<head>', `<head><meta name="version_no" content="${versionNo}" />`)
  fs.writeFileSync(htmlPath, html)
}
