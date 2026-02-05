<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="main-container">
    <RouterView />
  </main>
</template>

<style>
  .main-container {
    min-height: calc(100vh - 65px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
