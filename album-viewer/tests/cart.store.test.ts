import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cart } from '../src/store/cart'
import type { Album } from '../src/types/album'

const mockAlbum1: Album = {
  id: 1,
  title: 'Test Album 1',
  artist: 'Test Artist 1',
  price: 10.99,
  image_url: 'http://test.com/image1.jpg'
}

const mockAlbum2: Album = {
  id: 2,
  title: 'Test Album 2',
  artist: 'Test Artist 2',
  price: 15.99,
  image_url: 'http://test.com/image2.jpg'
}

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    cart.clear()
    // Clear localStorage mock
    localStorage.clear()
  })

  it('should add an album to cart', () => {
    cart.add(mockAlbum1)
    expect(cart.state.items.length).toBe(1)
    expect(cart.state.items[0].album.id).toBe(mockAlbum1.id)
    expect(cart.state.items[0].qty).toBe(1)
  })

  it('should increment quantity when adding the same album', () => {
    cart.add(mockAlbum1)
    cart.add(mockAlbum1)
    expect(cart.state.items.length).toBe(1)
    expect(cart.state.items[0].qty).toBe(2)
  })

  it('should add multiple different albums', () => {
    cart.add(mockAlbum1)
    cart.add(mockAlbum2)
    expect(cart.state.items.length).toBe(2)
    expect(cart.count.value).toBe(2)
  })

  it('should remove an album from cart', () => {
    cart.add(mockAlbum1)
    cart.add(mockAlbum2)
    cart.remove(mockAlbum1.id)
    expect(cart.state.items.length).toBe(1)
    expect(cart.state.items[0].album.id).toBe(mockAlbum2.id)
  })

  it('should clear all items from cart', () => {
    cart.add(mockAlbum1)
    cart.add(mockAlbum2)
    cart.clear()
    expect(cart.state.items.length).toBe(0)
    expect(cart.count.value).toBe(0)
  })

  it('should calculate correct count', () => {
    cart.add(mockAlbum1)
    cart.add(mockAlbum1)
    cart.add(mockAlbum2)
    expect(cart.count.value).toBe(3)
  })

  it('should calculate correct total', () => {
    cart.add(mockAlbum1) // 10.99
    cart.add(mockAlbum1) // 10.99
    cart.add(mockAlbum2) // 15.99
    expect(cart.total.value).toBe(10.99 + 10.99 + 15.99)
  })

  it('should persist to localStorage on add', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    cart.add(mockAlbum1)
    expect(setItemSpy).toHaveBeenCalledWith(
      'album-viewer:cart',
      expect.any(String)
    )
  })

  it('should persist to localStorage on remove', () => {
    cart.add(mockAlbum1)
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    cart.remove(mockAlbum1.id)
    expect(setItemSpy).toHaveBeenCalled()
  })

  it('should persist to localStorage on clear', () => {
    cart.add(mockAlbum1)
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    cart.clear()
    expect(setItemSpy).toHaveBeenCalledWith('album-viewer:cart', '[]')
  })
})
