import type APIError from '@/types/api/APIError';
import type { AxiosError } from 'axios';
import { toast } from 'vue-sonner';

interface HTTPErrorLocale {
  title: string;
  reason: string;
}

type HTTPComputedError = (
  err: AxiosError<APIError>
) => HTTPErrorLocale | undefined;

interface HTTPErrorList {
  [key: string]: HTTPComputedError | undefined;
  noInternet?: HTTPComputedError | undefined;
  trusted?: HTTPComputedError | undefined;
}

interface LocaleSettings {
  locales?: HTTPErrorList;
  beforeAll?: HTTPComputedError;
  afterAll?: (
    err: AxiosError,
    locale?: HTTPErrorLocale
  ) => void | Promise<void>;
  trusted?: boolean;
}

function findLocale(
  err: AxiosError<APIError>,
  localeName: string | 'noInternet' | 'trusted',
  locales: HTTPErrorList,
  settings?: LocaleSettings
): HTTPErrorLocale | undefined {
  const localeFunc = locales[localeName];
  if (!localeFunc) return;
  let res: HTTPErrorLocale | undefined = undefined;
  if (settings?.beforeAll) res = settings.beforeAll(err);
  res = res ?? localeFunc(err);
  if (settings?.afterAll) settings.afterAll(err, res);
  return res;
}

export default function errorHandler(
  err: AxiosError<APIError>,
  settings?: LocaleSettings
) {
  const router = useRouter();

  const errors: HTTPErrorList = {
    noInternet: () => ({
      title: 'İnternetinizi kontrol ediniz.',
      reason: 'Kullanmakta olduğunuz cihaz, Posgen sunucularına erişemiyor...',
    }),
    trusted: (err: AxiosError<APIError>) => {
      if (!err.response) return;
      return {
        title: err.response?.data.error,
        reason: err.response?.data.reason,
      };
    },
    '400': () => ({
      title: 'Geçersiz İstek',
      reason: 'Sunucu, hatalı bir istek nedeniyle işlemi gerçekleştiremiyor.',
    }),
    '401': () => {
      if (!router.currentRoute.value.meta.dontAuthorize)
        useRedirect('/login', router.currentRoute.value.path);

      return {
        title: 'Yetkisiz',
        reason: 'Bu işlemi gerçekleştirmek için kimlik doğrulaması gereklidir.',
      };
    },
    '402': () => ({
      title: 'Ödeme Gerekli',
      reason: 'Bu kaynağa erişmek için ödeme yapılması gerekmektedir.',
    }),
    '403': () => {
      if (!router.currentRoute.value.meta.dontAuthorize)
        useRedirect('/login', router.currentRoute.value.path);

      return {
        title: 'Erişim Reddedildi',
        reason: 'Bu kaynağa erişim izniniz bulunmamaktadır.',
      };
    },
    '404': () => ({
      title: 'Bulunamadı.',
      reason: 'İstenilen kaynak, uzak sunucuda bulunamadı.',
    }),
    '405': () => ({
      title: 'Yöntem İzin Verilmiyor',
      reason: 'Bu kaynak için kullanılan HTTP yöntemi desteklenmiyor.',
    }),
    '406': () => ({
      title: 'Kabul Edilemez',
      reason: 'Sunucu, isteği kabul edemiyor.',
    }),
    '407': () => ({
      title: 'Proxy Kimlik Doğrulaması Gerekli',
      reason: 'Proxy kimlik doğrulaması gerekmektedir.',
    }),
    '408': () => ({
      title: 'İstek Zaman Aşımı',
      reason: 'Sunucu, isteğe zamanında yanıt veremedi.',
    }),
    '409': () => ({
      title: 'Çakışma',
      reason: 'İşlem sırasında bir çakışma oluştu.',
    }),
    '410': () => ({
      title: 'Artık Kullanılamıyor',
      reason: 'İstenilen kaynak artık sunucuda mevcut değil.',
    }),
    '411': () => ({
      title: 'Uzunluk Gerekli',
      reason: 'İstek için Content-Length başlığı gereklidir.',
    }),
    '412': () => ({
      title: 'Önkoşul Başarısız',
      reason: 'İsteğin önkoşullarından biri başarısız oldu.',
    }),
    '413': () => ({
      title: 'İstek Varlığı Çok Büyük',
      reason: 'İstek, sunucunun işleyebileceğinden daha büyük.',
    }),
    '414': () => ({
      title: 'URI Çok Uzun',
      reason: "İstek URI'sı sunucu tarafından işlenemeyecek kadar uzun.",
    }),
    '415': () => ({
      title: 'Desteklenmeyen Medya Türü',
      reason: 'İstek, sunucu tarafından desteklenmeyen bir medya türüne sahip.',
    }),
    '416': () => ({
      title: 'Aralık Dışı İstek',
      reason: 'İstenen aralık, kaynağın dışında.',
    }),
    '417': () => ({
      title: 'Beklenti Başarısız',
      reason: 'Sunucu, istekteki Expect başlığını karşılayamıyor.',
    }),
    '418': () => ({
      title: 'Ben bir demlik değilim',
      reason: 'Sunucu, kendisinin bir çaydanlık olmadığını belirtiyor.',
    }),
    '421': () => ({
      title: 'Yanlış Yönlendirilmiş İstek',
      reason: 'İstek, yanlış bir sunucuya yönlendirildi.',
    }),
    '422': () => ({
      title: 'Doğrulama Hatası',
      reason: 'Gönderilen verilerde doğrulama hatası oluştu.',
    }),
    '423': () => ({
      title: 'Kilitli',
      reason: 'Kaynak kilitli olduğu için işlenemiyor.',
    }),
    '424': () => ({
      title: 'Bağımlılık Başarısız',
      reason: 'Gerekli bir bağımlılık başarısız oldu.',
    }),
    '425': () => ({
      title: 'Çok Erken',
      reason: 'İstek çok erken gönderildi.',
    }),
    '426': () => ({
      title: 'Yükseltme Gerekli',
      reason: 'Bu kaynağa erişmek için farklı bir protokol gereklidir.',
    }),
    '428': () => ({
      title: 'Önkoşul Gerekli',
      reason: 'İstek için önkoşul başlığı gereklidir.',
    }),
    '429': () => ({
      title: 'Çok Fazla İstek',
      reason: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyiniz.',
    }),
    '431': () => ({
      title: 'Başlık Alanı Çok Büyük',
      reason: 'İstek başlık alanı sunucu tarafından işlenemeyecek kadar büyük.',
    }),
    '451': () => ({
      title: 'Yasal Nedenlerle Kullanılamıyor',
      reason: 'İçerik yasal nedenlerle kullanılamıyor.',
    }),
    '500': () => ({
      title: 'Sunucu Hatası',
      reason: 'Sunucuda beklenmeyen bir hata oluştu.',
    }),
    '501': () => ({
      title: 'Uygulanmamış',
      reason: 'Sunucu, bu isteği yerine getirecek işlevselliğe sahip değil.',
    }),
    '502': () => ({
      title: 'Geçersiz Ağ Geçidi',
      reason: 'Sunucu, geçersiz bir yanıt aldı.',
    }),
    '503': () => ({
      title: 'Hizmet Kullanılamıyor',
      reason:
        'Sunucu şu anda hizmet veremiyor, lütfen daha sonra tekrar deneyiniz.',
    }),
    '504': () => ({
      title: 'Ağ Geçidi Zaman Aşımı',
      reason: 'Sunucu, zamanında yanıt alamadı.',
    }),
    '505': () => ({
      title: 'HTTP Sürümü Desteklenmiyor',
      reason: 'Sunucu, istek için kullanılan HTTP sürümünü desteklemiyor.',
    }),
    '506': () => ({
      title: 'Varyant Da Müzakere Ediyor',
      reason: 'Sunucu, isteği işleyemiyor.',
    }),
    '507': () => ({
      title: 'Yetersiz Depolama',
      reason: 'Sunucuda isteği tamamlamak için yeterli depolama alanı yok.',
    }),
    '508': () => ({
      title: 'Döngü Algılandı',
      reason: 'Sunucu, isteği işlerken bir döngü algıladı.',
    }),
    '510': () => ({
      title: 'Uzantı Gerekli',
      reason: 'İstek için ek uzantılar gereklidir.',
    }),
    '511': () => ({
      title: 'Ağ Kimlik Doğrulaması Gerekli',
      reason: 'Ağa erişmek için kimlik doğrulaması gereklidir.',
    }),
  };

  const computedSettings: LocaleSettings = { trusted: true, ...settings };
  const overridedErrors = { ...errors, ...computedSettings?.locales };
  const locale = findLocale(
    err,
    computedSettings.trusted
      ? 'trusted'
      : err.response
      ? err.response.status + ''
      : 'noInternet',
    overridedErrors,
    computedSettings
  );
  if (!locale) return;
  toast(locale.title, {
    description: locale.reason,
  });
  return;
}
