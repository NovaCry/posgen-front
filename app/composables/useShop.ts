import type Shop from '~/types/api/Shop';

const _shop = ref<Shop | null>(null);
const _shops = ref<Shop[]>([]);

const STORAGE_SHOP = 'selectedShop';
const STORAGE_SHOPS = 'shops';

export default function useShop() {
  return {
    save() {
      if (!import.meta.client) return;
      localStorage.setItem(STORAGE_SHOPS, JSON.stringify(_shops.value));
      localStorage.setItem(STORAGE_SHOP, JSON.stringify(_shop.value));
    },
    load() {
      if (!import.meta.client) return;
      let shops = localStorage.getItem(STORAGE_SHOPS);
      let shop = localStorage.getItem(STORAGE_SHOP);
      if (shops) _shops.value = JSON.parse(shops);
      if (shop) _shop.value = JSON.parse(shop);
    },
    setCurrent(id: string) {
      _shop.value = _shops.value.find((shop) => shop.id == id) || null;
    },
    fetch() {},
    all: _shops,
    current: _shop,
  };
}
