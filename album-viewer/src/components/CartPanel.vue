<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="close">
      <div class="modal-panel" @click.stop role="dialog" aria-modal="true" :aria-label="t('cart.title')">
        <div class="panel-header">
          <h2>{{ t('cart.title') }}</h2>
          <button class="close-btn" @click="close" :aria-label="t('cart.close')">✕</button>
        </div>

        <div class="panel-body">
          <div v-if="cart.state.items.length === 0" class="empty-state">
            <p>{{ t('cart.empty') }}</p>
          </div>

          <div v-else class="cart-items">
            <div v-for="item in cart.state.items" :key="item.album.id" class="cart-item">
              <img :src="item.album.image_url" :alt="item.album.title" class="item-image" />
              <div class="item-details">
                <h3>{{ item.album.title }}</h3>
                <p class="artist">{{ item.album.artist }}</p>
                <p class="price">${{ item.album.price.toFixed(2) }} × {{ item.qty }}</p>
              </div>
              <div class="item-actions">
                <p class="subtotal">${{ (item.album.price * item.qty).toFixed(2) }}</p>
                <button class="remove-btn" @click="removeItem(item.album.id)">
                  {{ t('cart.remove') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cart.state.items.length > 0" class="panel-footer">
          <div class="total-row">
            <span class="total-label">{{ t('cart.total') }}</span>
            <span class="total-amount">${{ cart.total.value.toFixed(2) }}</span>
          </div>
          <button class="clear-btn" @click="clearCart">{{ t('cart.clear') }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { cart } from '../store/cart'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const close = (): void => {
  emit('close')
}

const removeItem = (albumId: number): void => {
  cart.remove(albumId)
}

const clearCart = (): void => {
  if (confirm(t('cart.confirmClear'))) {
    cart.clear()
  }
}

const handleEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1000;
}

.modal-panel {
  background: white;
  width: 90%;
  max-width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.empty-state p {
  font-size: 1.1rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #333;
}

.item-details .artist {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.item-details .price {
  margin: 0;
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.subtotal {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.remove-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #cc0000;
}

.panel-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.total-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.clear-btn {
  width: 100%;
  background: #666;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #444;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.3s;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .modal-panel {
    width: 100%;
    max-width: 100%;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-actions {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
