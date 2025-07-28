<script setup lang="ts">
import { Button } from '@/components/ui/button';

import { subYears } from 'date-fns';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import type { PropType } from 'vue';
import { RangeCalendar } from '../ui/range-calendar';

const df = new DateFormatter('tr-TR', {
  dateStyle: 'long',
});

const value = ref<DateValue>();

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Tarih aralığı seçiniz...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rule: {
    default: 'future',
    type: String as PropType<'birthday' | 'past' | 'future'>,
  },
  modelValue: {
    default: new Date(),
    type: Date,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

function update(val: DateValue) {
  emit('update:modelValue', val.toDate(getLocalTimeZone()));
}

watch(value, (va) => {
  if (!va) return;
  update(va);
});

const dateMin = ref<CalendarDate>(new CalendarDate(1900, 1, 1));
const dateMax = ref<CalendarDate>(new CalendarDate(2100, 1, 1));

if (props.rule == 'birthday') {
  const d = subYears(new Date(), 18);
  dateMax.value = new CalendarDate(d.getFullYear(), d.getMonth(), d.getDate());
}
if (props.rule == 'future') {
  dateMin.value = today(getLocalTimeZone());
}
if (props.rule == 'past') {
  dateMax.value = today(getLocalTimeZone());
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        :disabled="disabled"
        variant="outline"
        :class="
          cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ value ? df.format(value.toDate(getLocalTimeZone())) : placeholder }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar
        :min-value="dateMin as CalendarDate"
        :max-value="dateMax as CalendarDate"
        initial-focus
      />
    </PopoverContent>
  </Popover>
</template>
