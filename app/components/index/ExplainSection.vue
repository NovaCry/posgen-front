<script setup lang="ts">
import { motion } from 'motion-v';
</script>

<template>
  <section class="px-8 py-8 mb-40 flex items-center justify-center md:px-16">
    <motion.div
      ref="StoryTextContainer"
      class="max-w-[1000px] flex flex-col gap-8"
      :in-view-options="{ amount: 0 }"
    >
      <motion.p
        class="text-2xl sm:text-3xl md:text-4xl leading-10 sm:leading-12 md:leading-14"
      >
        <motion.span
          :initial="{ opacity: 0.3 }"
          :while-in-view="{ opacity: 1 }"
          :in-view-options="{ margin: '-300px 0px -300px 0px' }"
        >
          Teknoloji geliştikçe, zaman ilerledikçe bu Dijital Çağda işletmeler
          olarak ihtiyaçlarınız ve istekleriniz gitgide büyüyor ve artıyor.
        </motion.span>
        <motion.span
          :initial="{ opacity: 0.3 }"
          :while-in-view="{ opacity: 1 }"
          :in-view-options="{ margin: '-320px 0px -320px 0px' }"
        >
          Halihazırda mevcut araçlar sahip olduğu karmaşıklık olsun,
          geliştirildiği yöntem ve sistem olsun bu ihtiyaçlarınızı karşılamakta
          güçlük çekiyor.
        </motion.span>
      </motion.p>
      <motion.p
        class="text-2xl sm:text-3xl md:text-4xl leading-10 sm:leading-12 md:leading-14"
      >
        <motion.span
          :initial="{ opacity: 0.3 }"
          :while-in-view="{ opacity: 1 }"
          :in-view-options="{ margin: '-300px 0px -300px 0px' }"
        >
          "Posgen" bu durumu diğer araçların aksine çok daha farklı ele alıyor.
          İşletmenizin giderek büyümesine karşın sizin yapmanız gereken bir şey
          bırakmıyor.
        </motion.span>
        <motion.span
          :initial="{ opacity: 0.3 }"
          :while-in-view="{ opacity: 1 }"
          :in-view-options="{ margin: '-320px 0px -320px 0px' }"
        >
          Siz işinizi yapmaya devam ederken, dijitalleşme yolunda Posgen'e
          güvenebilirsiniz.
        </motion.span>
      </motion.p>
    </motion.div>
  </section>
</template>
