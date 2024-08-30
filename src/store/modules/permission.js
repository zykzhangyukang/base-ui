import {getPermission} from "../../api/login";
import router,{DynamicRoutes} from '../../router/index'
import ruleRoutes from '../../router/ruleRoutes'

const state = {
    // 菜单数据
    menusList: null,
    // 权限数据
    permission: null
}

const getters = {}

const mutations = {
    SET_MENU(state, menusList) {
        state.menusList = menusList;
    },
    CLEAR_MENU(state) {
        state.menusList = null;
    },
    SET_PERMISSION(state, permission) {
        state.permission = permission;
    },
    CLEAR_PERMISSION() {
        state.permission = null;
    }
}

const actions = {
    async FETCH_PERMISSION({commit, state}) {
        let {result: permission} = await getPermission();
        // 路由比对
        let routers = recursionRouter(permission.menus, ruleRoutes)
        DynamicRoutes.push(...routers);
        // 设置菜单
        commit('SET_MENU', DynamicRoutes);
        // 初始化路由
        let initialRoutes = router.options.routes;
        DynamicRoutes.map(e=>{
            router.addRoute(e);
        })
        // 设置权限
        commit('SET_PERMISSION', [...initialRoutes , ...DynamicRoutes])
    }
}

function recursionRouter(userRouter = [], allRouter = []) {
    const realRouters = [];
    allRouter.forEach((v, i) => {
        userRouter.forEach((item, index) => {
            if (item.key === v.meta.permission) {
                if (item.children && item.children.length > 0) {
                    v.children = recursionRouter(item.children, v.children);
                }
                realRouters.push(v);
            }
        })
    })
    return realRouters;
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
