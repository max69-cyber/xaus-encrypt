<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { ref } from 'vue'

const authStore = useAuthStore();

const isProfileDropdownOpened = ref<boolean>(false);

const openProfileDropdown = () => {
  isProfileDropdownOpened.value = !isProfileDropdownOpened.value;
};

const logout = () => {
  //authStore.logout();
  isProfileDropdownOpened.value = false;
}
</script>

<template>
  <header class="header">
    <RouterLink class="logo" :to="{ name: 'encryptor' }">🔑</RouterLink>

    <div class="controls-container">
      <template v-if="authStore.isLoggedIn">
        <RouterLink class="link" :to="{ name: 'encryptor' }">Encryptor</RouterLink>
        <RouterLink class="link" :to="{ name: 'history' }">History</RouterLink>

        <div class="avatar" @click="openProfileDropdown">🤖</div>
      </template>

      <template v-else>
        <RouterLink class="button primary" :to="{ name: 'auth', query: { mode: 'sign-in' } }">Sign in</RouterLink>
        <RouterLink class="button ghost" :to="{ name: 'auth' , query: { mode: 'register' } }">Register</RouterLink>
      </template>
    </div>
  </header>
</template>

<style scoped>
 .header {
   height: 64px;
   display: flex;
   padding: 0 24px;
   border-bottom: 1px solid #eee;
   align-items: center;
   justify-content: space-between;
   background: #ffffff;
 }

 .logo {
   display: flex;
   align-items: center;
   gap: 8px;
   font-size: 20px;
   font-weight: 700;
   text-decoration: none;
   color: inherit;
 }

 .controls-container {
   display: flex;
   align-items: center;
   gap: 24px;
 }

 .link {
   text-decoration: none;
   color: #333333;
   font-weight: 500;
 }
 .link:hover {
   opacity: 0.8;
 }

 .button {
   padding: 6px 14px;
   border-radius: 8px;
   text-decoration: none;
   font-weight: 500;
   font-size: 14px;
 }
 .primary {
   background: #222222;
   color: #fff;
 }
 .ghost {
   border: 1px solid #cccccc;
   color: #333333;
 }

 .avatar {
   width: 36px;
   height: 36px;
   border-radius: 50%;
   background: #222;
   color: white;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
 }
</style>
