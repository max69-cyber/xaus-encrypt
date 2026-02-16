<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCryptoStore } from '@/stores/crypto.ts'
import { authErrorMessages } from '@/types/authErrors.ts'
import type { HistoryItem } from '@/types/types.ts'

const history = ref<HistoryItem[]>([]);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const cryptoStore = useCryptoStore();

onMounted(async () => {
  try {
    history.value = await cryptoStore.getHistory();
  } catch (err) {
    const code = (err as { code: string })?.code
    error.value = authErrorMessages[code!] ?? 'Something went wrong'
  } finally {
    isLoading.value = false
  }
});

const copy = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <div class="history-card">
    <h2>Encryption History</h2>

    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <div v-else-if="!history.length" class="empty">No history yet</div>

    <div v-else class="list">
      <div v-for="item in history" :key="item.id" class="history-item">
        <div class="meta">
          <span class="algo">{{ item.algorithm.toUpperCase() }}</span>
          <span class="date">
            {{ new Date(item.created_at).toLocaleString() }}
          </span>
        </div>

        <div class="cipher">
          {{ item.encrypted_text }}
          <button
            class="copy-btn"
            @click="copy(item.encrypted_text)"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-card {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0,0,0,.12);

  display: flex;
  flex-direction: column;

  height: 80vh;
  overflow: hidden;
}

.history-card h2 {
  padding: 20px 24px 16px 24px;
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
}

.list {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.history-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.cipher {
  position: relative;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px 64px 16px 12px;
  font-size: 13px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.copy-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #e5e7eb;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

.copy-btn:hover {
  background: #d1d5db;
}

.error {
  padding: 24px;
  color: #dc2626;
}

.empty {
  padding: 24px;
  color: #6b7280;
  text-align: center;
}
</style>
