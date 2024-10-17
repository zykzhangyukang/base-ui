import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import './directive/install'
import './router/permission'
import './assets/icon-fonts/iconfont.css'
import './assets/icon-fonts/iconfont'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false
Vue.config.silent = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
