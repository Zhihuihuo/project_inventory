import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { Form } from 'element-ui'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/order',
    component: Layout,
    name: 'Example',
    meta: { title: '销售管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'Order-index',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'table' }
      },
      {
        path: 'index',
        name: 'Order-index',
        component: () => import('@/views/order/index'),
        meta: { title: '发货明细', icon: 'table' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    // redirect: '/order/index',
    name: 'Example',
    meta: { title: '库存管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'stock',
        name: 'Product-stock',
        component: () => import('@/views/product/stock'),
        meta: { title: '存货管理', icon: 'table' }
      },
      {
        path: 'in_stock',
        name: 'Product-in_stock',
        component: () => import('@/views/product/in_stock'),
        meta: { title: '采购入库', icon: 'table' }
      },
      {
        path: 'out_stock',
        name: 'Product-out_stock',
        component: () => import('@/views/product/out_stock'),
        meta: { title: '销售出库', icon: 'table' }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/index',
    name: 'Finance',
    meta: { title: '财务管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'receivable',
        name: 'Finance-receivable',
        component: () => import('@/views/finance/receivable'),
        meta: { title: '应收管理', icon: 'table' }
      },
      {
        path: 'payment',
        name: 'Finance-payment',
        component: () => import('@/views/finance/payment'),
        meta: { title: '应付管理', icon: 'table' }
      },
      {
        path: 'index',
        name: 'Finance-index',
        component: () => import('@/views/finance/index'),
        meta: { title: '单据管理', icon: 'table' }
      },
      {
        path: 'detail',
        name: 'Finance-detail',
        component: () => import('@/views/finance/detail'),
        meta: { title: '账单明细', icon: 'table' }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/index',
    name: 'Customer',
    meta: { title: '客户管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'Customer-index',
        component: () => import('@/views/customer/index'),
        meta: { title: '客户列表', icon: 'table' }
      },
      {
        path: 'new',
        name: 'Customer-new',
        component: () => import('@/views/customer/new'),
        meta: { title: '添加客户', icon: 'table' }
      },
      {
        path: 'new',
        name: 'Customer-finance',
        component: () => import('@/views/customer/finance'),
        meta: { title: '客户资金', icon: 'table' }
      },
      {
        path: 'new',
        name: 'Customer-account',
        component: () => import('@/views/customer/account'),
        meta: { title: '客户对账', icon: 'table' }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    name: 'Basic',
    meta: { title: '基础资料', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'product/index',
        // name: 'Product-index',
        component: () => import('@/views/product/index'),
        meta: { title: '产品管理', icon: 'table' }
      },
      {
        path: 'department/index',
        name: 'Department-index',
        component: () => import('@/views/department/index'),
        meta: { title: '部门管理', icon: 'table' }
      },
      {
        path: 'storeroom/index',
        name: 'Storeroom-index',
        component: () => import('@/views/storeroom/index'),
        meta: { title: '仓库管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: { title: '系统管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'User-index',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'index',
        name: 'User-index',
        component: () => import('@/views/user/index'),
        meta: { title: '修改密码', icon: 'table' }
      },
      {
        path: 'index',
        name: 'User-index',
        component: () => import('@/views/user/index'),
        meta: { title: '权限管理', icon: 'table' }
      },
      {
        path: 'index',
        name: 'User-index',
        component: () => import('@/views/user/index'),
        meta: { title: '操作日志', icon: 'table' }
      },
      {
        path: 'index',
        name: 'User-index',
        component: () => import('@/views/user/index'),
        meta: { title: '系统参数', icon: 'table' }
      },
      {
        path: 'index',
        name: 'User-index',
        component: () => import('@/views/user/index'),
        meta: { title: '自定义报表', icon: 'table' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '多级菜单',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '外链', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

