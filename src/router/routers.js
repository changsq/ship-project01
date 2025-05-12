import Main from '@/components/main'
import Main1 from '@/components/main1'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/login',
    component: Main1,
    meta: {
      hideInBread: true,
      notCache: true,
      hideInMenu: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
          hideInBread: true,
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/home/homepage.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components4',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'introduction',
        name: 'introduction',
        meta: {
          icon: 'md-git-branch',
          title: '简介'
        },
        component: () => import('@/view/components/introduction/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components3',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'setting',
        name: 'setting',
        meta: {
          icon: 'md-git-branch',
          title: '指标的修改与说明'
        },
        component: () => import('@/view/components/setting/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'power_sys_test',
        name: 'power_sys_test',
        meta: {
          icon: 'md-git-branch',
          title: '动力系统评测'
        },
        component: () => import('@/view/components/power-sys-test/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components5',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'power_sys_choose',
        name: 'power_sys_choose',
        meta: {
          icon: 'md-git-branch',
          title: '适用性评估'
        },
        component: () => import('@/view/components/power-sys-choose/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'data_storage',
        name: 'data_storage',
        meta: {
          icon: 'md-git-branch',
          title: '谱系化'
        },
        component: () => import('@/view/components/data-storage/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'ECS',
        name: 'ECS',
        meta: {
          icon: 'md-git-branch',
          title: '电子海图'
        },
        component: () => import('@/view/components/electronic-chart/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'data_test',
        name: 'data_test',
        meta: {
          icon: 'md-git-branch',
          title: '测试数据'
        },
        component: () => import('@/view/components/data-test/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components2',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'puxi',
        name: 'puxi',
        meta: {
          icon: 'md-git-branch',
          title: '谱系可视化'
        },
        component: () => import('@/view/components/puxi/index.vue')
      }
    ]
  },
]
