const router = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/banner',
            name: 'Banner',
            icon: 'picture',
            component: './banner',
          },
          // 栏目管理
          {
            path: '/columns',
            name: 'Columns',
            icon: 'apartment',
            component: './columns',
          },
          // 文章管理
          {
            path: '/article',
            name: 'Article',
            icon: 'container',
            component: './article',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
]

export default router