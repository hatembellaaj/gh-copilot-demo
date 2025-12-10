import { reactive, computed } from 'vue'
import type { Album } from '../types/album'

export interface CartItem {
  album: Album
  qty: number
}

interface CartState {
  items: CartItem[]
}

const STORAGE_KEY = 'album-viewer:cart'

function loadFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

const state = reactive<CartState>({
  items: loadFromStorage()
})

export const cart = {
  state,

  add(album: Album): void {
    const existing = state.items.find(item => item.album.id === album.id)
    if (existing) {
      existing.qty++
    } else {
      state.items.push({ album, qty: 1 })
    }
    saveToStorage(state.items)
  },

  remove(albumId: number): void {
    const index = state.items.findIndex(item => item.album.id === albumId)
    if (index !== -1) {
      state.items.splice(index, 1)
      saveToStorage(state.items)
    }
  },

  clear(): void {
    state.items = []
    saveToStorage(state.items)
  },

  count: computed(() => {
    return state.items.reduce((sum, item) => sum + item.qty, 0)
  }),

  total: computed(() => {
    return state.items.reduce((sum, item) => sum + (item.album.price * item.qty), 0)
  })
}
