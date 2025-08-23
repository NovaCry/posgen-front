<script setup lang="ts">
import { motion, MotionConfig } from 'motion-v';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import shortenName from '~/lib/shortenName';
import { toLocaleDate } from '~/lib/toLocaleDate';
import { toLocaleTime } from '~/lib/toLocaleTime';
import CafePinInput from '@/components/cafe/PinInput.vue';
import { Shield } from 'lucide-vue-next';
import SeoMeta from '@/components/seo/SeoMeta.vue';
const user = useUser();
const localTime = ref('');

let timerInterval: NodeJS.Timeout | undefined;

onMounted(() => {
  localTime.value = toLocaleTime(new Date());
  timerInterval = setInterval(() => {
    localTime.value = toLocaleTime(new Date());
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<template>
  <SeoMeta title="Garson Girişi" description="Garson girişi" />
  <main
    class="h-[calc(100vh-3rem)] flex items-start justify-center min-h-[80vh] pt-45 px-2 md:px-0"
  >
    <div class="flex flex-col items-center text-center w-full max-w-md gap-2">
      <MotionConfig
        :transition="{ type: 'tween', duration: 0.3, ease: 'anticipate' }"
      >
        <ClientOnly>
          <div class="flex flex-col items-center mb-2">
            <Avatar class="size-10">
              <AvatarImage src="" />
              <AvatarFallback v-if="user.data.value">
                {{ shortenName(user.data.value.name) }}
              </AvatarFallback>
            </Avatar>
          </div>
          <motion.span
            :initial="{ filter: 'blur(10px)', scale: 0.8 }"
            :animate="{ filter: 'blur(0px)', scale: 1 }"
            class="font-header mb-0.5"
            >{{ toLocaleDate(new Date(), true) }}</motion.span
          >
          <motion.h1
            :initial="{ filter: 'blur(10px)', scale: 0.8 }"
            :animate="{ filter: 'blur(0px)', scale: 1 }"
            :transition="{ delay: 0.1 }"
            class="text-5xl mb-2"
          >
            {{ localTime }}
          </motion.h1>
        </ClientOnly>
        <motion.div
          :initial="{ filter: 'blur(10px)', scale: 0.8 }"
          :animate="{ filter: 'blur(0px)', scale: 1 }"
          :transition="{ delay: 0.15 }"
          class="mt-2 flex flex-col items-center"
        >
          <span class="mb-2 text-sm text-gray-600 dark:text-gray-300"
            >Garson hesabınıza devam etmek için PIN kodunuzu girin.</span
          >
          <CafePinInput />
        </motion.div>
        <motion.div
          :initial="{ filter: 'blur(10px)', scale: 0.8 }"
          :animate="{ filter: 'blur(0px)', scale: 1 }"
          :transition="{ delay: 0.18 }"
          class="mt-5 w-full flex justify-start"
        >
          <Alert class="text-left">
            <Shield class="h-4 w-4 inline-block mr-2 align-top" />
            <AlertTitle class="text-left inline-block align-top"
              >Güvenli Kal!</AlertTitle
            >
            <AlertDescription class="text-left">
              Bu PIN kodu, hesabınızın güvenliğini sağlamak için gereklidir.
              Lütfen kimseyle paylaşmayın.
            </AlertDescription>
          </Alert>
        </motion.div>
        <motion.div
          :initial="{ filter: 'blur(10px)', scale: 0.8 }"
          :animate="{ filter: 'blur(0px)', scale: 1 }"
          :transition="{ delay: 0.2 }"
          class="py-3 flex items-center gap-2 justify-center"
        >
        </motion.div>
      </MotionConfig>
    </div>
  </main>
</template>
