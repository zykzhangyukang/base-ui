import router, {DynamicRoutes} from '../../router/index'
import ruleRoutes from '../../router/ruleRoutes'
import {getConstantAll, getPermission} from "@/api/auth";

const state = {
    // 菜单数据
    menusList: [],
    // 权限(按钮)数据
    buttonList: [],
    // 权限(路由)数据
    permission: null,
    // 常量数据
    const:[]
}

const getters = {
    btnPermissions: state => {
        if (state.buttonList!=null && state.buttonList.length > 0) {
            return state.buttonList;
        }
        return [];
    }
}

const mutations = {
    SET_MENU(state, menusList) {
        state.menusList = menusList;
    },
    SET_BUTTON(state, buttonList) {
        state.buttonList = buttonList;
    },
    SET_PERMISSION(state, permission) {
        state.permission = permission;
    },
    SET_CONSTANTS(state, constants){
        state.const = constants;
    },
}

const actions = {
    async FETCH_PERMISSION({commit, state}) {
        let {result: permission} = await getPermission();
        // 路由比对
        let userRouterList = recursionRouter(permission.menus, ruleRoutes);
        DynamicRoutes.push(...userRouterList);
        // 设置菜单
        commit('SET_MENU', DynamicRoutes);
        // 设置按钮权限
        commit('SET_BUTTON', permission.buttons)
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
