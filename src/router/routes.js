import Layout from '../layout'

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */

export const asyncRoutes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Layout,
    redirect: '/auth/user-list',
    meta: {
      title: '权限系统',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'user-list',
        name: 'UserList',
        component: () => import('@/views/auth/UserList.vue'),
        meta: {
          icon: 'el-icon-user',
          title: '用户管理'
        }
      },
      {
        path: 'role-list',
        name: 'RoleList',
        component: () => import('@/views/auth/RoleList.vue'),
        meta: {
          icon: 'el-icon-suitcase-1',
          title: '角色管理'
        }
      },
      {
        path: 'resc-list',
        name: 'RescList',
        component: () => import('@/views/auth/RescList.vue'),
        meta: {
          icon: 'el-icon-takeaway-box',
          title: '资源管理'
        }
      },
      {
        path: 'func-list',
        name: 'FuncList',
        component: () => import('@/views/auth/FuncList.vue'),
        meta: {
          icon: 'el-icon-folder-opened',
          title: '功能管理'
        }
      }
    ]
  },
  {
    path: '/error-page',
    name: 'ErrorPage',
    component: Layout,
    redirect: '/error-page/page-401',
    meta: {
      title: '错误页面',
      icon: 'vue-dsn-icon-bug'
    },
    children: [
      {
        path: 'page-401',
        name: 'Page401',
        component: () => import('../views/error-page/401'),
        meta: {
          title: '401页面'
        }
      },
      {
        path: 'page-404',
        name: 'Page404',
        component: () => import('../views/error-page/404'),
        meta: {
          title: '404页面'
        }
      }
    ]
  }
]
