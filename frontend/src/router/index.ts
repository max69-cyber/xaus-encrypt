import { createRouter, createWebHistory } from 'vue-router'
import EncryptView from '../views/EncryptView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/encryptor',
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
    {
      path: '/encryptor',
      name: 'encryptor',
      component: () => import('../views/EncryptView.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/not-found',
    }
  ],
})

export default router
