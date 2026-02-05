<script setup lang="ts">
</script>

<template>

  <div class="not-found-container">
    <div class="not-found-card">
      <h1>404</h1>
      <p>Page not found</p>

      <RouterLink class="button-back" :to="{ name: 'encryptor' }">Back to Encryptor</RouterLink>
    </div>

  </div>
</template>

<style scoped>
  .not-found-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 32px 64px;
    min-width: 240px;

    background: white;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }

  h1 {
    font-size: 96px;
    margin-bottom: -16px;
  }

  p {
    font-size: 24px;
    margin-bottom: 64px;
    color: #555;
  }

  .button-back {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 10px;
    background: #222;
    color: white;
    text-decoration: none;
    font-weight: 500;
  }

  .button-back:hover {
    opacity: 0.85;
  }
</style>

