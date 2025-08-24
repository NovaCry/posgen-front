interface Props {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  ogType?:
    | 'website'
    | 'article'
    | 'book'
    | 'profile'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_status'
    | 'video.movie'
    | 'video.episode'
    | 'video.tv_show'
    | 'video.other';
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary_large_image' | 'summary' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export default function useSeo(userDefinedOptions: Props) {
  const options: Props = {
    title: 'Posgen - Yapay Zeka Destekli İşletme Yazılımları',
    description:
      'Posgen ile işletmenizi kolayca yönetin. Sipariş takibi, masa yönetimi, stok kontrolü ve daha fazlası.',
    keywords:
      'kafe yönetimi, restoran yönetimi, sipariş takibi, masa yönetimi, stok kontrolü, POS sistemi',
    author: 'Posgen',
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Posgen - Yapay Zeka Destekli İşletme Yazılımları',
    ogDescription:
      'Posgen ile işletmenizi kolayca yönetin. Sipariş takibi, masa yönetimi, stok kontrolü ve daha fazlası.',
    ogImage: '/og-image.jpg',
    ogUrl: 'https://posgen.tr',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Posgen - Yapay Zeka Destekli İşletme Yazılımları',
    twitterDescription: 'Posgen ile işletmenizi kolayca yönetin.',
    twitterImage: '/og-image.jpg',
    noindex: false,
    nofollow: false,
    ...userDefinedOptions,
  };

  useSeoMeta({
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    author: options.author,
    robots:
      options.noindex || options.nofollow
        ? `${options.noindex ? 'noindex' : 'index'}, ${options.nofollow ? 'nofollow' : 'follow'}`
        : options.robots,
    ogType: options.ogType,
    ogTitle: options.ogTitle,
    ogDescription: options.ogDescription,
    ogImage: options.ogImage,
    ogUrl: options.ogUrl,
    twitterCard: options.twitterCard,
    twitterTitle: options.twitterTitle,
    twitterDescription: options.twitterDescription,
    twitterImage: options.twitterImage,
  });
}
