import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/encryptor',
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignInView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/encryptor',
      name: 'encryptor',
      component: () => import('../views/EncryptView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/decryptor',
      name: 'decryptor',
      component: () => import('../views/DecryptView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: false },
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/not-found',
    }
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return {
      name: 'sign-in',
      query: { redirect: to.fullPath },
    }
  }
});

export default router;
