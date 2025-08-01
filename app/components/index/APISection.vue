<script setup lang="ts">
import type { Endpoint } from '@/types/Endpoint';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import EndpointCard from '@/components/EndpointCard.vue';
import Section from '@/components/section/Section.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import Autoscroll from 'embla-carousel-auto-scroll';
import { ArrowRight } from 'lucide-vue-next';
import { Button } from '../ui/button';

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    url: '/shops',
    locked: true,
  },
  {
    method: 'GET',
    url: '/user/session',
    locked: true,
  },
  {
    method: 'GET',
    url: '/user',
    locked: true,
  },
  {
    method: 'POST',
    url: '/oauth/v2',
  },
  {
    method: 'PUT',
    url: '/admission',
    locked: true,
  },
  {
    method: 'PATCH',
    url: '/user',
    locked: true,
  },
  {
    method: 'DELETE',
    url: '/shop',
    locked: true,
  },
  {
    method: 'POST',
    url: '/admission',
    locked: true,
  },
  {
    method: 'DELETE',
    url: '/sell',
    locked: true,
  },
  {
    method: 'GET',
    url: '/admissions',
    locked: true,
  },
  {
    method: 'GET',
    url: '/sells',
    locked: true,
  },
  {
    method: 'GET',
    url: '/openapi/v3',
    locked: true,
  },
];
</script>

<template>
  <Section>
    <SectionHeading> Enterprise-Grade API </SectionHeading>
    <div class="flex flex-col gap-4 mt-16">
      <Carousel
        :opts="{
          loop: true,
          dragFree: true,
          skipSnaps: true,
        }"
        :plugins="[
          Autoscroll({
            active: true,
            speed: 1,
            direction: 'forward',
            stopOnFocusIn: false,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
          }),
        ]"
      >
        <CarouselContent>
          <CarouselItem
            v-for="endpoint of endpoints"
            :key="endpoint.url"
            class="basis-auto"
          >
            <EndpointCard :endpoint="endpoint" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Carousel
        :opts="{
          loop: true,
          dragFree: true,
          skipSnaps: true,
        }"
        :plugins="[
          Autoscroll({
            active: true,
            direction: 'backward',
            speed: 1,
            stopOnFocusIn: false,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
          }),
        ]"
      >
        <CarouselContent>
          <CarouselItem
            v-for="endpoint of endpoints"
            :key="endpoint.url"
            class="basis-auto"
          >
            <EndpointCard :endpoint="endpoint" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
    <div class="flex flex-col gap-4 mt-8">
      <span>
        Olağan ihtiyaçlarınızı hali hazırda mevcutta bulunan bizim ve
        topluluğumuz tarafından geliştirilmiş entegrasyonlar karşılamakta, lakin
        işletmenizin sahip olduğu geliştiricelere ve Posgen'i sistemlerine
        uyumlu hale getirmeye çalışan şirketlere teşekkür ediyor ve sizlere
        ihtiyaçlarınızın nerdeyse tamamından fazlasını karşılayacak olan bu
        dokümente edilmiş sistematik arayüz iletişim planını sunuyoruz.
      </span>
      <span>
        Siz geliştiricilerle çalışmaktan memnun duyar ve şayet ki bizimle
        çalışmayı göz önünde bulundurma fikrinizi değerlendirmeyi isteriz. Bu
        tarz talepler doğrultusunda Posgen'i daha iyi tanımak adına Hakkımızda
        sayfamızı ziyaret edebilir ve iletişime geçmek adına İletişim sayfamıza
        göz atabilirsiniz.
      </span>
    </div>
    <div class="flex gap-4 mt-8">
      <Button>İletişim <ArrowRight /> </Button>
      <Button variant="outline">Hakkımızda <ArrowRight /> </Button>
    </div>
  </Section>
</template>
