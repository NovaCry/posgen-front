<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  ShoppingCart,
  Users,
  MessageCircle,
  ArrowRight,
} from 'lucide-vue-next';

const router = useRouter();
const user = useUser();

const isTyping = ref(false);
const currentMessageIndex = ref(0);
const showButtons = ref(false);

const firstName = ref<string>('{ÜyelikAdı}');

interface PaiMessage {
  text: string;
  delay: number;
  showButtons: boolean;
}

const paiMessages = ref<PaiMessage[]>([]);
const displayedMessages = ref<string[]>([]);

const quickActions = ref([
  {
    title: 'Analizler Sayfasına Git',
    description: 'İşletme hakkında detaylı analiz raporları',
    icon: BarChart3,
    route: 'shop/analytics',
  },
  {
    title: 'POSGEN Uygulamasına Git',
    description: 'Ana yönetim paneli',
    icon: ShoppingCart,
    route: '/app',
  },
  {
    title: 'Adisyon Yönetimi',
    description: 'Adisyonların yönetimi ve takibi',
    icon: Users,
    route: 'shop/admissions',
  },
]);

const navigateToPage = (route: string) => {
  if (route.startsWith('http://') || route.startsWith('https://')) {
    window.open(route);
  } else {
    router.push(route);
  }
};

onMounted(() => {
  if (!user.data.value) return;
  firstName.value = user.data.value.firstName;

  paiMessages.value = [
    {
      text: `Hoşgeldin ${firstName.value}! İşlerini kolaylaştırmak için buradayım 😊`,
      delay: 1000,
      showButtons: false,
    },
    {
      text: 'Size sayfalarınızda yardımcı olabilirim. Hangi sayfaya gitmek istersiniz?',
      delay: 2300,
      showButtons: true,
    },
  ];

  showNextMessage();
});

const showNextMessage = () => {
  if (currentMessageIndex.value < paiMessages.value.length) {
    const message = paiMessages.value[currentMessageIndex.value];

    if (!message) return;

    setTimeout(() => {
      isTyping.value = true;

      setTimeout(() => {
        displayedMessages.value.push(message.text);
        isTyping.value = false;

        if (message.showButtons) {
          setTimeout(() => {
            showButtons.value = true;
          }, 1000);
        }

        currentMessageIndex.value++;

        if (currentMessageIndex.value < paiMessages.value.length) {
          showNextMessage();
        }
      }, 2000);
    }, message.delay);
  }
};

definePageMeta({
  name: 'Yönetim Paneli',
  meta: {
    hideInBreadcrumb: true,
    dontAuthorize: true,
  },
});
</script>

<template>
  <div class="min-h-screen flex flex-col overflow-hidden">
    <header class="mt-4 mb-1 px-4 sm:px-0">
      <div class="flex items-center justify-center max-w-3xl mx-auto">
        <div class="flex items-center gap-2">
          <div>
            <div class="flex items-center gap-2">
              <MessageCircle class="w-3 h-3 text-muted-foreground" />
              <span class="text-xs text-muted-foreground">Pai v1.0 - Nord</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main
      class="flex-1 overflow-y-auto"
      style="max-height: calc(100vh - 120px)"
    >
      <div class="max-w-3xl mx-auto p-3 pb-24 px-4 sm:px-6">
        <div class="space-y-3">
          <div
            v-for="(message, index) in displayedMessages"
            :key="index"
            class="flex items-start gap-2"
            :initial="{ opacity: 0, x: -20 }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: { duration: 0.5, ease: 'easeOut' },
            }"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center border border-gray-500 flex-shrink-0 bg-black/50"
            >
              <img
                src="/resources/infill/512x512-infill.svg"
                width="18"
                height="18"
                alt="Pai"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="rounded-2xl rounded-tl-md p-2 border">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-xs">Pai</span>
                  <span class="text-xs text-muted-foreground flex-shrink-0"
                    >şimdi</span
                  >
                </div>
                <div class="text-sm leading-relaxed break-words">
                  {{ message }}
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="isTyping"
            class="flex items-start gap-2"
            :initial="{ opacity: 0, x: -20 }"
            :enter="{
              opacity: 1,
              x: 0,
              transition: { duration: 0.5, ease: 'easeOut' },
            }"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center border border-gray-500 flex-shrink-0 bg-black/50"
            >
              <img
                src="/resources/infill/512x512-infill.svg"
                width="18"
                height="18"
                alt="Pai"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="rounded-2xl rounded-tl-md p-2 border">
                <div class="flex items-center gap-2 mb-1 min-h-[28px]">
                  <span class="font-medium text-xs">Pai</span>
                  <span class="text-xs flex-shrink-0">yazıyor...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="showButtons"
          class="mt-3"
          :initial="{ opacity: 0, y: 20 }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
          }"
        >
          <div class="flex items-start gap-2">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center border border-gray-500 flex-shrink-0 bg-black/50"
            >
              <img
                src="/resources/infill/512x512-infill.svg"
                width="18"
                height="18"
                alt="Pai"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="rounded-2xl rounded-tl-md p-2 border">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium text-xs">Pai</span>
                  <span class="text-xs text-muted-foreground flex-shrink-0"
                    >şimdi</span
                  >
                </div>
                <div class="space-y-4">
                  <Button
                    v-for="action in quickActions"
                    :key="action.title"
                    class="w-full justify-between h-auto py-3 px-4 text-left text-sm hover:bg-muted/50 transition-colors"
                    variant="outline"
                    @click="navigateToPage(action.route)"
                  >
                    <div class="flex items-center gap-3 flex-1">
                      <div
                        class="w-6 h-6 rounded-lg items-center justify-center flex-shrink-0 hidden sm:flex"
                      >
                        <component
                          :is="action.icon"
                          class="w-4 h-4 text-primary"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-sm break-words">
                          {{ action.title }}
                        </p>
                        <p class="text-sm text-muted-foreground break-words">
                          {{ action.description }}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      class="w-4 h-4 text-muted-foreground flex-shrink-0"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- Chat sistemi gelince açılacak
    <footer class="border-t p-2 mt-auto">
      <div class="max-w-3xl mx-auto">
        <div class="flex items-center gap-2 p-3 min-h-[44px] border rounded-lg">
          <MessageCircle class="w-3 h-3 text-muted-foreground" />
          <span class="text-xs text-muted-foreground flex-1">Pai size yardımcı oluyor...</span>
          <div class="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>
    </footer>-->
  </div>
</template>

<style scoped>
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

@media (max-width: 640px) {
  .rounded-2xl {
    border-radius: 1rem;
  }

  .p-2 {
    padding: 0.75rem;
  }

  .gap-2 {
    gap: 0.5rem;
  }
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}
</style>
