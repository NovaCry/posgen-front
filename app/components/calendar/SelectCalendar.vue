<script setup lang="ts">
import { cn } from '@/lib/utils'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
} from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date'
import { useVModel } from '@vueuse/core'
import {
  CalendarRoot,
  type CalendarRootEmits,
  type CalendarRootProps,
  useDateFormatter,
  useForwardPropsEmits,
} from 'reka-ui'
import { createYear, toDate } from 'reka-ui/date'
import { computed, type HTMLAttributes, type Ref } from 'vue'

const eighteenYearsAgo = today(getLocalTimeZone()).subtract({ years: 18 });
const minDate = today(getLocalTimeZone()).subtract({ years: 85 });

const emits = defineEmits<CalendarRootEmits>()
const props = withDefaults(
  defineProps<
    CalendarRootProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    weekdayFormat: 'short',
    class: '',
  }
)

const placeholder = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: eighteenYearsAgo,
}) as Ref<DateValue>;

const delegatedProps = computed(() => {
  const { class: unusedClass, ...delegated } = props;
  void unusedClass;
  return {
    ...delegated,
    maxValue: eighteenYearsAgo,
    minValue: minDate,
  };
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
const formatter = useDateFormatter('tr-TR');

const availableYears = computed(() => {
  const currentYear = today(getLocalTimeZone()).year;
  const maxYear = currentYear - 18;
  const minYear = currentYear - 85;

  const years: DateValue[] = [];
  for (let year = maxYear; year >= minYear; year--) {
    try {
      const yearDate = placeholder.value.set({ year });
      if (yearDate.year >= minYear && yearDate.year <= maxYear) {
        years.push(yearDate);
      }
    } catch {
      continue;
    }
  }

  return years;
})

const availableMonths = computed(() => {
  return createYear({ dateObj: placeholder.value })
})

function updateMonth(value: unknown) {
  if (value == null) return;
  const month = Number(value);
  if (isNaN(month) || month === placeholder.value.month) return;

  try {
    let newDate = placeholder.value.set({ month });

    if (newDate.compare(eighteenYearsAgo) > 0) {
      newDate = eighteenYearsAgo;
    }
    if (newDate.compare(minDate) < 0) {
      newDate = minDate;
    }

    placeholder.value = newDate;
  } catch (error) {
    console.warn('Ay güncellenirken hata:', error);
  }
}

function updateYear(value: unknown) {
  if (value == null) return;
  const year = Number(value);
  if (isNaN(year) || year === placeholder.value.year) return;

  const currentYear = today(getLocalTimeZone()).year;
  const maxYear = currentYear - 18;
  const minYear = currentYear - 85;

  if (year < minYear || year > maxYear) {
    return;
  }

  try {
    let newDate = placeholder.value.set({ year });

    if (newDate.compare(eighteenYearsAgo) > 0) {
      newDate = eighteenYearsAgo;
    }
    if (newDate.compare(minDate) < 0) {
      newDate = minDate;
    }

    placeholder.value = newDate;
  } catch (error) {
    console.warn('Yıl güncellenirken hata:', error);
  }
}
</script>

<template>
  <CalendarRoot
v-slot="{ grid, weekDays }" v-bind="forwarded" v-model:placeholder="placeholder" locale="tr-TR"
    :class="cn('rounded-md border p-3', props.class)">
    <CalendarHeader>
      <CalendarHeading class="flex w-full items-center justify-between gap-2">
        <Select :model-value="placeholder.month.toString()" @update:model-value="updateMonth">
          <SelectTrigger aria-label="Ay seçin" class="w-[60%]">
            <SelectValue placeholder="Ay seçin" />
          </SelectTrigger>
          <SelectContent class="max-h-[200px]">
            <SelectItem v-for="month in availableMonths" :key="month.toString()" :value="month.month.toString()">
              {{ formatter.custom(toDate(month), { month: 'long' }) }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select :model-value="placeholder.year.toString()" @update:model-value="updateYear">
          <SelectTrigger aria-label="Yıl seçin" class="w-[40%]">
            <SelectValue placeholder="Yıl seçin" />
          </SelectTrigger>
          <SelectContent class="max-h-[200px]">
            <SelectItem
v-for="yearValue in availableYears" :key="yearValue.toString()"
              :value="yearValue.year.toString()">
              {{ yearValue.year }}
            </SelectItem>
          </SelectContent>
        </Select>
      </CalendarHeading>
    </CalendarHeader>
    <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody class="grid">
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
              <CalendarCellTrigger :day="weekDate" :month="month.value" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>