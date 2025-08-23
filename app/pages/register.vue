<template>
  <SeoMeta title="Kayıt Ol - Posgen" description="Posgen'e üye olun ve işletme yönetim sisteminizi kurmaya başlayın." />
  <div class="w-screen h-screen flex items-center justify-center flex-col p-4">
    <Header />
    <div class="flex-1 flex items-center justify-center w-full pt-8 md:pt-0">
      <div
        class="mt-10 grid grid-cols-1 md:grid-cols-10 w-full max-w-sm max-h-auto md:max-w-[720px] border md:min-h-[520px] rounded-lg overflow-hidden"
      >
        <div
          class="md:col-span-6 border-r-0 md:border-r p-4 md:p-6 relative flex flex-col"
        >
          <h1 class="text-xl md:text-2xl font-semibold">Kayıt Ol</h1>
          <span class="text-pretty text-muted-foreground text-sm md:text-base"
            >Posgen'in akıllı dünyasına adım atın.</span
          >
          <div class="flex flex-col gap-3 md:gap-5 mt-3 md:mt-6">
            <div class="flex flex-col md:flex-row gap-3 md:gap-4">
              <div class="flex flex-col gap-2 flex-1">
                <Label for="firstname">Ad <span class="text-red-500">*</span></Label>
                <Input
                  id="firstname"
                  v-model="FirstName"
                  :disabled="Processing"
                  type="text"
                  placeholder="örn. Eren"
                />
              </div>
              <div class="flex flex-col gap-2 flex-1">
                <Label for="lastname">Soyad <span class="text-red-500">*</span></Label>
                <Input
                  id="lastname"
                  v-model="LastName"
                  :disabled="Processing"
                  type="text"
                  placeholder="örn. Kaplan"
                />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="email">E-Posta <span class="text-red-500">*</span></Label>
              <Input
                id="email"
                v-model="Email"
                :disabled="Processing"
                type="email"
                placeholder="örn. erenkaplan@sirket.org"
              />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="pass">Şifre <span class="text-red-500">*</span></Label>
              <div class="relative">
                <Input
                  id="pass"
                  v-model="Password"
                  :disabled="Processing"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="• • • • • • •"
                />
                <button
                  tabindex="-1"
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  @click="showPassword = !showPassword"
                >
                  <component
                    :is="showPassword ? EyeOff : Eye"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="pass-repeat">Şifre Tekrar <span class="text-red-500">*</span></Label>
              <div class="relative">
                <Input
                  id="pass-repeat"
                  v-model="PasswordRepeat"
                  :disabled="Processing"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="• • • • • • •"
                />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="pass" class="flex w-full">Doğum Tarihi <span class="text-red-500">*</span></Label>
              <DatePicker
                v-model="Birthday"
                :disabled="Processing"
                rule="birthday"
              />
            </div>
            <div class="flex items-center space-x-2">
    <Checkbox id="terms" v-model:checked="acceptedTerms" />
    <label
      for="terms"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      <NuxtLink to="/terms" class="underline">Kullanım Koşullarını</NuxtLink> kabul ediyorum.
    </label>
  </div>
  <div class="flex items-center space-x-2">
    <Checkbox id="privacy" v-model:checked="acceptedPrivacy" />
    <label
      for="privacy"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      <NuxtLink to="/privacy" class="underline">Gizlilik Sözleşmesini</NuxtLink> kabul ediyorum.
    </label>
  </div>
            <span
              v-if="ApiMessage != ''"
              class="text-sm text-center text-red-600"
              >{{ ApiMessage }}</span
            >
          </div>
          <div
            class="flex flex-col md:flex-row mt-3 md:mt-6 items-center gap-3 md:gap-0"
          >
            <Button
              class="min-w-32 justify-start w-full md:w-auto"
              :disabled="Processing"
              @click="Register()"
            >
              <Icon
                v-if="Processing"
                name="lucide:loader-circle"
                class="animate-spin duration-1000"
              />
              Kayıt Ol
              <ArrowRight class="ml-auto" />
            </Button>
            <span class="md:ml-auto text-sm text-center"
              >Hesabınız mevcut mu?
              <NuxtLink to="/login" class="underline">Giriş Yapın!</NuxtLink>
            </span>
          </div>
        </div>
        <div class="md:col-span-4 overflow-hidden relative hidden md:block">
          <a
            href="https://unsplash.com/photos/interior-of-a-coffee-shop-tKN1WXrzQ3s"
            class="absolute bottom-4 right-4 underline text-sm"
          >
            Daan Evers'e teşekkürler.</a
          >
          <img
            lazy
            src="../assets/daan-evers-tKN1WXrzQ3s-unsplash.jpg"
            class="w-full h-full rounded-none object-cover object-center"
          />
          <Skeleton class="w-full h-full rounded-none" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import defaultApiInterface from '@/api/default';
import DatePicker from '@/components/calendar/DatePicker.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import { Skeleton } from '@/components/ui/skeleton';
import type APIError from '@/types/api/APIError';
import type User from '@/types/api/User';
import type { AxiosError } from 'axios';
import { ArrowRight, Eye, EyeOff } from 'lucide-vue-next';
import { ref } from 'vue';
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'vue-sonner';
import SeoMeta from '@/components/seo/SeoMeta.vue';
import Header from '@/components/header/index/IndexHeader.vue';

const router = useRouter();

definePageMeta({
  name: 'Kayıt Ol',
  meta: {
    dontAuthorize: true,
  },
  middleware: ['auth'],
});

const Processing = ref(false);

const acceptedTerms = ref(false);
const acceptedPrivacy = ref(false);

const FirstName = ref('');
const LastName = ref('');
const Email = ref('');
const Password = ref('');
const PasswordRepeat = ref('');
const Birthday = ref<Date>(new Date());
const showPassword = ref(false);

const ApiMessage = ref('');

const customizedErrorHandler = (err: AxiosError<APIError>) =>
  useErrorHandler(err, {
    afterAll(err, locale) {
      if (locale) ApiMessage.value = locale.reason;
    },
  });

async function Register() {
  if (!acceptedTerms.value || !acceptedPrivacy.value) {
    toast('Yasal Uyarı', {
      description: 'Kullanım Koşullarını ve Gizlilik Sözleşmesini kabul etmelisiniz.',
    });
    return;
  }
  
  if (Password.value !== PasswordRepeat.value) {
    ApiMessage.value = 'Şifreler eşleşmiyor.';
    return;
  }
  Processing.value = true;

  const response = await defaultApiInterface<{ user: User; token: string }>({
    url: 'auth/register',
    method: 'POST',
    data: {
      firstName: FirstName.value,
      lastName: LastName.value,
      email: Email.value,
      password: Password.value,
      bornDate: Birthday.value,
      role: 'business',
    },
  }).catch(customizedErrorHandler);

  Processing.value = false;

  if (!response) return;

  router.push('/login');

  toast('Her şey tamam!', {
    description: 'Hesabınızı kullanarak artık giriş yapabilirsiniz.',
  });
}
</script>
