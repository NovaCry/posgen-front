<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  keywords?: string
  author?: string
  robots?: string
  ogType?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_status' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: 'summary_large_image' | 'summary' | 'app' | 'player'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  noindex?: boolean
  nofollow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Posgen - Yapay Zeka Destekli İşletme Yazılımları',
  description: 'Posgen ile işletmenizi kolayca yönetin. Sipariş takibi, masa yönetimi, stok kontrolü ve daha fazlası.',
  keywords: 'kafe yönetimi, restoran yönetimi, sipariş takibi, masa yönetimi, stok kontrolü, POS sistemi',
  author: 'Posgen',
  robots: 'index, follow',
  ogType: 'website',
  ogTitle: 'Posgen - Yapay Zeka Destekli İşletme Yazılımları',
  ogDescription: 'Posgen ile işletmenizi kolayca yönetin. Sipariş takibi, masa yönetimi, stok kontrolü ve daha fazlası.',
  ogImage: '/og-image.jpg',
  ogUrl: 'https://posgen.tr',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Posgen - Yapay Zeka Destekli İşletme Yazılımları',
  twitterDescription: 'Posgen ile işletmenizi kolayca yönetin.',
  twitterImage: '/og-image.jpg',
  noindex: false,
  nofollow: false
})

useSeoMeta({
  title: props.title,
  description: props.description,
  keywords: props.keywords,
  author: props.author,
  robots: props.noindex || props.nofollow ? `${props.noindex ? 'noindex' : 'index'}, ${props.nofollow ? 'nofollow' : 'follow'}` : props.robots,
  ogType: props.ogType,
  ogTitle: props.ogTitle,
  ogDescription: props.ogDescription,
  ogImage: props.ogImage,
  ogUrl: props.ogUrl,
  twitterCard: props.twitterCard,
  twitterTitle: props.twitterTitle,
  twitterDescription: props.twitterDescription,
  twitterImage: props.twitterImage,
})
</script>

<template>
</template>
