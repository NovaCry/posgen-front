<script setup lang="ts">
import { CakeSlice, ChefHat, ShoppingBasket } from 'lucide-vue-next';
import { motion } from 'motion-v';

const applications = [
  {
    name: 'Market',
    path: '/app/market',
    icon: ShoppingBasket,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-300',
  },
  {
    name: 'Kafe',
    path: '/app/cafe',
    icon: CakeSlice,
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    iconColor: 'text-rose-600 dark:text-rose-300',
  },
  {
    name: 'Mutfak',
    path: '/app/kitchen',
    icon: ChefHat,
    bg: 'bg-amber-100 dark:bg-amber-800/30',
    iconColor: 'text-amber-600 dark:text-amber-300',
  },
];

const cards = [
  {
    title: 'Kafe Yönetimi',
    description: 'Kafe siparişleri ve masalar',
    colors: ['bg-rose-600', 'bg-rose-300'],
  },

  {
    title: 'Market Yönetimi',
    description: 'Market ürünleri ve kasa işlemleri',
    colors: ['bg-emerald-600', 'bg-emerald-300'],
  },
  {
    title: 'Mutfak Yönetimi',
    description: 'Mutfak siparişleri ve hazırlık süreçleri',
    colors: ['bg-amber-600', 'bg-amber-200'],
  },
];
</script>

<template>
  <div
    class="relative min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 px-6 flex flex-col items-center justify-start overflow-hidden"
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-20">
      <motion.div
        v-for="(app, index) of applications"
        :key="app.name"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: index * 0.1, duration: 0.4 }"
        class="flex justify-center"
      >
        <RouterLink
          :to="app.path"
          class="flex flex-col items-center group transition-all duration-300 hover:-translate-y-1 active:scale-95"
          :class="[
            app.name === 'Market' || app.name === 'Mutfak'
              ? 'pointer-events-none opacity-60 cursor-not-allowed'
              : '',
          ]"
          tabindex="-1"
        >
          <div
            class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-accent transition-all w-28 h-28 flex items-center justify-center"
          >
            <div
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                app.bg,
                app.name === 'Market' || app.name === 'Mutfak'
                  ? 'opacity-60'
                  : '',
              ]"
            >
              <component
                :is="app.icon"
                :class="[
                  'w-6 h-6',
                  app.iconColor,
                  'group-hover:scale-110 transition-transform duration-300',
                  app.name === 'Market' || app.name === 'Mutfak'
                    ? 'opacity-60'
                    : '',
                ]"
              />
            </div>
          </div>
          <span
            class="text-sm mt-2 font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
            :class="
              app.name === 'Market' || app.name === 'Mutfak' ? 'opacity-60' : ''
            "
          >
            {{ app.name }}
          </span>
        </RouterLink>
      </motion.div>
    </div>

    <div class="max-w-md mx-auto space-y-6">
      <div class="flex flex-col items-center">
        <motion.div
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.5, duration: 0.4 }"
          class="bg-white dark:bg-gray-900 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-4 w-full max-w-[280px] mb-4"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-1 flex-1 text-left">
              <h3 class="font-medium text-gray-900 dark:text-gray-100">
                {{ cards[0].title }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ cards[0].description }}
              </p>
            </div>
            <div class="flex space-x-2">
              <div
                v-for="color in cards[0].colors"
                :key="color"
                :class="['w-3 h-3 rounded-full', color]"
              />
            </div>
          </div>
        </motion.div>

        <div class="flex space-x-4 w-full justify-center">
          <motion.div
            v-for="(card, index) in [cards[1], cards[2]]"
            :key="index"
            :initial="{ opacity: 0, y: 10 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.6 + index * 0.1, duration: 0.4 }"
            class="bg-white dark:bg-gray-900 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-4 flex-1 max-w-[280px]"
          >
            <div class="flex items-center justify-between">
              <div class="space-y-1 flex-1 text-left">
                <h3
                  class="font-medium text-gray-900 dark:text-gray-100 text-sm"
                >
                  {{ card.title }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ card.description }}
                </p>
              </div>
              <div class="flex space-x-2 ml-2">
                <div
                  v-for="color in card.colors"
                  :key="color"
                  :class="['w-3 h-3 rounded-full', color]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.8, duration: 0.4 }"
        class="space-y-4 text-center mt-6"
      >
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          İşletmenizi yönetmeye başlayın
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          İhtiyacınıza uygun araçlarla tüm işletme süreçlerinizi tek bir
          noktadan takip edin.
        </p>
      </motion.div>
    </div>
  </div>
</template>
