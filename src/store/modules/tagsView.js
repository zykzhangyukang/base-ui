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
  },
  addCacheView: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  delVisitedView(state, view) {
    const index = state.visitedViews.findIndex(item => {
      return item.path === view.path
    })
    state.visitedViews.splice(index, 1)
  },
  delCacheView: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
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
