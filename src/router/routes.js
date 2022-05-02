
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Home.vue') },
    ]
  },
  {
    path: '/Profile',
    component: () => import('layouts/User.vue'),
    children: [
      { path: '', component: () => import('src/pages/Profile.vue') },
      { path: '', component: () => import('src/pages/Posts.vue') },
      { path: '/camera', component: () => import('src/pages/Camera.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
