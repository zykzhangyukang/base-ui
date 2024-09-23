import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import user from "./modules/user";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    tagsView,
    permission,
    user
  }
})

export default store
