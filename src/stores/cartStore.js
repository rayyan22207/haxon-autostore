import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),

  getters: {
    totalItems: (state) => state.items.length,

    totalPrice: (state) =>
      state.items.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
  },

  actions: {
    addToCart(product) {
      const existing = this.items.find(
        item => item.id === product.id
      )

      if (existing) {
        existing.quantity++
        toast.success('Cart quantity updated')
      } else {
        this.items.push({
          ...product,
          quantity: 1,
        })
        toast.success('Added to cart')
      }
    },

    removeFromCart(id) {
      this.items = this.items.filter(
        item => item.id !== id
      )
      toast.success('Removed from cart')
    },

    increaseQuantity(id) {
      const item = this.items.find(
        item => item.id === id
      )

      if (item) {
        item.quantity++
        toast.success('Cart quantity updated')
      }
    },

    decreaseQuantity(id) {
      const item = this.items.find(
        item => item.id === id
      )

      if (item && item.quantity > 1) {
        item.quantity--
        toast.success('Cart quantity updated')
      }
    },

    clearCart() {
      this.items = []
    },
  },
})