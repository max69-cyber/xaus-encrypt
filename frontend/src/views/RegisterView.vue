<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.ts'
  import { ref } from 'vue'

  const router = useRouter();
  const authStore = useAuthStore();

  const email = ref<string>('');
  const password = ref<string>('');
  const confirmPassword = ref<string>('');
  const isLoading = ref<boolean>(false);
  const error = ref<string>('');

  const register = async () => {
    error.value = '';

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }

    isLoading.value = true;

    try {
      // auth store register func
      if (error.value) {
        return;
      }
      await router.push('/encryptor');
    } catch (err) {
      error.value = 'Error while registration.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <form class="register-form" @submit.prevent="register">
    <h1>Register</h1>

    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <input v-model="confirmPassword" type="password" placeholder="Confirm password" />

    <p v-if="error" class="error">{{ error }}</p>

    <button class="primary-button" :disabled="isLoading">
      {{ isLoading ? "Registering..." : "Register" }}
    </button>

    <p class="switch">
      Already have an account?
      <RouterLink :to="{ name: 'sign-in' }">Sign in</RouterLink>
    </p>
  </form>
</template>

<style scoped>
  .register-form {
    width: 360px;
    padding: 40px 36px;
    background: white;
    border-radius: 18px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  h1 {
    font-size: 36px;
    text-align: center;
    margin-bottom: 8px;
  }

  input {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #ddd;
  }

  input:focus {
    border-color: #222;
  }

  .primary-button {
    margin-top: 6px;
    padding: 12px;
    border-radius: 12px;
    background: #222;
    color: white;
    font-weight: 500;
  }

  .primary-button:disabled {
    opacity: 0.6;
  }

  .error {
    color: #e54848;
    font-size: 14px;
    text-align: center;
  }

  .switch {
    text-align: center;
    font-size: 14px;
  }

  .switch a {
    margin-left: 4px;
    font-weight: 500;
    color: #222;
    text-decoration: none;
  }

  .switch a:hover {
    text-decoration: underline;
  }
</style>
