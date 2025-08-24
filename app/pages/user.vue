<script setup lang="ts">
import Footer from '~/components/template/Footer.vue';

useSeo({
  title: 'Hesap Yönetimi',
  description: 'Hesap yönetimi',
});
</script>

<template>
  <div>
    <main>
      <HeaderIndexHeader />
      <div
        class="flex flex-col items-center [background-image:var(--background-grid)] bg-size-[17px_17px]"
      >
        <div class="w-[95vw] sm:w-[95vw] border-x bg-background">
          <div class="h-20"></div>
          <div class="px-8 py-10 sm:px-16 sm:py-16 flex items-center border-y">
            <h1 class="text-3xl sm:text-4xl">Hesap Yönetimi</h1>
          </div>
          <Section>
            <div
              class="flex flex-col sm:grid sm:grid-cols-5 md:grid-cols-7 gap-8"
            >
              <div
                class="sticky top-20 sm:block sm:col-span-2 md:col-span-2 h-min"
              >
                <UserSidebar />
              </div>
              <div class="sm:col-span-3 md:col-span-5">
                <NuxtPage />
              </div>
            </div>
          </Section>
        </div>
      </div>
      <Footer />
    </main>
  </div>
</template>
