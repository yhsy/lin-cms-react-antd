/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 08:35:48
 * @LastEditTime: 2019-09-25 19:05:45
 * @LastEditors: Please set LastEditors
 */
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
          // 招聘管理
          {
            path: '/jobs',
            name: 'Jobs',
            icon: 'usergroup-add',
            component: './jobs',
          },
          // 加盟管理
          {
            path: '/join',
            name: 'Join',
            icon: 'gold',
            component: './join',
          },
          // 系统管理
          {
            path: '/system',
            name: 'System',
            icon: 'laptop',
            routes: [
              // 管理员
              {
                path: '/system/admin',
                name: 'sysAdmin',
                icon: 'team',
                component: './system/admin',
              }
            ]
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
