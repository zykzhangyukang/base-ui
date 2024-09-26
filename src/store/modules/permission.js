import {getConstantAll, getPermission} from "@/api/login";
import router, {DynamicRoutes} from '../../router/index'
import ruleRoutes from '../../router/ruleRoutes'

const state = {
    // 菜单数据
    menusList: [],
    // 权限数据
    permission: null,
    // 常量数据
    const:[]
}

const getters = {
    btnPermissions: state => {
        if (state.permission != null && state.permission.buttons != null && state.permission.buttons.length > 0) {
            return state.permission.buttons
        }
        return [];
    }
}

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
    },
    SET_CONSTANTS(state, constants){
        state.const = constants;
    }
}

const actions = {
    async FETCH_PERMISSION({commit, state}) {
        let {result: permission} = await getPermission();
        // 路由比对
        let routers = recursionRouter(permission.menus, ruleRoutes);
        DynamicRoutes.push(...routers);
        // 设置菜单
        commit('SET_MENU', DynamicRoutes);
        // 初始化路由
        let initialRoutes = router.options.routes;
        DynamicRoutes.map(r => {
            router.addRoute(r);
        })
        // 设置权限
        commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
        // 设置常量
        let {result: consts} = await getConstantAll();
        commit('SET_CONSTANTS', consts);
    }
}

function recursionRouter(userRouter = [], allRouter = []) {
    const realRouters = [];
    userRouter.forEach((item, index) => {
        allRouter.forEach((v, i) => {
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
