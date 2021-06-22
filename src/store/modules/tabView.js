const tabView = {
    state: {
        visitedViews: [],
        cachedViews: []
    },
    mutations: {
        ADD_VISITED_VIEWS: (state, view) => {
            if (state.visitedViews.some(v => v.path === view.path))
                return
            let visitedViews = state.visitedViews;
            visitedViews.push(Object.assign({}, {
                        name: view.matched[view.matched.length - 1].components.name || view.name,
                        path: view.path,
                        title: view.meta.title,
                        fullTitle: view.meta.fullTitle
                    }
            ))
            state.visitedViews = visitedViews;
            let cachedViews = state.cachedViews;
            cachedViews.push(view.name);
            state.cachedViews = cachedViews;
        },
        DEL_VISITED_VIEWS: (state, view) => {
            let visitedViews = state.visitedViews;
            for (const [i, v] of visitedViews.entries()) {
                if (v.path === view.path) {
                    visitedViews.splice(i, 1)
                    break
                }
            }
            state.visitedViews = visitedViews;
            let cachedViews = state.cachedViews;
            for (const i of cachedViews) {
                if (i === view.name) {
                    const index = cachedViews.indexOf(i)
                    cachedViews.splice(index, 1)
                    break
                }
            }
            state.cachedViews = cachedViews;
        },
        DEL_OTHERS_VIEWS: (state, view) => {
            let visitedViews = state.visitedViews;
            for (const [i, v] of visitedViews.entries()) {
                if (v.path === view.path) {
                    visitedViews = visitedViews.slice(i, i + 1)
                    break
                }
            }
            state.visitedViews = visitedViews;
            let cachedViews = state.cachedViews;
            for (const i of cachedViews) {
                if (i === view.name) {
                    const index = cachedViews.indexOf(i)
                    cachedViews = cachedViews.slice(index, i + 1)
                    break
                }
            }
            state.cachedViews = cachedViews;
        },
        DEL_ALL_VIEWS: (state) => {
            state.visitedViews = [];
            state.cachedViews = [];
        }
    },
    actions: {
        addVisitedViews({commit}, view) {
            commit('ADD_VISITED_VIEWS', view)
        },
        delVisitedViews({commit, state}, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        delOthersViews({commit, state}, view) {
            return new Promise((resolve) => {
                commit('DEL_OTHERS_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        delAllViews({commit, state}) {
            return new Promise((resolve) => {
                commit('DEL_ALL_VIEWS')
                resolve([...state.visitedViews])
            })
        }
    }
}

export default tabView
