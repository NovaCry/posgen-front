<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Banknote,
  Users,
  Minus,
  Plus,
  Split,
} from 'lucide-vue-next';
import { computed, watch } from 'vue';

interface Props {
  splitPayment: boolean;
  numberOfPeople: number;
  splitMode: 'equal' | 'custom';
  customSplitAmounts: number[];
  splitPaymentMethods: Array<'cash' | 'card'>;
  finalPrice: number;
}

interface Emits {
  (e: 'update:splitPayment', value: boolean): void;
  (e: 'update:numberOfPeople', value: number): void;
  (e: 'update:splitMode', value: 'equal' | 'custom'): void;
  (e: 'update:customSplitAmounts', value: number[]): void;
  (e: 'update:splitPaymentMethods', value: Array<'cash' | 'card'>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const splitAmounts = computed(() => {
  if (!props.splitPayment) return [];

  if (props.splitMode === 'equal') {
    const equalAmount =
      Math.round((props.finalPrice / props.numberOfPeople) * 100) / 100;
    const amounts = Array(props.numberOfPeople).fill(equalAmount);

    const totalSplit = amounts.reduce((sum, amount) => sum + amount, 0);
    const difference = Math.round((props.finalPrice - totalSplit) * 100) / 100;
    if (difference !== 0) {
      amounts[amounts.length - 1] += difference;
    }

    return amounts;
  } else {
    return props.customSplitAmounts.slice(0, props.numberOfPeople);
  }
});

const totalSplitAmount = computed(() => {
  return splitAmounts.value.reduce((sum, amount) => sum + amount, 0);
});

const splitDifference = computed(() => {
  return Math.round((props.finalPrice - totalSplitAmount.value) * 100) / 100;
});

watch(
  () => props.splitPayment,
  (newValue) => {
    if (newValue) {
      initializeSplitPayment();
    }
  }
);

watch(
  () => props.numberOfPeople,
  () => {
    if (props.splitPayment) {
      initializeSplitPayment();
    }
  }
);

watch(
  () => props.splitMode,
  (newMode) => {
    if (props.splitPayment && newMode === 'custom') {
      initializeSplitPayment();
    }
  }
);

function initializeSplitPayment() {
  emit('update:splitPaymentMethods', Array(props.numberOfPeople).fill('cash'));
  const equalAmount = Math.max(
    0,
    Math.round((props.finalPrice / props.numberOfPeople) * 100) / 100
  );
  emit(
    'update:customSplitAmounts',
    Array(props.numberOfPeople).fill(equalAmount)
  );
}

function toggleSplitPayment() {
  emit('update:splitPayment', !props.splitPayment);
}

function updateNumberOfPeople(increment: boolean) {
  if (increment && props.numberOfPeople < 6) {
    emit('update:numberOfPeople', props.numberOfPeople + 1);
  } else if (!increment && props.numberOfPeople > 2) {
    emit('update:numberOfPeople', props.numberOfPeople - 1);
  }
}

function updateCustomAmount(index: number, event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  const amount = Math.max(0, parseFloat(value) || 0);
  const newAmounts = [...props.customSplitAmounts];
  newAmounts[index] = Math.round(amount * 100) / 100;
  emit('update:customSplitAmounts', newAmounts);
}

function updatePaymentMethod(index: number, method: 'cash' | 'card') {
  const newMethods = [...props.splitPaymentMethods];
  newMethods[index] = method;
  emit('update:splitPaymentMethods', newMethods);
}

function handleKeyDown(event: KeyboardEvent) {
  if (
    event.key === '-' ||
    event.key === 'e' ||
    event.key === 'E' ||
    event.key === '+'
  ) {
    event.preventDefault();
  }
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.stopPropagation();
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between p-3 border rounded-lg">
      <div class="flex items-center gap-2">
        <Split class="size-4 text-blue-600" />
        <span class="text-sm font-medium">Hesabı Böl</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        :class="
          splitPayment ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : ''
        "
        @click="toggleSplitPayment"
      >
        {{ splitPayment ? 'Aktif' : 'Pasif' }}
      </Button>
    </div>

    <div
      v-if="splitPayment"
      class="space-y-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">Kişi Sayısı:</span>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8"
            :disabled="numberOfPeople <= 2"
            @click="updateNumberOfPeople(false)"
          >
            <Minus class="h-3 w-3" />
          </Button>
          <Badge variant="secondary" class="min-w-[2rem] justify-center">
            {{ numberOfPeople }}
          </Badge>
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8"
            :disabled="numberOfPeople >= 6"
            @click="updateNumberOfPeople(true)"
          >
            <Plus class="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div class="space-y-3">
        <Label class="text-sm font-medium">Bölünme Şekli:</Label>

        <div
          class="flex items-center space-x-3 cursor-pointer"
          @click="emit('update:splitMode', 'equal')"
        >
          <div class="relative flex items-center justify-center">
            <div
              class="w-5 h-5 border-2 rounded-full transition-all duration-200"
              :class="
                splitMode === 'equal' ? 'border-blue-600' : 'border-gray-300'
              "
            />
            <div
              v-if="splitMode === 'equal'"
              class="absolute w-3 h-3 bg-blue-600 rounded-full transition-all duration-200"
            />
          </div>
          <span class="text-sm cursor-pointer">Eşit Bölünme</span>
        </div>

        <div
          class="flex items-center space-x-3 cursor-pointer"
          @click="emit('update:splitMode', 'custom')"
        >
          <div class="relative flex items-center justify-center">
            <div
              class="w-5 h-5 border-2 rounded-full transition-all duration-200"
              :class="
                splitMode === 'custom' ? 'border-blue-600' : 'border-gray-300'
              "
            />
            <div
              v-if="splitMode === 'custom'"
              class="absolute w-3 h-3 bg-blue-600 rounded-full transition-all duration-200"
            />
          </div>
          <span class="text-sm cursor-pointer">Özel Tutarlar</span>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="(amount, index) in splitAmounts"
          :key="index"
          class="p-3 bg-white dark:bg-slate-900 rounded-lg border space-y-3"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium flex items-center gap-2">
              <Users class="size-3" />
              Kişi {{ index + 1 }}
            </span>
            <Badge variant="outline"> {{ amount.toLocaleString() }}₺ </Badge>
          </div>

          <div v-if="splitMode === 'custom'" class="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              :model-value="customSplitAmounts[index]"
              class="h-10 text-sm flex-1"
              placeholder="Tutar"
              @input="updateCustomAmount(index, $event)"
              @keydown="handleKeyDown"
            />
            <span class="text-sm text-muted-foreground">₺</span>
          </div>

          <div class="flex gap-2 w-full">
            <div
              class="flex-1 p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50"
              :class="
                splitPaymentMethods[index] === 'cash'
                  ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800'
                  : 'border-gray-200'
              "
              @click="updatePaymentMethod(index, 'cash')"
            >
              <div class="flex items-center justify-center gap-2">
                <Banknote class="size-4" />
                <span class="text-sm font-medium">Nakit</span>
              </div>
            </div>
            <div
              class="flex-1 p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50"
              :class="
                splitPaymentMethods[index] === 'card'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800'
                  : 'border-gray-200'
              "
              @click="updatePaymentMethod(index, 'card')"
            >
              <div class="flex items-center justify-center gap-2">
                <CreditCard class="size-4" />
                <span class="text-sm font-medium">Kart</span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="splitMode === 'custom'"
          class="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800"
        >
          <div class="flex justify-between text-sm">
            <span>Toplam Bölünme:</span>
            <span class="font-medium"
              >{{ totalSplitAmount.toLocaleString() }}₺</span
            >
          </div>
          <div
            v-if="Math.abs(splitDifference) > 0.01"
            class="flex justify-between text-sm text-yellow-700 dark:text-yellow-300"
          >
            <span>Fark:</span>
            <span class="font-medium"
              >{{ splitDifference > 0 ? '+' : ''
              }}{{ splitDifference.toLocaleString() }}₺</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
