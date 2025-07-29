<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import MessageBubble from '../template/MessageBubble.vue';
import { Button } from '../ui/button';
import Section from './Section.vue';
import SectionHeading from './SectionHeading.vue';
</script>

<template>
  <Section>
    <SectionHeading>
      <div class="flex flex-col">
        Standartların Ötesinde Yardımcı
        <span class="font-header mt-4 ml-1 text-muted-foreground text-lg"
          >Pai tarafından üretilen her sonuç doğru olmayabilir.</span
        >
      </div>
    </SectionHeading>
    <div
      class="min-h-[70vh] mt-8 grid grid-cols-1 lg:grid-cols-2 rounded-xl grid-rows-2 border"
    >
      <div class="p-4 md:p-8">
        <div class="flex flex-col gap-4">
          <MessageBubble :owned="true" name="Eren Kaplan">
            Yaz aylarına girmek üzereyiz, sence hangi ürünler indirime girmeli?
          </MessageBubble>
          <MessageBubble name="Posgen Artificial Intelligence">
            Önceki satışlarınızdan ve mevcut duruma bakıldığında
            <code class="border rounded-md p-1 bg-background/40 text-sm"
              >Dondurma</code
            >
            kategorisindeki ürünler %10 indirime girebilir.
          </MessageBubble>
          <Button variant="outline" class="w-fit mr-auto ml-10">
            %10 İndirim Oluşturun <ArrowRight />
          </Button>
        </div>
      </div>
      <div class="p-4 md:p-8 border-t lg:border-t-0 lg:border-l">
        <div class="flex flex-col gap-4">
          <MessageBubble :owned="true" name="Kerim Gültekin">
            Bütün Apple ürünlerinin fiyatlarını, resmi satış fiyatlarına göre
            ayarlayabilir misin?
          </MessageBubble>
          <MessageBubble name="Posgen Artificial Intelligence">
            Elbette, mağazanızdaki bütün Apple ürünleri resmi satış fiyatlarına
            göre ayarlanıyor.
          </MessageBubble>
          <span class="text-muted-foreground my-2.5">
            22 Ürün Detayları Güncellendi
          </span>
        </div>
      </div>
      <div class="p-4 md:p-8 border-t">
        <div class="flex flex-col gap-4">
          <MessageBubble :owned="true" name="Emir Bozat">
            Geçen ayki Trendyol satışlarını bana E-Posta üzerinden gönderebilir
            misin?
          </MessageBubble>
          <MessageBubble name="Posgen Artificial Intelligence" class="mb-2.5">
            Haziran ayının Trendyol satışları E-Posta üzerinden gönderiliyor.
          </MessageBubble>
          <span class="text-muted-foreground my-1">
            Trendyol ile etkileşime geçildi
            <br />
            <span class="ml-1.5 text-sm">- Satışları Al</span>
          </span>
          <span class="text-muted-foreground my-1">
            Gmail ile etkileşime geçildi
            <br />
            <span class="ml-1.5 text-sm">- E-Posta Gönder</span>
          </span>
        </div>
      </div>
      <div
        class="flex items-center px-4 min-h-[320px] lg:min-h-0 justify-center bg-(image:--background-grid) bg-size-[20px_20px]"
      >
        <div class="border flex flex-col p-4 bg-background rounded-lg">
          <h4 class="text-xl">Pai'yi deneyin!</h4>
          <span class="text-sm">
            Can sıkıcı işleri sizin yerinize bırakın o halletsin.
          </span>
          <NuxtLink to="/register" class="w-full mt-4">
            <Button class="w-full"> Şimdi Başla <ArrowRight /> </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </Section>
</template>
