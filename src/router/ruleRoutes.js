import Layout from "../layout/index";

const ruleRoutes = [
    {
        path: '/auth',
        name: 'Auth',
        component: Layout,
        redirect: '/auth/user-list',
        meta: {
            title: '权限系统',
            icon: 'vue-dsn-icon-bug',
            permission: '/auth'
        },
        children: [
            {
                path: '/auth/user',
                name: 'UserList',
                component: () => import('@/views/auth/user/index.vue'),
                meta: {
                    icon: 'el-icon-user',
                    title: '用户管理',
                    permission: '/auth/user'
                }
            },
            {
                path: '/auth/role',
                name: 'RoleList',
                component: () => import('@/views/auth/role/index.vue'),
                meta: {
                    icon: 'el-icon-suitcase-1',
                    title: '角色管理',
                    permission: '/auth/role'
                }
            },
            {
                path: '/auth/resc',
                name: 'RescList',
                component: () => import('@/views/auth/resc/index.vue'),
                meta: {
                    icon: 'el-icon-takeaway-box',
                    title: '资源管理',
                    permission: '/auth/resc'
                }
            },
            {
                path: '/auth/func',
                name: 'FuncList',
                component: () => import('@/views/auth/func/index.vue'),
                meta: {
                    icon: 'el-icon-folder-opened',
                    title: '功能管理',
                    permission: '/auth/func'
                }
            }
        ]
    },
]

export default ruleRoutes