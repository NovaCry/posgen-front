<template>
  <div>
    <SeoMeta title="Erişim İzni" description="Erişim izni" />
    <div
      class="min-h-screen flex items-center justify-center bg-background px-2 py-6"
    >
      <Card class="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div class="flex flex-col items-center gap-2 mb-2">
            <div class="flex flex-row items-center gap-6 justify-center">
              <figure
                class="size-16 p-2 rounded-xl border bg-white shadow flex items-center justify-center"
              >
                <img
                  src="/resources/black/512x512-mono-black.svg"
                  alt="posgenweb"
                  class="w-full h-full object-contain"
                />
              </figure>
              <div class="flex items-center relative">
                <span
                  class="inline-block w-8 h-1 rounded-full bg-green-500 mx-2 animate-pulse"
                ></span>
                <ArrowRightLeft
                  class="size-6 text-green-500 transition-transform duration-500 motion-safe:animate-pulse"
                />
                <span
                  class="inline-block w-8 h-1 rounded-full bg-green-500 mx-2 animate-pulse"
                ></span>
              </div>
              <figure
                class="size-16 rounded-full bg-primary flex items-center justify-center shadow"
              >
                <User2 class="size-8 text-primary-foreground" />
              </figure>
            </div>
            <CardTitle class="text-xl sm:text-3xl text-center mt-4 font-bold">
              <span v-if="selectedShop?.name">
                <b>{{ selectedShop.name }}</b> mağazası için
              </span>
              hesabınıza erişim talep ediliyor.
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col sm:flex-row gap-8 w-full">
            <div class="flex-1 flex flex-col gap-2 min-w-0">
              <h3
                class="text-base sm:text-lg font-semibold mb-2 text-center sm:text-left"
              >
                {{ app?.name }} neleri görüntüleyebilecek?
              </h3>
              <ul
                class="list-none p-0 text-sm text-white-700 divide-y divide-muted-foreground/20 bg-muted/40 rounded-lg"
              >
                <li
                  v-for="(scope, index) in read"
                  :key="`view-${index}`"
                  class="flex gap-2 p-3 items-center transition-all duration-200"
                >
                  <component
                    :is="scope[0]"
                    class="text-muted-foreground size-4"
                  />
                  <span class="flex-grow">{{ scope[1] }}</span>
                  <ChevronRight class="text-muted-foreground size-4" />
                </li>
              </ul>
            </div>
            <div class="flex-1 flex flex-col gap-2 min-w-0">
              <h3
                class="text-base sm:text-lg font-semibold mb-2 text-center sm:text-left"
              >
                {{ app?.name }} neler yapabilecek?
              </h3>
              <ul
                class="list-none p-0 text-sm text-white-700 divide-y divide-muted-foreground/20 bg-muted/40 rounded-lg"
              >
                <li
                  v-for="(scope, index) in write"
                  :key="`write-${index}`"
                  class="flex gap-2 p-3 items-center transition-all duration-200"
                >
                  <component
                    :is="scope[0]"
                    class="text-muted-foreground size-4"
                  />
                  <span class="flex-grow">{{ scope[1] }}</span>
                  <ChevronRight class="text-muted-foreground size-4" />
                </li>
              </ul>
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-6">
            <div class="flex flex-row justify-end gap-4">
              <Button variant="outline" :disabled="Processing" class="w-32">
                Reddet
              </Button>
              <Button
                class="w-32 flex items-center justify-center gap-2"
                :disabled="Processing"
                @click="GrantAuthorization"
              >
                <span>İzin Ver</span>
              </Button>
            </div>
            <div class="text-xs text-muted-foreground text-center mt-2">
              İzin vererek,
              <a href="/privacy" class="underline hover:text-primary">
                Gizlilik Politikası
              </a>
              ve
              <a href="/terms" class="underline hover:text-primary">
                Kullanım Koşulları
              </a>
              'nı kabul ediyorsunuz.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import {
  ArrowRightLeft,
  BadgePercent,
  Boxes,
  ChevronRight,
  PenLine,
  ReceiptText,
  ShoppingBasket,
  User2,
} from 'lucide-vue-next';
import { useSelectedShopStore } from '@/store/shop';
import createProtectedApiInterface from '@/api/protected';
import type { RefreshTokenResponse } from '@/types/api/User';
import SeoMeta from '@/components/seo/SeoMeta.vue';

const router = useRouter();

definePageMeta({
  name: 'Erişim İzni',
});

const session = useSession();
const protectedApiInterface = createProtectedApiInterface();
const selectedShop = useSelectedShopStore();

const Processing = ref(false);

const read: [FunctionalComponent | VNode, string][] = [
  // Admissions
  [ReceiptText, 'Adisyonları ve detaylarını görüntüleyebilir.'],
  // Products
  [Boxes, 'Ürünleri ve stoklarını görüntüleyebilir.'],
];
const write: [FunctionalComponent | VNode, string][] = [
  // Sells
  [ShoppingBasket, 'Satış oluşturabilir ve düzenleyebilir.'],
  [BadgePercent, 'İndirim kullanabilir.'],
  [ArrowRightLeft, 'Satış iadesi yapabilir.'],
  // Admissions
  [ReceiptText, 'Adisyon oluşturabilir.'],
  [PenLine, 'Adisyon detaylarını değiştirebilir.'],
  [ArrowRightLeft, 'Adisyon iadesi oluşturabilir.'],
];

interface Application {
  name: string;
  id: string;
  scope: string;
  callback: string;
}

const app = ref<Application>();

onBeforeMount(async () => {
  await router.isReady();

  if (await session.requireToLogin()) useRedirect('/login', '/authorize');

  const app_id = router.currentRoute.value.query.id;

  if (!app_id) return useRedirect('/user');

  const application = await protectedApiInterface<Application>({
    method: 'GET',
    url: `auth/app/${app_id}`,
  }).catch(useErrorHandler);

  if (!application) return;

  app.value = application.data;
});

async function GrantAuthorization() {
  if (!session.data.value) return;
  Processing.value = true;

  // Create access_token for application with refresh_token
  const tokenResponse = await protectedApiInterface<RefreshTokenResponse>({
    method: 'POST',
    url: 'auth/token',
    data: {
      grant_type: 'authorization_code',
      refresh_token: session.data.value.refreshToken,
      application_id: app.value?.id,
    },
  }).catch((err) =>
    useErrorHandler(err, {
      locales: {
        '404': () => {
          useRedirect('/user');
          return {
            title: 'Bulunamadı.',
            reason: 'Oturum açma talebi istenen uygulama, mevcut değil.',
          };
        },
      },
    })
  );

  if (!tokenResponse) return;

  // Create url encoded search params for callback
  const params = new URLSearchParams();

  params.set('access_token', tokenResponse.data.access_token);
  params.set('expires_in', '' + tokenResponse.data.expires_in);

  // Route to callback in existed window
  window.open(`${app.value?.callback}?${params.toString()}`, '_self');
}
</script>
