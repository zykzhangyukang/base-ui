import store from "@/store";

export const adminDomain = "admin";

/**
 * 格式化显示常量信息
 * @param group
 * @param domain
 * @returns {*|*[]}
 */
export function getConst(group,domain) {

  if (!group) {
    return [];
  }
  if(!store.state.permission.const[domain]){
    return [];
  }
  const arr = store.state.permission.const[domain].filter(e => e.group === group);
  if (arr.length) {
    return arr[0].itemList;
  }
  return [];
}


export function formatConst(list) {
  const obj = {};
  list.forEach((ele) => {

    obj[ele.code] = ele.name;
  })
  return obj;
}

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


export function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 对象深拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  return JSON.parse(JSON.stringify(source))
}

/**
 * 驼峰转下划线
 * @param name
 * @returns {string}
 */
export function toLine(name) {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}


/**
 * 获取粘贴时的纯文本
 * @param e
 * @returns {string}
 */
export function getPlainText(e) {
  function uniform(str) {
    const _str = supportIE(str).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const arr = _str.split(/\r\n|\r|\n/)
    if (arr) {
      return arr.map(item => {
        if (item.length > 0) {
          return '<div>' + item + '</div>'
        }
        return '<div><br></div>'
      }).join('')
    }
    return _str
  }
  let innerText = ''
  const TAB = ' '.repeat(2)
  e.preventDefault()
  if (e.clipboardData) {
    innerText = (e.originalEvent || e).clipboardData.getData('text/plain').replace(/\t/g, TAB)
    document.execCommand('insertHtml', false, uniform(innerText))
  } else if (window.clipboardData) {
    innerText = window.clipboardData.getData('Text').replace(/\t/g, TAB)
    if (document.selection) {
      document.selection.createRange().pasteHTML(uniform(innerText))
    } else if (window.getSelection) {
      const sel = window.getSelection()
      const range = sel.getRangeAt(0)
      // 创建临时元素，使得TextRange可以移动到正确的位置
      const tempEl = document.createElement('span')
      tempEl.innerHTML = '&#FEFF;'
      range.deleteContents()
      range.insertNode(tempEl)
      const textRange = document.body.createTextRange()
      textRange.moveToElementText(tempEl)
      tempEl.parentNode.removeChild(tempEl)
      textRange.pasteHTML(uniform(innerText))
      textRange.collapse(false)
      textRange.select()
    }
  }
  return uniform(innerText)
}

/**
 * IE中的p标签转换成div
 * @param str
 * @returns {*}
 */
export function supportIE(str) {
  return str.replace(/<(\/?)p>/g, '<$1div>')
}

/**
 * contenteditable 光标定位到最后
 * @param target
 * */
export function keepCursorEnd(target) {
  // 非IE浏览器
  if (window.getSelection) {
    // 解决Firefox不获取焦点无法定位问题
    target.focus()
    // 创建range对象
    const range = window.getSelection()
    // 选择target下所有子内容
    range.selectAllChildren(target)
    // 光标移至最后
    range.collapseToEnd()
  } else if (document.selection) { // IE浏览器
    // 创建range对象
    const range = document.selection.createRange()
    // 定位到target
    range.moveToElementText(target)
    // 光标移至最后
    range.collapse(false)
    range.select()
  }
}

/**
 * 将base64图片数据转换成Blob
 * @param image
 * @returns {Blob}
 */
export function base64toBlob(image) {
  const bytes = window.atob(image.split(',')[1])
  const array = []
  for (let i = 0; i < bytes.length; i++) {
    array.push(bytes.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' })
}

/**
 * 计算图片宽高及比率
 * @param imageTrueW 图片实际宽
 * @param imageTrueH 图片实际高
 * @param showAreaW 展示区宽度
 * @param showAreaH 展示区高度
 * */
export function calcImageSize(imageTrueW, imageTrueH, showAreaW, showAreaH) {
  let [width, height, ratio] = [0, 0, 0]
  // 图片真实宽大于真实高
  if (imageTrueW > imageTrueH) {
    if (imageTrueW >= showAreaW) { // 真实宽大于或等于展示区最大宽
      const imageRatioH = imageTrueH * (showAreaW / imageTrueW)
      // 按展示区最大宽与实际宽比率换算后，高度大于显示高度时
      if (imageRatioH >= showAreaW) {
        width = imageTrueW * (showAreaH / imageTrueH)
        height = showAreaH
        ratio = imageTrueH / showAreaH
      } else {
        width = showAreaW
        height = imageRatioH
        ratio = imageTrueW / showAreaW
      }
    } else {
      width = imageTrueW
      height = imageTrueH
      ratio = 1
    }
  } else { // 图片真实宽小于或等于真实高
    if (imageTrueH >= showAreaH) { // 真实高大于或等于展示区最大高
      width = imageTrueW * (showAreaH / imageTrueH)
      height = showAreaH
      ratio = imageTrueH / showAreaH
    } else {
      width = imageTrueW
      height = imageTrueH
      ratio = 1
    }
  }
  return {
    width,
    height,
    ratio
  }
}
