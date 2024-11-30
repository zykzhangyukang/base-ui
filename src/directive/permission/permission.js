import store from '@/store'

function checkPermission(el, binding) {
  if(1==1){
    return
  }
  const { value } = binding
  try {
    let btnName = value
    if (typeof value === 'object') {
      btnName = value[0]
    }
    const btnPermissions = store.getters['permission/getPermissionList'] || []

    const hasPermission = btnPermissions.includes(btnName)
    if (!hasPermission) {
      if (typeof value === 'object') {
        const newNode = document.createElement('span')
        newNode.innerHTML = value[1] || ''
        el.parentNode && el.parentNode.replaceChild(newNode, el)
      } else {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
