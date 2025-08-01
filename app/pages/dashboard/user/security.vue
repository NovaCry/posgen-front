<script setup lang="ts">
import Section from '@/components/layout/Section.vue';
import TooltipSimplified from '@/components/TooltipSimplified.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip } from '@/components/ui/tooltip';
import {
  ArrowRight,
  Asterisk,
  Check,
  ChevronRight,
  KeyRound,
  LogIn,
  Mail,
  MessageCircle,
  Phone,
  ShieldAlert,
  ShieldCloseIcon,
  SquareAsterisk,
} from 'lucide-vue-next';

definePageMeta({
  name: 'Güvenlik',
});
</script>

<template>
  <Section>
    <h1 class="text-3xl font-semibold">Güvenlik</h1>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div
        class="flex flex-col border rounded-lg justify-between overflow-hidden"
      >
        <div class="flex gap-4 items-center p-4 hover:bg-secondary transition">
          <KeyRound class="size-4 text-muted-foreground" />
          <span>Mevcut şifreyi güncelle</span>
          <ChevronRight class="size-4 text-muted-foreground ml-auto" />
        </div>
        <Separator class="w-[75%] mx-auto" />
        <div class="flex gap-4 items-center p-4 hover:bg-secondary transition">
          <Phone class="size-4 text-muted-foreground" />
          <span>0512 345 67 89</span>
          <ChevronRight class="size-4 text-muted-foreground ml-auto" />
        </div>
        <Separator class="w-[75%] mx-auto" />
        <div class="flex gap-4 items-center p-4 hover:bg-secondary transition">
          <Mail class="size-4 text-muted-foreground" />
          <span>johndoe0123@mail.org</span>
          <ChevronRight class="size-4 text-muted-foreground ml-auto" />
        </div>
      </div>
      <div
        class="h-full flex flex-col border p-4 rounded-lg bg-linear-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900"
      >
        <div class="flex h-full flex-col">
          <h3 class="text-lg font-semibold">Kuruluma Devam Edin</h3>
          <p class="text-sm mb-2">
            Hesabınızın güvenliğini sağlamak adına kuruluma devam edin.
          </p>
          <div class="mt-auto">
            <Label>75%</Label>
            <Progress :model-value="75" class="h-2" />
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-6">
      <div>
        <h2 class="mt-6 text-2xl font-semibold">Doğrulama Yöntemleri</h2>
        <div class="flex flex-col border rounded-lg mt-4 overflow-hidden">
          <div
            class="flex items-center p-4 gap-4 hover:bg-secondary transition"
          >
            <MessageCircle class="size-4 text-muted-foreground" />
            <span>Sms ile doğrulama</span>
            <div class="ml-auto flex gap-2">
              <ChevronRight class="size-4 text-muted-foreground" />
            </div>
          </div>
          <Separator class="w-[75%] mx-auto" />
          <div
            class="flex items-center p-4 gap-4 hover:bg-secondary transition"
          >
            <SquareAsterisk class="size-4 text-muted-foreground" />
            <span>Kimlik Doğrulama Uygulaması</span>
            <div class="ml-auto flex gap-2">
              <Tooltip>
                <TooltipSimplified content="Bu yöntem kurulu">
                  <Check class="size-4 text-green-500" />
                </TooltipSimplified>
              </Tooltip>
              <ChevronRight class="size-4 text-muted-foreground" />
            </div>
          </div>
          <Separator class="w-[75%] mx-auto" />
          <div
            class="flex items-center p-4 gap-4 hover:bg-secondary transition"
          >
            <Mail class="size-4 text-muted-foreground" />
            <span>E-Posta ile doğrulama</span>
            <div class="ml-auto flex gap-2">
              <Tooltip>
                <TooltipSimplified content="Bu yöntem kurulu">
                  <Check class="size-4 text-green-500" />
                </TooltipSimplified>
              </Tooltip>
              <ChevronRight class="size-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="mt-6 flex items-center justify-between">
          <h2 class="text-2xl font-semibold">İşlem Geçmişi</h2>
          <Button variant="ghost">
            Tam Geçmiş
            <ArrowRight />
          </Button>
        </div>
        <div class="flex flex-col border rounded-lg mt-4 overflow-hidden">
          <div
            class="flex items-center p-4 gap-4 bg-yellow-50 dark:bg-yellow-950 dark:bg-opacity-25"
          >
            <LogIn class="size-4 text-muted-foreground" />
            <span>"Ankara, Mamak" lokasyonundan giriş.</span>
            <div class="ml-auto flex gap-2">
              <Tooltip>
                <TooltipSimplified
                  content="Bu eylemin incelenmesi gerektiğini düşünüyoruz."
                >
                  <ShieldAlert class="size-4 text-yellow-500" />
                </TooltipSimplified>
              </Tooltip>
              <ChevronRight class="size-4 text-muted-foreground" />
            </div>
          </div>
          <div
            class="flex items-center p-4 gap-4 hover:bg-secondary transition"
          >
            <SquareAsterisk class="size-4 text-muted-foreground" />
            <span>Kimlik Doğrulama Anahtarı değiştirildi.</span>
            <div class="ml-auto flex gap-2">
              <ChevronRight class="size-4 text-muted-foreground" />
            </div>
          </div>
          <div
            class="flex items-center p-4 gap-4 hover:bg-secondary transition"
          >
            <Asterisk class="size-4 text-muted-foreground" />
            <span>Şifre değiştirildi.</span>
            <div class="ml-auto flex gap-2">
              <ChevronRight class="size-4 text-muted-foreground" />
            </div>
          </div>
          <div
            class="flex items-center p-4 gap-4 bg-red-50 dark:bg-red-950 dark:bg-opacity-25"
          >
            <LogIn class="size-4 text-muted-foreground" />
            <span>"İstanbul, Şirinevler" lokasyonundan giriş.</span>
            <div class="ml-auto flex gap-2">
              <Tooltip>
                <TooltipSimplified content="Eylem reddedildi.">
                  <ShieldCloseIcon class="size-4 text-red-500" />
                </TooltipSimplified>
              </Tooltip>
              <ChevronRight class="size-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>
