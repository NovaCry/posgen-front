import { toast } from 'vue-sonner';

export default function WriteClipboard(value: string) {
  navigator.clipboard
    .writeText(value)
    .then(() => {
      toast.success('Kopyalandı', {
        description: `${value} panoya kopyalandı.`,
      });
    })
    .catch(() => {
      toast.error('Kopyalama başarısız', {
        description: 'Lütfen manuel olarak kopyalamayı deneyin.',
      });
    });
}
