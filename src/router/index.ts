import { authGuard } from '@auth0/auth0-vue'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import { createRouter as createVueRouter, createWebHistory } from 'vue-router'
import { createAuthRoleGuard } from '@/guards/roleGuard'

export default function createRouter(app: App): Router {
  return createVueRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        component: () => import('../layouts/default.vue'),
        beforeEnter: authGuard,
        children: [
          {
            path: '/',
            component: () => import('../pages/dashboard.vue'),
          },
          {
            path: 'users',
            component: () => import('../pages/users.vue'),
            beforeEnter: createAuthRoleGuard(app),
          },
        ],
      },
    ],
  })
}
