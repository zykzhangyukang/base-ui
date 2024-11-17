

/**
 * 驼峰转下划线
 * @param name
 * @returns {string}
 */
export function toLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}
