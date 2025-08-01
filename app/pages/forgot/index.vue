<template>
  <div class="container flex flex-col items-center justify-center min-h-screen">
    <Header />
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle class="text-3xl"> Şifremi Unuttum </CardTitle>
        <CardDescription>
          E-Posta adresinizi kullanarak şifrenizi sıfırlayabilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="email">E-Posta</Label>
          <Input
            id="email"
            v-model="Email"
            :disabled="Processing"
            type="email"
            placeholder="E-Posta Adresiniz..."
          />
        </div>

        <Button :disabled="Processing" @click="Login()">
          <Icon
            v-if="Processing"
            name="lucide:loader-circle"
            class="animate-spin duration-1000"
          />
          Devam Et
        </Button>
        <span
          v-if="ApiMessage != ''"
          class="text-sm text-center text-red-600"
          >{{ ApiMessage }}</span
        >
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import defaultApiInterface from '@/api/default';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import type APIError from '@/types/api/APIError';
import type User from '@/types/api/User';
import type { AxiosError } from 'axios';
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import Header from '@/components/template/Header.vue';

const router = useRouter();

definePageMeta({
  name: 'Şifremi Unuttum',
});

const Processing = ref(false);

const Email = ref('');

const ApiMessage = ref('');

const user = useUserStore();

const customizedErrorHandler = (err: AxiosError<APIError>) =>
  useErrorHandler(err, {
    afterAll(err, locale) {
      if (locale) ApiMessage.value = locale.reason;
    },
  });

async function Login() {
  Processing.value = true;
  const response = await defaultApiInterface<{ user: User; token: string }>({
    url: 'auth/login',
    method: 'POST',
    data: {
      email: Email.value,
    },
  }).catch(customizedErrorHandler);

  Processing.value = false;

  if (!response) return;

  console.log(response.data);

  user.$patch(response.data);
  user.save();

  router.push('/dashboard/user');
}
</script>
