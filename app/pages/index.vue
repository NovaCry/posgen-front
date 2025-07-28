<script setup lang="ts">
import AISection from '@/components/index/AISection.vue';
import AnalyticsSection from '@/components/index/AnalyticsSection.vue';
import APISection from '@/components/index/APISection.vue';
import IntegrationLibrary from '@/components/index/IntegrationLibrary.vue';
import NetworkSection from '@/components/index/NetworkSection.vue';
import QuickStartSection from '@/components/index/QuickStartSection.vue';
import StartSection from '@/components/index/StartSection.vue';
import Footer from '@/components/template/Footer.vue';
import Header from '@/components/template/Header.vue';

definePageMeta({
  name: 'Ana Sayfa',
  meta: {
    hideInBreadcrumb: true,
    dontAuthorize: true,
  },
});
</script>

<template>
  <main>
    <Header />
    <div
      class="flex flex-col items-center [background-image:var(--background-grid)] bg-size-[17px_17px]"
    >
      <div class="w-[95vw] sm:w-[95vw] border-x bg-background">
        <StartSection />
        <QuickStartSection />
        <!-- <ExplainSection /> -->
        <AnalyticsSection />
        <NetworkSection />
        <IntegrationLibrary />
        <APISection />
        <AISection />
      </div>
    </div>
    <Footer />
  </main>
</template>
