<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCryptoStore } from '@/stores/crypto.ts'
import { cryptoErrorMessages } from '@/types/cryptoErrors.ts'
import HidePasswordButton from '@/icons/HidePasswordButton.vue'
import ShowPasswordIcon from '@/icons/ShowPasswordIcon.vue'

const cryptoStore = useCryptoStore();

const encrypted = ref<string>('');
const passphrase = ref<string>('');
const decrypted = ref<string>('');
const isLoading = ref<boolean>(false);
const error = ref<string>('');

const isShowPassphrase = ref<boolean>(true);

const canDecrypt = computed(() =>
  passphrase.value.trim() &&
  (encrypted.value.trim())
);

const decrypt = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    decrypted.value = await cryptoStore.decryptText(encrypted.value, passphrase.value);
  } catch (err) {
    const code = (err as { code: string })?.code;
    error.value = cryptoErrorMessages[code!] ?? 'Something went wrong';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="encrypt-card">
    <div class="card-header">
      <h2>Text Decryption</h2>
      <span class="hint">Choose encryption type and run</span>
    </div>

    <div class="setup-grid">
      <div class="field">
        <label>Encryption type</label>
        <select>
          <option>aes</option>
        </select>
      </div>

      <div class="field">
        <label>Passphrase</label>
        <div class="passphrase-input">
          <input v-model="passphrase" :type="isShowPassphrase ? 'text' : 'password'" placeholder="Passphrase" />

          <div class="input-actions">
            <button
              type="button"
              class="icon-btn"
              @click="isShowPassphrase = !isShowPassphrase"
              :aria-label="isShowPassphrase ? 'Hide passphrase' : 'Show passphrase'"
            >
              <HidePasswordButton v-if="isShowPassphrase" />
              <ShowPasswordIcon v-else />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="text-grid">
      <div class="input-block">
        <div class="input-header">
          <span>Data to decrypt</span>
        </div>

        <textarea v-model="encrypted" placeholder="Enter text to decrypt here" />
      </div>

      <div class="input-block">
        <div class="input-header">
          <span>Result</span>
        </div>

        <textarea
          disabled
          :value="decrypted"
          placeholder="Decrypted value will appear here"
        />
      </div>
    </div>

    <div class="action">
      <button
        class="primary-btn"
        :disabled="!canDecrypt || isLoading"
        @click="decrypt"
      >Decrypt</button>

      <p v-if="!error" class="helper">Enter input text and a passphrase to enable decryption.</p>

      <p v-else class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.encrypt-card {
  width: 100%;
  max-width: 1100px;
  background: white;
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.hint {
  font-size: 14px;
  color: #6b7280;
}

.setup-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

select,
input,
textarea {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
}

select {
  background: white;
}

.passphrase-input {
  position: relative;
  display: flex;
  align-items: center;
}

.passphrase-input input {
  width: 100%;
  padding-right: 140px;
}

.input-actions {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #000000;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.generate-btn {
  padding: 6px 10px;
  border-radius: 6px;
  background: #f3f4f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.generate-btn:hover {
  background: #e5e7eb;
}

.text-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

textarea {
  min-height: 160px;
  resize: none;
}

textarea[disabled] {
  background: #f3f4f6;
  color: #6b7280;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
}

.primary-btn {
  padding: 12px 32px;
  border-radius: 10px;
  background: #9ca3af;
  color: white;
  font-weight: 500;
}

.primary-btn:disabled {
  cursor: not-allowed;
}

.helper {
  font-size: 13px;
  color: #6b7280;
}

.error {
  color: #e54848;
  font-size: 14px;
  text-align: center;
  min-height: 18px;
}
</style>
