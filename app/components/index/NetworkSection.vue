<script setup lang="ts">
import SectionHeading from '@/components/index/SectionHeading.vue';
import { useScroll } from 'motion-v';
import { ref } from 'vue';
import Card from '../index-card/Card.vue';
import CardContent from '../index-card/CardContent.vue';
import CardHeading from '../index-card/CardHeading.vue';
import CardDescription from '../index-card/CardDescription.vue';
import Section from './Section.vue';

const sectionAnimationTarget = ref<HTMLDivElement | null>(null);

const sectionContentAnimationState = useScroll({
  target: sectionAnimationTarget,
  offset: ['start end', 'end end'],
  axis: 'y',
});
const sectionContentAnimationPositionValueState = ref(0);

sectionContentAnimationState.scrollYProgress.on('change', (l) => {
  sectionContentAnimationPositionValueState.value = 150 * (1 - l);
});
</script>

<template>
  <Section>
    <SectionHeading> Gerçek Zamanlı Platform </SectionHeading>
    <div
      ref="sectionAnimationTarget"
      class="grid grid-cols-1 md:grid-cols-2 h-full mt-8 gap-4 relative"
    >
      <Card
        :style="{
          top: `${sectionContentAnimationPositionValueState}px`,
          opacity: sectionContentAnimationState.scrollYProgress,
        }"
      >
        <figure class="aspect-video">
          <img
            src="@/assets/reliable-connection.png"
            alt="reliable-connection"
          />
        </figure>
        <CardContent>
          <CardHeading> Kesintisiz Bağlantı </CardHeading>
          <CardDescription>
            Posgen, kullandığı son teknolojiler sayesinde müessesenizle
            sunucularımız arasında kesintisiz müthiş hızlı bir bağlantı sunar,
            şayet bağlantı kopuklarında bile veri kaybına uğramazsınız.
          </CardDescription>
        </CardContent>
      </Card>
      <Card
        :style="{
          top: `${sectionContentAnimationPositionValueState}px`,
          opacity: sectionContentAnimationState.scrollYProgress,
        }"
      >
        <figure class="aspect-video">
          <img src="@/assets/end-to-end.png" alt="reliable-connection" />
        </figure>
        <CardContent>
          <CardHeading> Uçtan Uca Şifreli </CardHeading>
          <CardDescription>
            Verileriniz iletim esnasında bile şifrelenirken 3 ayrı konumda
            özenle yedeklenir, Posgen kullanmaya başladığınızdan mütevellit veri
            güvenliğiniz konusunda endişeye mahal olmaz.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  </Section>
</template>
