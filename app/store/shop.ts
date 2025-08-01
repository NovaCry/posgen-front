import type Shop from '@/types/api/Shop';
import { defineStore } from 'pinia';

export const useSelectedShopStore = defineStore('selectedShop', {
  state: (): Shop => ({
    id: '',
    closingTime: '',
    isSuspended: false,
    name: '',
    openingTime: '',
    ownerId: '',
    currentEmployeeCount: 0,
    currentMonthlySales: 0,
    currentProductCount: 0,
    shopSubscriptionId: '',
    Tax: [],
  }),
  actions: {
    async save() {
      localStorage.setItem('selectedShop', JSON.stringify(this.$state));
    },

    async load() {
      console.log('analsex');
      const user = localStorage.getItem('selectedShop');
      if (user) {
        this.$patch(JSON.parse(user));
      }
    },

    flush() {
      this.$reset();
      this.save();
    },
  },
});
