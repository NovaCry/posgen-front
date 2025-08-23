<template>
  <main>
    <Header />
    <SeoMeta title="Abonelikler" description="Abonelikler" />
    <div class="mt-10 p-8 md:p-16 bg-background">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Size Uygun Planı Seçin</h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          İşletmenizin büyüklüğü ne olursa olsun, size uygun bir paket
          sunuyoruz.
        </p>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16"
      >
        <div
          v-for="([name, details], index) of subscriptionEntries"
          :key="index"
          :class="[
            'relative border rounded-xl p-6 transition-all duration-500 cursor-pointer group flex flex-col h-full min-h-[320px] max-h-[320px]',
            selectedPlanName === name
              ? 'border-primary shadow-lg bg-primary/5 ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50 hover:shadow-lg',
          ]"
          :style="{
            transform: `translateY(${index * 2}px)`,
            transitionDelay: `${index * 100}ms`,
          }"
          @click="selectPlan(name)"
        >
          <div
            v-if="details.popular"
            class="absolute -top-3 left-1/2 transform -translate-x-1/2"
          >
            <span
              class="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium"
            >
              En Popüler
            </span>
          </div>

          <div v-if="selectedPlanName === name" class="absolute -top-3 right-4">
            <span
              class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            >
              <Check class="size-3" />
              Seçili
            </span>
          </div>

          <div class="text-center mb-6">
            <h3
              class="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300"
            >
              {{ name }}
            </h3>
            <p class="text-muted-foreground text-sm mb-4">
              {{ details.description }}
            </p>

            <div class="mb-4">
              <div v-if="details.price === 0" class="text-4xl font-bold" />
              <div
                v-else-if="details.price === -1"
                class="text-2xl font-bold"
              />
            </div>

            <div
              :class="[
                'w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 select-none',
                selectedPlanName === name
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
              ]"
            >
              {{ selectedPlanName === name ? 'Aktif Plan' : 'Bu Planı İncele' }}
            </div>
          </div>

          <div class="space-y-2">
            <ul class="space-y-2">
              <li
                v-for="(benefit, benefitIndex) of details.benefits.slice(0, 3)"
                :key="benefitIndex"
                class="flex items-start gap-2 text-sm opacity-70"
              >
                <Check class="text-green-500 size-3 mt-1 flex-shrink-0" />
                <span>{{ benefit }}</span>
              </li>
            </ul>
            <div
              class="text-xs text-muted-foreground text-center pt-2 border-t"
            >
              <template v-if="name === 'Kurumsal'">
                Tüm özellikleri öğrenmek için iletişime geçin
              </template>
              <template v-else>
                Tüm özellikleri aşağıda karşılaştırın
              </template>
            </div>
          </div>

          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
          />
        </div>
      </div>

      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Özellik Karşılaştırması</h2>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-border">
                <th class="py-4 px-4 text-left font-medium">Özellikler</th>
                <th
                  v-for="([name], index) in subscriptionEntries"
                  :key="index"
                  :class="[
                    'py-4 px-4 text-center font-medium transition-colors duration-300',
                    selectedPlanName === name
                      ? 'text-primary bg-primary/5'
                      : '',
                  ]"
                >
                  {{ name }}
                  <div
                    v-if="selectedPlanName === name"
                    class="text-xs text-primary/70 mt-1"
                  >
                    (Seçili Plan)
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">Temel Özellikler</td>
                <td :class="getColumnClass('Ücretsiz')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Standart')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Profesyonel')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Kurumsal')">
                  <Check class="inline size-5 text-green-500" />
                </td>
              </tr>

              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">Destek</td>
                <td :class="getColumnClass('Ücretsiz')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Standart')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Profesyonel')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Kurumsal')">
                  <Check class="inline size-5 text-green-500" />
                </td>
              </tr>

              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">Otomasyon Hizmetleri</td>
                <td :class="getColumnClass('Ücretsiz')">—</td>
                <td :class="getColumnClass('Standart')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Profesyonel')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Kurumsal')">
                  <Check class="inline size-5 text-green-500" />
                </td>
              </tr>

              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">200+ Entegrasyon</td>
                <td :class="getColumnClass('Ücretsiz')">—</td>
                <td :class="getColumnClass('Standart')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Profesyonel')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Kurumsal')">
                  <Check class="inline size-5 text-green-500" />
                </td>
              </tr>

              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">Analitik</td>
                <td :class="getColumnClass('Ücretsiz')">Temel</td>
                <td :class="getColumnClass('Standart')">Gelişmiş</td>
                <td :class="getColumnClass('Profesyonel')">Gelişmiş</td>
                <td :class="getColumnClass('Kurumsal')">Gelişmiş</td>
              </tr>

              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">Dışa Aktarma</td>
                <td :class="getColumnClass('Ücretsiz')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Standart')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Profesyonel')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Kurumsal')">
                  <Check class="inline size-5 text-green-500" />
                </td>
              </tr>

              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">API Erişimi</td>
                <td :class="getColumnClass('Ücretsiz')">—</td>
                <td :class="getColumnClass('Standart')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Profesyonel')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Kurumsal')">
                  <Check class="inline size-5 text-green-500" />
                </td>
              </tr>

              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">Gelişmiş Raporlar</td>
                <td :class="getColumnClass('Ücretsiz')">—</td>
                <td :class="getColumnClass('Standart')">—</td>
                <td :class="getColumnClass('Profesyonel')">
                  <Check class="inline size-5 text-green-500" />
                </td>
                <td :class="getColumnClass('Kurumsal')">
                  <Check class="inline size-5 text-green-500" />
                </td>
              </tr>

              <tr class="border-b border-border hover:bg-muted/30">
                <td class="py-4 px-4 text-left">Özel Alanlar</td>
                <td :class="getColumnClass('Ücretsiz')">—</td>
                <td :class="getColumnClass('Standart')">—</td>
                <td :class="getColumnClass('Profesyonel')">—</td>
                <td :class="getColumnClass('Kurumsal')">
                  <Check class="inline size-5 text-green-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-8 flex justify-center">
          <button
            v-if="selectedPlanName"
            class="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            @click="
              selectedPlanName === 'Ücretsiz' ? $router.push('/register') : null
            "
          >
            {{
              selectedPlanName === 'Kurumsal'
                ? 'Teklif Al'
                : selectedPlanName === 'Ücretsiz'
                ? 'Ücretsiz Başla'
                : 'Bu Paketi Seç'
            }}
          </button>
        </div>

        <div
          class="mt-12 text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-xl p-6 max-w-3xl mx-auto shadow-sm flex flex-col gap-2"
        >
          <div class="flex items-center gap-2">
            <span><b>Tüm yazılım ve lisans fiyatlarına</b> KDV dahildir.</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              ><b>Yazılım ve lisans fiyatlarına</b> kurulum dahil
              değildir.</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              ><b>Tüm bakım ücretlerinde</b> ilk yıla özel %50 indirim
              uygulanacaktır.</span
            >
          </div>
          <div class="flex items-center gap-2">
            <span
              ><b>Bu sayfa bilgilendirme amaçlıdır.</b> Yazılım satın alma
              işlemleri için lütfen teklif isteyiniz.</span
            >
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import SeoMeta from '@/components/seo/SeoMeta.vue';
import { Check } from 'lucide-vue-next';
import Header from '@/components/header/index/IndexHeader.vue';
import { ref } from 'vue';

interface Subscription {
  popular: boolean;
  description: string;
  contains: string | null;
  benefits: string[];
  price: number;
}

const subscriptions: Record<string, Subscription> = {
  Ücretsiz: {
    popular: false,
    description: 'Deneme sürecindeki küçük işletmeler için mükemmel.',
    contains: null,
    benefits: [
      '4000 Aylık Satış',
      '2000 Aylık Adisyon',
      '12 Kategori',
      'Topluluk Desteği',
      'Temel Raporlama',
      'E-posta Desteği',
    ],
    price: 0,
  },
  Standart: {
    popular: false,
    description: 'Orta ölçekli normal yoğunluğa sahip işletmeler için.',
    contains: 'Ücretsiz plandaki özelliklerle birlikte:',
    benefits: [
      'Analitik Erişimi',
      'Entegrasyon Desteği',
      'Aylık 2 Rapor Oluşturma',
      '24 Kategori',
      'Canlı Destek',
      'API Erişimi',
      'Özel Entegrasyonlar',
    ],
    price: 299,
  },
  Profesyonel: {
    popular: true,
    description: 'Büyük ölçekli yoğun işletmeler için.',
    contains: 'Profesyonel plandaki özelliklerle birlikte:',
    benefits: [
      'Detaylı Aylık Analiz',
      'Detaylı Aylık Rapor',
      'Sınırsız Kategori',
      'Çalışan Yönetimi (Maks. 7)',
      'Canlı Destek',
      'Öncelikli Destek',
      'Özel Eğitim',
      'Gelişmiş Güvenlik',
    ],
    price: 599,
  },
  Kurumsal: {
    popular: false,
    description: 'Kurumsal düzeyde birden fazla mağazası olan işletmeler için.',
    contains: '',
    benefits: [
      'Yapay Zeka Destekli Aylık Rapor',
      'Yapay Zeka Destekli Aylık Analiz',
      'Şahsi Destek',
    ],
    price: -1,
  },
};

const subscriptionEntries = Object.entries(subscriptions);
const selectedPlanName = ref<string>('Ücretsiz');

const selectPlan = (planName: string) => {
  selectedPlanName.value = planName;
};

const getColumnClass = (planName: string) => {
  return selectedPlanName.value === planName
    ? 'py-4 px-4 text-center bg-primary/10 text-primary font-medium border-l-2 border-r-2 border-primary/20'
    : 'py-4 px-4 text-center';
};

definePageMeta({
  name: 'Abonelikler',
  meta: {
    dontAuthorize: true,
  },
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground)) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground));
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--foreground));
}
</style>
