<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const emit = defineEmits(['close']);
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  emit('close');
  router.push('/sign-in');
};
</script>

<template>
  <div class="dropdown">
    <button @click="logout">Выйти</button>
  </div>
</template>

<style scoped>
.dropdown {
  position: absolute;
  top: 64px;
  right: 24px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px;
}
</style>
