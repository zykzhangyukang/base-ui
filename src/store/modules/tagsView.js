const state = {
  visitedViews: [],
  cachedViews: []
}

const getters = {
  visitedViews: (state) => state.visitedViews
}

const mutations = {
  addVisitedView(state, view) {
    if (state.visitedViews.some(item => item.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-title'
      })
    )
    // 添加缓存
    if(!view.meta.keepAlive) return
    if(state.cachedViews.some(v=>v.fullPath === view.fullPath)) return
    state.cachedViews.push(view);
  },
  delVisitedView(state, view) {
    const index = state.visitedViews.findIndex(item => {
      return item.path === view.path
    })
    state.visitedViews.splice(index, 1)
    // 删除缓存
    if(!view.meta.keepAlive) return;
    const cacheIndex = state.cachedViews.findIndex(v => v.fullPath === view.fullPath)
    if(cacheIndex >=0){
      state.cachedViews.splice(cacheIndex, 1)
    }
  },
  delAllVisitedView(state) {
    state.visitedViews = state.visitedViews.filter(item => item.meta.fixed)
  },
  delOthersVisitedView(state, view) {
    state.visitedViews = state.visitedViews.filter(item => {
      return item.meta.fixed || item.path === view.path
    })
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations
}
