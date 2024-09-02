import Layout from "../layout/index";

const ruleRoutes = [
    {
        path: '/sync',
        name: 'Sync',
        component: Layout,
        redirect: '/sync/result',
        meta: {
            title: '同步系统',
            icon: 'vue-dsn-icon-tishi2',
            permission: '/sync'
        },
        children: [
            {
                path: '/sync/plan',
                name: 'SyncPlan',
                component: () => import('@/views/sync/plan/index.vue'),
                meta: {
                    icon: 'el-icon-setting',
                    title: '同步计划',
                    permission: '/sync/plan'
                }
            },
            {
                path: '/sync/result',
                name: 'SyncResult',
                component: () => import('@/views/sync/result/index.vue'),
                meta: {
                    icon: 'el-icon-tickets',
                    title: '同步记录',
                    permission: '/sync/result'
                }
            },
            {
                path: '/sync/message',
                name: 'SyncMessage',
                component: () => import('@/views/sync/message/index.vue'),
                meta: {
                    icon: 'el-icon-monitor',
                    title: '本地消息',
                    permission: '/sync/message'
                }
            },
            {
                path: '/sync/callback',
                name: 'SyncCallback',
                component: () => import('@/views/sync/callback/index.vue'),
                meta: {
                    icon: 'el-icon-alarm-clock',
                    title: '回调消息',
                    permission: '/sync/callback'
                }
            }
        ]
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Layout,
        meta: {
            title: '权限系统',
            icon: 'vue-dsn-icon-xinzeng',
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
            },
            {
                path: '/auth/log',
                name: 'LogList',
                component: () => import('@/views/auth/log/index.vue'),
                meta: {
                    icon: 'el-icon-document',
                    title: '日志管理',
                    permission: '/auth/log'
                }
            },
        ]
    },
]

export default ruleRoutes
