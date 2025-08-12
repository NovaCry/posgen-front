<template>
  <div class="w-screen h-screen flex items-center justify-center p-4">
    <Header />
    <div
      class="grid grid-cols-1 md:grid-cols-2 w-full max-w-sm max-h-auto md:max-w-[720px] border md:min-h-[520px] rounded-lg overflow-hidden"
    >
      <div class="border-r-0 md:border-r p-4 md:p-6 relative flex flex-col">
        <h1 class="text-xl md:text-2xl font-semibold">Tekrar Hoşgeldin</h1>
        <span class="text-pretty text-muted-foreground text-sm md:text-base"
          >Posgen Yönetim Paneline devam et.</span
        >
        <div class="flex flex-col gap-4 md:gap-5 mt-4 md:mt-6">
          <div class="flex flex-col gap-2">
            <Label for="email">E-Posta</Label>
            <Input
              id="email"
              v-model="Email"
              :disabled="Processing"
              type="email"
              placeholder="örn. kullanici@posgen.app"
              tabindex="1"
              @keydown.enter="Login()"
            />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="pass" class="flex w-full"
              >Şifre
              <NuxtLink class="ml-auto underline text-sm" to="/forgot"
                >Şifrenizi mi unuttunuz?
              </NuxtLink>
            </Label>
            <div class="relative">
              <Input
                id="pass"
                v-model="Password"
                :disabled="Processing"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                tabindex="2"
                @keydown.enter="Login()"
              />
              <button
                tabindex="-1"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                @click="showPassword = !showPassword"
              >
                <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <Switch id="remember" v-model="RememberMe" />
            <label
              for="remember"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Beni Hatırla
            </label>
          </div>
          <span
            v-if="ApiMessage != ''"
            class="text-sm text-center text-red-600"
            >{{ ApiMessage }}</span
          >
        </div>
        <Button
          class="mt-4 md:mt-6 w-full"
          :disabled="Processing"
          tabindex="3"
          @click="Login()"
        >
          <Icon
            v-if="Processing"
            name="lucide:loader-circle"
            class="animate-spin duration-1000"
          />
          Giriş Yap
          <ArrowRight />
        </Button>
        <div class="flex flex-col gap-3 md:gap-4 mt-4 md:mt-6">
          <Separator class="mb-2 w-[75%] mx-auto" label="veya" />
          <div class="flex flex-col gap-2">
            <Button variant="outline" tabindex="4">
              <Icon name="cib:google" /> Google ile devam et
            </Button>
          </div>
        </div>
        <span class="mx-auto mt-4 md:mt-6 text-sm text-center"
          >Hesabınız yok mu?
          <NuxtLink to="/register" class="underline" tabindex="5"
            >Kayıt olun!</NuxtLink
          >
        </span>
      </div>
      <div class="overflow-hidden relative hidden md:block">
        <a
          href="https://unsplash.com/photos/turned-on-monitor-tE6th1h6Bfk"
          class="absolute bottom-4 right-4 text-black underline text-sm"
          >Blake Wisz'e teşekkürler.</a
        >
        <img
          lazy
          src="../assets/blake-wisz-tE6th1h6Bfk-unsplash.jpg"
          class="w-full h-full rounded-none object-cover object-center"
        />
        <Skeleton class="w-full h-full rounded-none" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultApiInterface from '@/api/default';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import type APIError from '@/types/api/APIError';
import type User from '@/types/api/User';
import type { AxiosError } from 'axios';
import { ref } from 'vue';
import type Shop from '@/types/api/Shop';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Eye, EyeOff } from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator';
import createProtectedApiInterface from '@/api/protected';
import { toast } from 'vue-sonner';
import Header from '@/components/header/index/IndexHeader.vue';
import { useRouter } from 'vue-router';

definePageMeta({
  name: 'Giriş Yap',
  meta: {
    dontAuthorize: true,
  },
  middleware: ['auth'],
});

const Processing = ref(false);
const router = useRouter();

const Email = ref('');
const Password = ref('');
const RememberMe = ref(false);
const showPassword = ref(false);

const ApiMessage = ref('');

const session = useSession();
const user = useUser();

const customizedErrorHandler = (err: AxiosError<APIError>) =>
  useErrorHandler(err, {
    afterAll(_, locale) {
      if (locale) ApiMessage.value = locale.reason;
    },
  });

interface UserLoginSuccess {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: 'default';
}

async function Login() {
  Processing.value = true;

  const response = await defaultApiInterface<UserLoginSuccess>({
    url: 'auth/login',
    method: 'POST',
    data: {
      email: Email.value,
      password: Password.value,
      rememberMe: RememberMe.value,
    },
  }).catch(customizedErrorHandler);

  Processing.value = false;

  if (!response) return;

  const expiration = new Date();
  expiration.setFullYear(2026);

  user.patch(response.data.user);
  session.patch({
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: expiration + '',
  });

  const protectedApiInterface = createProtectedApiInterface();

  const listResponse = await protectedApiInterface<Shop[]>({
    url: 'shop/list',
    method: 'GET',
  }).catch(customizedErrorHandler);

  if (!listResponse) {
    Processing.value = false;
    return;
  }

  user.patch({
    shops: listResponse.data,
  });

  const greetingsVerb = (() => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours <= 12) return 'Günaydın';
    if (hours >= 12 && hours < 18) return 'Tünaydın';
    if (hours >= 18 && hours < 20) return 'İyi akşamlar';
    if (hours >= 20 || hours < 6) return 'İyi geceler';
  })();

  toast('Tekrar Hoşgeldiniz.', {
    description: `Sizi gördüğümüze sevindik. ${greetingsVerb}, ${response.data.user.firstName}`,
  });

  router.push('/dashboard/');
}
</script>
