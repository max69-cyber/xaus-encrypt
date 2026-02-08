<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.ts'
  import { ref } from 'vue'
  import { authErrorMessages } from '@/types/authErrors.ts'

  const router = useRouter();
  const authStore = useAuthStore();

  const email = ref<string>('');
  const password = ref<string>('');
  const isLoading = ref<boolean>(false);
  const error = ref<string>('');

  const login = async () => {
    error.value = '';
    isLoading.value = true;

    try {
      await authStore.signIn(email.value, password.value);
      await router.push('/encryptor');
    } catch (err) {
      const code = (err as { code: string })?.code;
      error.value = authErrorMessages[code!] ?? 'Something went wrong';
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <form class="sign-in-form" @submit.prevent="login">
    <h1>Sign in</h1>

    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <p class="error">
      {{ error || '\u00A0' }}
    </p>

    <button class="primary-button" :disabled="isLoading">
      {{ isLoading ? "Signing in..." : "Sign in" }}
    </button>

    <p class="switch">
      No account?
      <RouterLink :to="{ name: 'register' }">Register</RouterLink>
    </p>
  </form>
</template>

<style>
  .sign-in-form {
    width: 360px;
    padding: 40px 36px;
    background: white;
    border-radius: 18px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    min-height: 18px;
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
