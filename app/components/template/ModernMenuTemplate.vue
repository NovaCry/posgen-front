<script setup lang="ts">
import { ref, computed } from 'vue';

const activeCategory = ref('all');

const categories = ref([
  { id: 'all', name: 'Tümü', icon: 'layers' },
  { id: 'starters', name: 'Başlangıçlar', icon: 'salad' },
  { id: 'mains', name: 'Ana Yemekler', icon: 'utensils' },
  { id: 'desserts', name: 'Tatlılar', icon: 'cake' },
  { id: 'drinks', name: 'İçecekler', icon: 'coffee' },
]);

const menuItems = ref([
  {
    id: 1,
    name: 'Bruschetta',
    description: 'Domates, fesleğen ve sarımsak ile',
    price: '90₺',
    category: 'starters',
    image: '/placeholder.svg?height=200&width=200',
    featured: true,
  },
  {
    id: 2,
    name: 'Çıtır Kalamari',
    description: 'Tartar sos ile servis edilir',
    price: '120₺',
    category: 'starters',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
  {
    id: 3,
    name: 'Humus Tabağı',
    description: 'Zeytinyağı ve baharatlar ile',
    price: '85₺',
    category: 'starters',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
  {
    id: 4,
    name: 'Izgara Somon',
    description: 'Sebzeli pilav ve limon sos ile',
    price: '220₺',
    category: 'mains',
    image: '/placeholder.svg?height=200&width=200',
    featured: true,
  },
  {
    id: 5,
    name: 'Bonfile',
    description: 'Mantar sos ve patates püresi ile',
    price: '280₺',
    category: 'mains',
    image: '/placeholder.svg?height=200&width=200',
    featured: true,
  },
  {
    id: 6,
    name: 'Risotto',
    description: 'Mevsim mantarları ve parmesan ile',
    price: '180₺',
    category: 'mains',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
  {
    id: 7,
    name: 'Tiramisu',
    description: 'Ev yapımı mascarpone kreması ile',
    price: '95₺',
    category: 'desserts',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
  {
    id: 8,
    name: 'Çikolatalı Sufle',
    description: 'Vanilyalı dondurma ile',
    price: '110₺',
    category: 'desserts',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
  {
    id: 9,
    name: 'Kola',
    description: '330ml',
    price: '35₺',
    category: 'drinks',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
  {
    id: 10,
    name: 'Limonata',
    description: 'Ev yapımı taze sıkılmış',
    price: '40₺',
    category: 'drinks',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
  {
    id: 11,
    name: 'Türk Kahvesi',
    description: 'Geleneksel',
    price: '45₺',
    category: 'drinks',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
  {
    id: 12,
    name: 'Smoothie',
    description: 'Mevsim meyveleri ile',
    price: '65₺',
    category: 'drinks',
    image: '/placeholder.svg?height=200&width=200',
    featured: false,
  },
]);

const filteredItems = computed(() => {
  if (activeCategory.value === 'all') {
    return menuItems.value;
  }
  return menuItems.value.filter(
    (item) => item.category === activeCategory.value
  );
});

const featuredItems = computed(() => {
  return menuItems.value.filter((item) => item.featured);
});

const isChangingCategory = ref(false);

const changeCategory = (categoryId: string) => {
  if (isChangingCategory.value || activeCategory.value === categoryId) return;

  isChangingCategory.value = true;
  activeCategory.value = categoryId;

  setTimeout(() => {
    isChangingCategory.value = false;
  }, 300);
};

const Icon = (props: { name: string }) => {
  const icons: { [key: string]: string } = {
    layers: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.5"/><path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 17.5"/></svg>`,
    salad: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="M13 12a2.4 2.4 0 0 1-4 2.4 2.4 2.4 0 0 1-3.2 2.8 2.4 2.4 0 0 1-2-4.4"/></svg>`,
    utensils: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2 2h3Zm0 0v7"/></svg>`,
    cake: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>`,
    coffee: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  };
  return {
    template: icons[props.name] || icons.layers,
  };
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'starters':
      return 'bg-blue-100';
    case 'mains':
      return 'bg-red-100';
    case 'desserts':
      return 'bg-pink-100';
    case 'drinks':
      return 'bg-purple-100';
    default:
      return 'bg-gray-100';
  }
};

const getCategoryTextColor = (category: string) => {
  switch (category) {
    case 'starters':
      return 'text-blue-900';
    case 'mains':
      return 'text-red-900';
    case 'desserts':
      return 'text-pink-900';
    case 'drinks':
      return 'text-purple-900';
    default:
      return 'text-gray-900';
  }
};
</script>

<template>
  <div class="w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-lg">
    <div class="p-4 border-b sticky top-0 bg-white z-10 shadow-xs">
      <div class="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        <button
          v-for="category in categories"
          :key="category.id"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 min-w-[100px] transition-all duration-200"
          :class="[
            activeCategory === category.id
              ? 'bg-zinc-900 text-white'
              : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50',
          ]"
          @click="changeCategory(category.id)"
        >
          <span
            v-if="Icon({ name: category.icon }).template"
            class="w-4 h-4 mr-2"
            v-text="Icon({ name: category.icon }).template"
          />
          {{ category.name }}
        </button>
      </div>
    </div>

    <transition-group
      v-if="activeCategory === 'all' && featuredItems.length > 0"
      name="fade-list"
      tag="div"
      class="p-4 bg-zinc-50"
    >
      <h2
        key="featured-title"
        class="text-lg font-semibold mb-3 flex items-center text-zinc-900"
      >
        <span
          class="w-5 h-5 mr-2 text-amber-500"
          v-html="Icon({ name: 'star' }).template"
        />
        Öne Çıkanlar
      </h2>
      <div key="featured-grid" class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="item in featuredItems"
          :key="`featured-${item.id}`"
          class="flex bg-white rounded-lg overflow-hidden shadow-xs hover:shadow-md border border-zinc-200 cursor-pointer group transition-all duration-200"
        >
          <div class="w-24 h-24 overflow-hidden">
            <div
              class="w-full h-full bg-zinc-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-zinc-400"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          </div>
          <div class="p-3 flex-1">
            <div class="flex justify-between">
              <h3
                class="font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors"
              >
                {{ item.name }}
              </h3>
              <span class="font-bold text-zinc-900">{{ item.price }}</span>
            </div>
            <p class="text-zinc-700 text-xs mt-1">
              {{ item.description }}
            </p>
            <div class="mt-2">
              <span
                :class="[
                  getCategoryColor(item.category),
                  getCategoryTextColor(item.category),
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                ]"
              >
                {{ categories.find((c) => c.id === item.category)?.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition-group>

    <transition-group name="fade-list" tag="div" class="p-4">
      <div key="menu-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="bg-white rounded-lg overflow-hidden shadow-xs hover:shadow-md border border-zinc-200 cursor-pointer group transition-all duration-200"
        >
          <div class="relative h-36 overflow-hidden">
            <div
              class="w-full h-full bg-zinc-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-zinc-400"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <div
              v-if="item.featured"
              class="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full"
            >
              Öne Çıkan
            </div>
            <div
              class="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-black/50 to-transparent"
            />
          </div>
          <div class="p-3">
            <div class="flex justify-between items-start">
              <h3
                class="font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors"
              >
                {{ item.name }}
              </h3>
              <span class="font-bold text-zinc-900 px-2 py-0.5 rounded">{{
                item.price
              }}</span>
            </div>
            <p class="text-zinc-700 text-sm mt-1">
              {{ item.description }}
            </p>
            <div class="mt-2 flex justify-between items-center">
              <span
                :class="[
                  getCategoryColor(item.category),
                  getCategoryTextColor(item.category),
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                ]"
              >
                {{ categories.find((c) => c.id === item.category)?.name }}
              </span>
              <button
                class="text-xs text-zinc-900 hover:text-zinc-700 transition-colors font-medium"
              >
                Sipariş Ver
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>

    <div
      class="bg-zinc-100 p-4 text-center text-sm text-zinc-700 relative overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent"
      />
      <p>
        Web sitesi
        <a
          href="https://posgen.app"
          target="_blank"
          class="text-zinc-900 hover:underline"
          >Posgen</a
        >
        tarafından sağlanmaktadır.
      </p>
      <p class="mt-1">© 2025 - Tüm Hakları Saklıdır</p>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.3s ease;
}

.fade-list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-list-move {
  transition: transform 0.3s ease;
}
</style>
