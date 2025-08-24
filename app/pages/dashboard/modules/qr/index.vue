<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import {
  Check,
  ArrowUpRight,
  QrCode,
  Eye,
  Download,
  // ChevronRight,  for Advanced Editing
  Loader2,
  Clock,
  BarChart3,
  Calendar,
  RefreshCw,
  Copy,
  Share2,
} from 'lucide-vue-next';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'vue-sonner';
import WriteClipboard from '@/lib/writeClipboard';
import ChangeTemplateDialog from '@/components/dialogs/ChangeTemplateDialog.vue';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ChangeDomainDialog from '@/components/dialogs/ChangeDomainDialog.vue';
import { toLocaleDate } from '@/lib/toLocaleDate';
import Section from '@/components/layout/Section.vue';
import SeoMeta from '@/components/seo/SeoMeta.vue';
definePageMeta({
  name: 'QR Menü Yönetimi',
});

interface Template {
  id: number;
  name: string;
  description: string;
  color: string;
}

const templates = ref<Template[]>([
  {
    id: 1,
    name: 'Modern Menü',
    description: 'Şık ve modern tasarımlı dijital menü şablonu',
    color: 'bg-zinc-800 dark:bg-zinc-700',
  },
  {
    id: 2,
    name: 'Klasik Menü',
    description: 'Geleneksel restoran menüsü tasarımı',
    color: 'bg-zinc-700 dark:bg-zinc-600',
  },
  {
    id: 3,
    name: 'Cafe Menü',
    description: 'Cafe ve pastaneler için özel tasarım',
    color: 'bg-zinc-500 dark:bg-zinc-400',
  },
]);

const generateRandomSubdomain = () => {
  const words = [
    'kerim',
    'eren',
    'murat',
    'emir',
    'menu',
    'leziz',
    'nefis',
    'enfes',
    'tatlı',
    'tuzlu',
    'sıcak',
    'soğuk',
    'taze',
    'güzel',
    'keyif',
  ];
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];

  const randomNum = Math.floor(Math.random() * 90) + 10;

  return `${word1}${word2}${randomNum}`;
};

const selectedTemplate = ref<Template>(templates.value[0]!);
const isLoading = ref(false);
const viewCount = ref(0);
const creationDate = ref(toLocaleDate(new Date(), true));
const lastUpdateDate = ref('');
const subdomain = ref(generateRandomSubdomain());

const status = computed(() => {
  return isLoading.value ? 'Bekleniyor' : 'Aktif';
});

const fullDomain = computed(() => {
  return `${subdomain.value}.posgen.app`;
});

const loadingProgress = ref(0);
const loadingInterval = ref<number | null>(null);

const confirmSubdomainChange = () => {
  subdomain.value = generateRandomSubdomain();
  WriteClipboard(fullDomain.value);
};

const confirmTemplateChange = (template: Template) => {
  selectedTemplate.value = template;

  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;

    viewCount.value = 0;

    lastUpdateDate.value = toLocaleDate(new Date(), true);

    if (loadingInterval.value !== null) {
      clearInterval(loadingInterval.value);
    }
    loadingProgress.value = 100;

    toast.success('Şablon değiştirildi', {
      description: `${template.name} şablonu başarıyla uygulandı.`,
    });
  }, 1500);
};

onUnmounted(() => {
  if (loadingInterval.value !== null) {
    clearInterval(loadingInterval.value);
  }
});
</script>

<template>
  <div>
    <SeoMeta title="QR Menü Yönetimi" description="QR Menü Yönetimi" />
    <Section>
      <h1 class="text-3xl font-semibold">QR Menü Yönetimi</h1>

      <div class="mt-6 grid grid-cols-2 w-full gap-6">
        <div class="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle> Seçili Şablon </CardTitle>
              <CardDescription>
                QR Menünüzün sahip olduğu tasarım stili.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex items-center gap-4">
              <div class="p-2 size-10 bg-secondary rounded-full">
                <QrCode />
              </div>
              <div>
                <h3 class="font-semibold">
                  {{ selectedTemplate.name }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ selectedTemplate.description }}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle> Adres Bilgileri </CardTitle>
              <CardDescription>
                QR Menünüzün sahip olduğu internetten erişilebilir adres.
              </CardDescription>
            </CardHeader>
            <CardContent class="">
              <Label class="text-sm font-medium text-muted-foreground"
                >Menü İnternet Adresi</Label
              >
              <div class="flex gap-2 items-center my-1">
                <Input v-model="fullDomain" disabled />
                <Button
                  size="icon"
                  variant="outline"
                  @click="WriteClipboard(fullDomain)"
                >
                  <Copy />
                </Button>
                <ChangeDomainDialog @click="confirmSubdomainChange()">
                  <Button size="icon" variant="outline">
                    <RefreshCw />
                  </Button>
                </ChangeDomainDialog>
              </div>
              <small class="text-xs text-muted-foreground"
                >Bu URL üzerinden menünüze erişilebilir.</small
              >
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle> Temel Bilgiler </CardTitle>
              <CardDescription>
                Hizmet adına gösterilmeye değer sistematik bilgiler.
              </CardDescription>
            </CardHeader>
            <CardContent class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <Label class="text-muted-foreground flex items-center gap-2">
                  <Calendar class="size-4 text-muted-foreground" />
                  Oluşturulma Tarihi
                </Label>
                <p>{{ creationDate || 'Henüz oluşturulmadı' }}</p>
              </div>
              <div class="flex items-start gap-2">
                <div class="flex flex-col gap-1">
                  <Label class="text-muted-foreground flex items-center gap-2">
                    <Clock class="size-4 text-muted-foreground" />
                    Son Güncelleme
                  </Label>
                  <p>
                    {{
                      isLoading
                        ? 'Güncelleniyor...'
                        : lastUpdateDate || 'Henüz güncellenmedi'
                    }}
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-2">
                <div class="flex flex-col gap-1">
                  <Label class="text-muted-foreground flex items-center gap-2">
                    <BarChart3 class="size-4 text-muted-foreground" />
                    Görüntülenme
                  </Label>
                  <p>{{ isLoading ? '—' : `${viewCount} kez` }}</p>
                </div>
              </div>
              <div class="flex items-start gap-2">
                <div class="flex flex-col gap-1 group" :data-loading="isLoading">
                  <Label class="text-muted-foreground flex items-center gap-2">
                    <div class="size-4 flex items-center justify-center">
                      <div
                        class="size-2 rounded-full bg-green-500 group-data-[loading=true]:bg-yellow-500"
                      />
                    </div>
                    Durum
                  </Label>
                  <p
                    class="text-green-500 group-data-[loading=true]:text-yellow-500"
                  >
                    {{ status }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div
            class="flex flex-col border p-4 rounded-lg bg-linear-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900"
          >
            <div class="flex items-center">
              <div
                class="flex p-3 bg-primary aspect-square w-fit h-fit rounded-full"
              >
                <Check v-if="!isLoading" class="text-foreground size-6" />
                <Loader2 v-else class="text-foreground size-6 animate-spin" />
              </div>
              <div class="ml-4">
                <h1 class="text-lg font-semibold">
                  <template v-if="isLoading">
                    QR Menünüz Hazırlanıyor...
                  </template>
                  <template v-else> QR Menünüz Hazır! </template>
                </h1>
                <p class="text-sm text-muted-foreground">
                  <template v-if="isLoading">
                    Lütfen bekleyin, QR kodunuz oluşturuluyor.
                  </template>
                  <template v-else>
                    Menünüzü görüntülemek veya indirmek için aşağıdaki butonları
                    kullanabilirsiniz.
                  </template>
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 my-8">
              <div
                class="flex justify-center relative w-fit mx-auto rounded-lg border-zinc-800 overflow-hidden"
              >
                <div
                  v-if="isLoading"
                  class="absolute w-full h-full flex items-center justify-center bg-white/20 backdrop-blur-sm"
                >
                  <Loader2 class="size-8 animate-spin text-black" />
                </div>
                <div class="p-4 flex items-center bg-white">
                  <QrCode class="size-32 text-black" />
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <Button>
                  Menüye Git
                  <ArrowUpRight />
                </Button>
                <Button variant="outline" class="bg-background">
                  <Download />
                  Kaydet
                </Button>
                <Button variant="outline" class="bg-background">
                  <Share2 />
                  Paylaş
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h2 class="text-2xl font-semibold">Şablonlar</h2>
        <p class="text-muted-foreground">
          İşletmeniz için uygun bir şablon seçin
        </p>

        <div class="grid grid-cols-2 md:grid-cols-3 mt-4 gap-6">
          <div
            v-for="template in templates"
            :key="template.id"
            :data-selected="template.id === selectedTemplate.id"
            class="border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md bg-background group ring-primary data-[selected=true]:ring-2"
          >
            <div
              class="h-40 flex items-center justify-center overflow-hidden relative"
              :class="template.color"
            >
              <div class="w-full h-full relative">
                <Skeleton class="w-full h-full rounded-none absolute inset-0" />
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="bg-white/10 backdrop-blur-xs p-2 rounded-md transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  >
                    <QrCode class="size-10 text-white" />
                  </div>
                </div>

                <div
                  class="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div
                  class="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div
                  class="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div
                  class="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-center">
                <h3 class="font-semibold">
                  {{ template.name }}
                </h3>
                <div
                  v-if="template.id === selectedTemplate.id"
                  class="flex p-1 bg-primary rounded-full"
                >
                  <Check class="text-foreground size-4" />
                </div>
              </div>
              <p class="text-sm text-muted-foreground mt-1">
                {{ template.description }}
              </p>
              <div class="flex justify-between mt-4">
                <Button variant="outline">
                  <Eye />
                  Önizle
                </Button>
                <ChangeTemplateDialog @click="confirmTemplateChange(template)">
                  <Button :disabled="template.id === selectedTemplate.id">
                    <template v-if="template.id == selectedTemplate.id">
                      <Check />
                      Seçili
                    </template>
                    <template v-else>
                      <RefreshCw />
                      Değiştir
                    </template>
                  </Button>
                </ChangeTemplateDialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="mt-6 border p-4 rounded-lg bg-muted/50">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold">
              Gelişmiş Düzenleme
            </h2>
            <p class="text-sm text-muted-foreground">
              Menünüzü özelleştirmek için gelişmiş düzenleme özelliklerini kullanın
            </p>
          </div>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 group"
            disabled
          >
            Düzenlemeye Başla
            <ChevronRight class="ml-1 size-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>-->
    </Section>
  </div>
</template>
