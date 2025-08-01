import { defineStore } from "pinia";

export const useProductList = defineStore('productList', {
  state: () => ({
  }),
  actions: {
    save() {
      localStorage.setItem("productList", JSON.stringify(this.$state));
    },

    load() {
      const user = localStorage.getItem("productList");
      if (user) {
        this.$patch(JSON.parse(user));
      }
    },
  },
})