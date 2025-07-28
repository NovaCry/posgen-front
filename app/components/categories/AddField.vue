<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Field, FieldType } from '@/types/Field';
import { Plus } from 'lucide-vue-next';
import { ref, watch, watchEffect } from 'vue';
import { toast } from 'vue-sonner';
import { z } from 'zod';

const fieldTypeLocaleMap = {
  string: 'Karakter Dizesi',
  int: 'Tam Sayı',
  float: 'Ondalıklı Sayı',
  boolean: 'Mantıksal',
};

const fieldTypes: FieldType[] = ['string', 'int', 'float', 'boolean'];

const props = defineProps<{
  fields?: Field[];
  disabled?: boolean;
}>();

const emit = defineEmits(['update:fields']);

const fieldsReference = ref<Array<Field>>(props.fields || []);

watchEffect(() => {
  if (props.fields) fieldsReference.value = props.fields;
});

watch(fieldsReference, (n) => {
  emit('update:fields', n);
});

const FieldNameRef = ref('');
const FieldTypeRef = ref('');

const schema = z.object({
  name: z.custom<string>((val) => {
    return fieldsReference.value.find((f) => {
      return f.name == val;
    })
      ? false
      : true;
  }),
  type: z.custom<string>((val) => {
    return typeof val === 'string'
      ? fieldTypes.includes(val as FieldType)
      : false;
  }),
});

function CreateField() {
  console.log(FieldNameRef.value, FieldTypeRef.value);
  if (FieldNameRef.value == '' || FieldTypeRef.value == '') {
    return toast('Özellik Eklenemedi', {
      description: 'Özellik bilgilerini giriniz lütfen.',
      cancel: {
        label: 'Kapat',
      },
      cancelButtonStyle: {
        border: '1px',
      },
    });
  }
  // Type Check
  let result: undefined | Field;
  try {
    result = schema.parse({
      name: FieldNameRef.value,
      type: FieldTypeRef.value,
    }) as Field;
    fieldsReference.value.push(result);
  } catch (e) {
    if (e) {
      toast('Özellik Eklenemedi', {
        description: 'Özellik zaten eklendiğinden dolayı eklenemedi.',
        cancel: {
          label: 'Kapat',
        },
        cancelButtonStyle: {
          border: '1px',
        },
      });
    }
  }

  toast('Özellik Eklendi', {
    description: `'${FieldNameRef.value}' özelliği başarıyla eklendi.`,
    cancel: {
      label: 'Kapat',
    },
    cancelButtonStyle: {
      border: '1px',
    },
  });

  FieldNameRef.value = '';
  FieldTypeRef.value = '';
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button :disabled="disabled">
        Yeni Değişken
        <Plus />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Yeni Özellik</DialogTitle>
        <DialogDescription>
          Eklenen özellikler ürünlerde düzenlenebilir.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Özellik </Label>
          <Input
            id="name"
            v-model="FieldNameRef"
            class="col-span-3"
            placeholder="Özellik Adını Giriniz."
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="type" class="text-right"> Tür </Label>
          <Select v-model="FieldTypeRef">
            <SelectTrigger class="col-span-3">
              <SelectValue id="type" placeholder="Özellik Türünü Seçiniz." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Değer Türleri</SelectLabel>
                <SelectItem v-for="t of fieldTypes" :key="t" :value="t">
                  {{ fieldTypeLocaleMap[t] }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="submit" @click="CreateField"> Save changes </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
