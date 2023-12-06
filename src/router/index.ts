import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: '/',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'users',
          component: () => import('../pages/users.vue'),
        },
      ],
    },
  ],
})

export default router
