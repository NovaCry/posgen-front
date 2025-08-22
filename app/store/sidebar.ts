import type { SidebarDataGroup } from '~/types/Sidebar';

interface SidebarStore {
  open: boolean;
  data: SidebarDataGroup[];
}

export const useSidebarStore = defineStore('sidebar', {
  state: (): SidebarStore => ({
    open: true,
    data: [
      {
        name: 'Uygulama',
        data: [
          {
            type: 'direct',
            title: 'Posgen AI',
            url: '/dashboard/',
            icon: 'lucide:brain',
          },
          {
            type: 'direct',
            title: 'Uygulamaya Git',
            url: '/app/',
            icon: 'lucide:arrow-up-right',
          },
        ],
      },
      {
        name: 'İşlemler',
        data: [
          {
            type: 'collapsible',
            title: 'Analizler',
            url: '/dashboard/analytics',
            icon: 'lucide:chart-line',
            isActive: false,
            items: [
              {
                title: 'Raporlar',
                icon: 'lucide:file-bar-chart',
                url: '/dashboard/analytics/reports',
              },
              {
                title: 'Rapor İste',
                icon: 'lucide:file-clock',
                url: '/dashboard/analytics/reports/request',
              },
            ],
          },
          {
            type: 'collapsible',
            title: 'Kütüphane',
            url: '/dashboard/library',
            isActive: false,
            icon: 'lucide:library',
            items: [
              {
                title: 'Entegrasyonlar',
                icon: 'lucide:puzzle',
                url: '/dashboard/library/integrations',
              },
            ],
          },
          {
            type: 'collapsible',
            title: 'Ayarlar',
            url: '/dashboard/settings',
            isActive: false,
            icon: 'lucide:settings-2',
            items: [
              {
                title: 'Çalışanlar',
                icon: 'lucide:users-round',
                url: '/dashboard/settings/employees',
              },
              {
                title: 'Roller',
                icon: 'lucide:hash',
                url: '/dashboard/settings/roles',
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
            url: '/dashboard/sells',
            icon: 'lucide:shopping-basket',
          },
          {
            type: 'direct',
            title: 'Adisyonlar',
            url: '/dashboard/admissions',
            icon: 'lucide:receipt-text',
          },
          {
            type: 'direct',
            title: 'Masalar',
            url: '/dashboard/tables',
            icon: 'lucide:gallery-vertical',
          },
          {
            type: 'direct',
            title: 'Kategoriler',
            url: '/dashboard/categories',
            icon: 'lucide:gallery-vertical-end',
          },
          {
            type: 'direct',
            title: 'Ürünler',
            url: '/dashboard/product',
            icon: 'lucide:box',
          },
          {
            type: 'direct',
            title: 'İndirimler',
            url: '/dashboard/discounts',
            icon: 'lucide:badge-percent',
          },
        ],
      },
      {
        name: 'Modüller',
        data: [
          {
            type: 'direct',
            title: 'Mutfak',
            url: '/dashboard/modules/kitchen',
            icon: 'lucide:cake-slice',
          },
          {
            type: 'direct',
            title: 'QR Menü',
            url: '/dashboard/modules/qr',
            icon: 'lucide:qr-code',
          },
        ],
      },
    ],
  }),
  actions: {
    load() {
      this.$state.open =
        localStorage.getItem('sidebar') == 'true' ? true : false;
    },
    save() {
      localStorage.setItem('sidebar', this.$state.open + '');
    },
  },
});
