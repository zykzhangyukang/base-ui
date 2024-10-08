import router, {DynamicRoutes} from '../../router/index'
import ruleRoutes from '../../router/ruleRoutes'
import {getConstantAll, getPermission} from "@/api/auth";

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
        state.menusList = [];
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
        let userRouterList = recursionRouter(permission.menus, ruleRoutes);
        DynamicRoutes.push(...userRouterList);
        // 设置菜单
        commit('SET_MENU', DynamicRoutes);
        // 初始化路由
        let initialRoutes = router.options.routes;
        // 添加动态路由
        router.$addRoutes(DynamicRoutes);
        // 设置权限
        commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
        // 设置常量
        let {result: consts} = await getConstantAll();
        commit('SET_CONSTANTS', consts);
    }
}

function recursionRouter(userRouter = [], allRouter = []) {
    const menuKeyList = extractKeys(userRouter);
    return filterRouters(allRouter, menuKeyList);
}

// 提取用户所有有权限访问的 key
function extractKeys(routes = []) {
    return routes.reduce((keys, route) => {
        keys.push(route.key);
        if (route.children) keys.push(...extractKeys(route.children));
        return keys;
    }, []);
}

// 根据权限 key 过滤路由
function filterRouters(routes = [], keys = []) {
    return routes.filter(route => {
        if (keys.includes(route.meta.permission)) {
            if (route.children) route.children = filterRouters(route.children, keys);
            return true;
        }
        return false;
    });
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
