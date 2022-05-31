
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/',
      component: () => import('src/pages/PageHome.vue'),
      name: 'Welcome',
      meta:{
        title: "Welcome"
      }
      },

      { path: '/home',
      component: () => import('src/pages/PageHome.vue'),
      name: 'Home',
      meta:{
        title: "Home"
      }
      },

      { path: '/search',
      component: () => import('src/pages/PageSearch.vue'),
      name: 'Search',
      meta:{
        title: "Search"
      }},

      { path: '/camera',
      component: () => import('src/pages/PageCamera.vue'),
      name: 'Camera',
      meta:{
        title: "Camera",
        requiresAuth: true
      }},

      { path: '/profile',
      component: () => import('src/pages/PageProfile.vue'),
      name: 'Profile',
      meta:{
        title: "Profile",
        requiresAuth: true
      }},

      { path: '/tattoist',
      component: () => import('src/pages/PageTattoist.vue'),
      name: 'Tattoist',
      props: true,
      meta:{
        title: "Tattoist"
      }},

      { path: '/settings',
      component: () => import('src/pages/PageSettings.vue'),
      name: 'Settings',
      meta:{
        title: "Settings",
        requiresAuth: true
      }},

      { path: '/auth',
      component: () => import('src/pages/PageAuth.vue'),
      name: 'Auth',
      meta:{
        title: "Auth"
      }}
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
