import type { SidebarDataGroup } from '@/types/Sidebar';

import {
  ArrowUpRight,
  BadgePercent,
  BoxIcon,
  Brain,
  CakeSlice,
  ChartLine,
  FileBarChart,
  FileClock,
  GalleryVertical,
  GalleryVerticalEnd,
  Hash,
  Library,
  Puzzle,
  QrCode,
  ReceiptText,
  Settings2,
  ShoppingBasket,
  UsersRound,
} from 'lucide-vue-next';
import { defineStore } from 'pinia';

import { application } from '@/app.conf.json';

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    open: true,
    data: [
      {
        name: 'Uygulama',
        data: [
          {
            type: 'direct',
            title: 'Posgen AI',
            url: '/dashboard/',
            icon: Brain,
          },
          {
            type: 'action',
            title: 'Uygulamaya Git',
            action() {
              window.open(application.dev);
            },
            icon: ArrowUpRight,
          },
        ],
      },
      {
        name: 'İşlemler',
        data: [
          {
            type: 'collapsible',
            title: 'Analizler',
            url: '/dashboard/shop/analytics',
            icon: ChartLine,
            isActive: false,
            items: [
              {
                title: 'Raporlar',
                icon: FileBarChart,
                url: '/dashboard/shop/analytics/reports',
              },
              {
                title: 'Rapor İste',
                icon: FileClock,
                url: '/dashboard/shop/analytics/reports/request',
              },
            ],
          },
          {
            type: 'collapsible',
            title: 'Kütüphane',
            url: '/dashboard/shop/library',
            isActive: false,
            icon: Library,
            items: [
              {
                title: 'Entegrasyonlar',
                icon: Puzzle,
                url: '/dashboard/shop/library/integrations',
              },
              //   {
              //     title: "Topluluk",
              //    icon: UsersRound,
              //   url: "/dashboard/shop/library/community",
              // },
            ],
          },
          {
            type: 'collapsible',
            title: 'Ayarlar',
            url: '/dashboard/shop/settings',
            isActive: false,
            icon: Settings2,
            items: [
              {
                title: 'Çalışanlar',
                icon: UsersRound,
                url: '/dashboard/shop/settings/employees',
              },
              {
                title: 'Roller',
                icon: Hash,
                url: '/dashboard/shop/settings/roles',
              },
            ],
          },
        ],
      },
      {
        name: 'Kaynaklar',
        data: [
          {
            type: 'direct',
            title: 'Satışlar',
            url: '/dashboard/shop/sells',
            isActive: false,
            icon: ShoppingBasket,
          },
          {
            type: 'direct',
            title: 'Adisyonlar',
            url: '/dashboard/shop/admissions',
            isActive: false,
            icon: ReceiptText,
          },
          {
            type: 'direct',
            title: 'Masalar',
            url: '/dashboard/shop/tables',
            isActive: false,
            icon: GalleryVertical,
          },
          {
            type: 'direct',
            title: 'Kategoriler',
            url: '/dashboard/shop/categories',
            isActive: false,
            icon: GalleryVerticalEnd,
          },
          {
            type: 'direct',
            title: 'Ürünler',
            url: '/dashboard/shop/product',
            isActive: false,
            icon: BoxIcon,
          },
          {
            type: 'direct',
            title: 'İndirimler',
            url: '/dashboard/shop/discounts',
            isActive: false,
            icon: BadgePercent,
          },
        ],
      },
      {
        name: 'Modüller',
        data: [
          {
            type: 'direct',
            title: 'Mutfak',
            url: '/dashboard/shop/modules/kitchen',
            icon: CakeSlice,
            isActive: false,
          },
          {
            type: 'direct',
            title: 'QR Menü',
            url: '/dashboard/shop/modules/qr',
            icon: QrCode,
            isActive: false,
          },
        ],
      },
      /*{
        name: "Entegrasyonlar",
        data: [
          {
            type: "direct",
            title: "YemekSepeti",
            url: "#",
            icon: BoxIcon,
          },
          {
            type: "direct",
            title: "Getir",
            url: "#",
            icon: BoxIcon,
          },
          {
            type: "direct",
            title: "Trendyol GO",
            url: "#",
            icon: BoxIcon,
          },
        ],
      },*/
    ] as SidebarDataGroup[],
  }),
  actions: {
    async save() {
      // const saveableData = { ...this.$state, data: undefined };
      // localStorage.setItem('sidebar', JSON.stringify(saveableData));
    },

    async load() {
      // const sidebar = localStorage.getItem('sidebar');
      // if (sidebar) {
      // this.$patch(JSON.parse(sidebar));
      // }
    },
  },
});
