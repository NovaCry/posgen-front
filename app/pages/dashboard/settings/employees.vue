<script setup lang="ts">
import SeoMeta from '@/components/seo/SeoMeta.vue';
import { ref, reactive, onMounted } from 'vue';
import DataTable from '@/components/DataTable.vue';
import PaginationSimplified from '@/components/PaginationSimplified.vue';
import { toLocaleDate } from '@/lib/toLocaleDate';
import type { Cell, TableData } from '@/types/DataTable';
import { Ban, Edit, History, Plus, Delete, ArrowRight } from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Section from '@/components/layout/Section.vue';
import DatePicker from '@/components/calendar/DatePicker.vue';
import createProtectedApiInterface from '@/api/protected';
import { toast } from 'vue-sonner';
import { useSelectedShopStore } from '@/store/shop';

const router = useRouter();

definePageMeta({
  name: 'Çalışanlar',
});

const selectedShop = useSelectedShopStore();
const user = useUser();
const protectedApiInterface = createProtectedApiInterface();

// Load shop data
onMounted(async () => {
  await selectedShop.load();
  if (selectedShop.id === '') {
    if (
      !user.data.value ||
      !user.data.value.shops ||
      user.data.value.shops.length < 0 ||
      !user.data.value.shops[0]
    )
      return router.push('/create');
    selectedShop.$state = user.data.value.shops[0];
    await selectedShop.save();
  }
  // Only fetch employees after shop is loaded
  await fetchEmployees();
});

const open = ref(false);
const newEmployee = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  bornDate: new Date(),
  rol: 'Depo Sorumlusu',
});

const Processing = ref(false);
const ApiMessage = ref('');

const getActionsMenu = (): Cell => {
  return {
    type: 'menu',
    data: [
      {
        type: 'group',
        title: 'İşlemler',
        items: [
          {
            type: 'item',
            text: 'İşlem Geçmişi',
            icon: History,
            action() {
              console.log('İşlem Geçmişi');
            },
          },
          {
            type: 'item',
            text: 'Düzenle',
            icon: Edit,
            action() {
              console.log('Düzenle');
            },
          },
          {
            type: 'item',
            text: 'Askıya Al',
            icon: Ban,
            action() {
              console.log('Askıya Al');
            },
          },
          {
            type: 'item',
            text: 'Sil',
            icon: Delete,
            action() {
              console.log('Sil');
            },
          },
        ],
      },
    ],
  };
};

const data = ref<TableData[]>([]);

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

const fetchEmployees = async () => {
  if (!selectedShop.id) {
    console.error('No shop selected');
    return;
  }

  try {
    const response = await protectedApiInterface({
      url: `shop/employee/${selectedShop.id}/list`,
      method: 'GET',
    });

    if (response) {
      // Transform employees data for the table
      data.value = response.data.employees.map((employee: Employee) => ({
        Profil: [
          {
            type: 'image',
            alt: `${employee.firstName.charAt(0)}${employee.lastName.charAt(
              0
            )}`,
            uri: '',
          },
        ],
        Ad: [
          {
            type: 'text',
            data: employee.firstName,
          },
        ],
        Soyad: [
          {
            type: 'text',
            data: employee.lastName,
          },
        ],
        Email: [
          {
            type: 'text',
            data: employee.email,
          },
        ],
        Telefon: [
          {
            type: 'text',
            data: '',
          },
        ],
        Rol: [
          {
            type: 'badge',
            background: '#e2f0fd',
            color: '#0369a1',
            data: 'Çalışan',
          },
        ],
        'Katılma Tarihi': [
          {
            type: 'text',
            data: toLocaleDate(new Date(employee.createdAt)),
          },
        ],
        İşlemler: [getActionsMenu()],
      }));
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    toast.error('Çalışanlar listelenirken bir hata oluştu.');
  }
};

const addEmployee = async () => {
  if (!selectedShop.id) {
    console.error('No shop selected');
    return;
  }

  Processing.value = true;
  try {
    const response = await protectedApiInterface({
      url: `shop/employee/${selectedShop.id}/add`,
      method: 'POST',
      data: {
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        email: newEmployee.email,
        password: newEmployee.password,
        bornDate: newEmployee.bornDate,
      },
    });

    if (response) {
      // Refresh the employee list
      await fetchEmployees();

      toast.success('Çalışan başarıyla eklendi!');
      open.value = false;
      // Reset form
      Object.assign(newEmployee, {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        bornDate: new Date(),
        rol: 'Depo Sorumlusu',
      });
    }
  } catch (error) {
    ApiMessage.value = 'Çalışan eklenirken bir hata oluştu.';
    console.error(error);
  } finally {
    Processing.value = false;
  }
};
</script>

<template>
  <SeoMeta title="Çalışanlar" description="Çalışanlar" />
  <Section>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-semibold">Çalışanlar</h1>

      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button class="flex items-center gap-2">
            <Plus class="w-5 h-5" />
            <span>Yeni Çalışan Ekle</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Çalışan Ekle</DialogTitle>
            <DialogDescription>
              Yeni çalışan bilgilerini doldurun ve kaydedin.
            </DialogDescription>
          </DialogHeader>

          <form class="grid gap-4 py-4" @submit.prevent="addEmployee">
            <div class="flex flex-col md:flex-row gap-3 md:gap-4">
              <div class="flex flex-col gap-2 flex-1">
                <Label for="firstname">Ad</Label>
                <Input
                  id="firstname"
                  v-model="newEmployee.firstName"
                  :disabled="Processing"
                  type="text"
                  placeholder="örn. Eren"
                />
              </div>
              <div class="flex flex-col gap-2 flex-1">
                <Label for="lastname">Soyad</Label>
                <Input
                  id="lastname"
                  v-model="newEmployee.lastName"
                  :disabled="Processing"
                  type="text"
                  placeholder="örn. Kaplan"
                />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="email">E-Posta</Label>
              <Input
                id="email"
                v-model="newEmployee.email"
                :disabled="Processing"
                type="email"
                placeholder="örn. erenkaplan@sirket.org"
              />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="pass">Şifre</Label>
              <Input
                id="pass"
                v-model="newEmployee.password"
                :disabled="Processing"
                type="password"
                placeholder="• • • • • • •"
              />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="bornDate" class="flex w-full">Doğum Tarihi</Label>
              <DatePicker
                v-model="newEmployee.bornDate"
                :disabled="Processing"
                rule="birthday"
              />
            </div>
            <span
              v-if="ApiMessage != ''"
              class="text-sm text-center text-red-600"
              >{{ ApiMessage }}</span
            >
            <Button
              class="w-fit ml-auto"
              :disabled="Processing"
              @click="addEmployee"
            >
              <Icon
                v-if="Processing"
                name="lucide:loader-circle"
                class="animate-spin duration-1000"
              />
              Çalışan Ekle
              <ArrowRight class="ml-auto" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <DataTable :data="data" class="mt-6" />
    <PaginationSimplified
      class="my-4 w-full flex justify-center"
      :model-value="5"
      :total-items="100"
    />
  </Section>
</template>
