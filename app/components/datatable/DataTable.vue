<script lang="ts" setup>
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import type { Cell, TableData } from '@/types/DataTable';
import { Badge } from '../ui/badge';
import { EllipsisVertical } from 'lucide-vue-next';

defineProps<{ data: TableData[] }>();
</script>

<template>
  <div class="border rounded-md">
    <Table v-if="data.length > 0">
      <TableHeader>
        <TableRow>
          <TableHead v-for="label of Object.keys(data[0])" :key="label">
            {{ label }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(row, dataIndex) of $props.data" :key="dataIndex">
          <TableCell
            v-for="(val, rowIndex) of Object.values(row)"
            :key="rowIndex"
          >
            <span v-if="typeof val == 'string'">{{ val }}</span>
            <div v-else class="flex items-center gap-2">
              <div v-for="cell of val as Cell[]" :key="cell.type">
                <div
                  v-if="cell.type == 'image-group'"
                  class="flex items-center"
                >
                  <Avatar
                    v-for="img of cell.data"
                    :key="img.uri"
                    class="size-8 border-2 border-background -ml-2"
                  >
                    <AvatarImage :src="img.uri" />
                    <AvatarFallback>{{ img.alt }}</AvatarFallback>
                  </Avatar>
                </div>
                <Avatar
                  v-if="cell.type == 'image'"
                  class="size-8 border-2 border-background"
                >
                  <AvatarImage :src="cell.uri" />
                  <AvatarFallback>{{ cell.alt }}</AvatarFallback>
                </Avatar>
                <span v-if="cell.type == 'text'">
                  {{ cell.data }}
                </span>
                <Badge
                  v-if="cell.type == 'badge'"
                  :class="`hover:bg-current hover:brightness-75`"
                  :style="`background: ${cell.background}; color: ${cell.color}; currentColor: ${cell.background};`"
                >
                  {{ cell.data }}
                </Badge>
                <DropdownMenu v-if="cell.type == 'menu'">
                  <DropdownMenuTrigger>
                    <Button size="icon" variant="outline">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup
                      v-for="group of cell.data"
                      :key="group.title"
                    >
                      <DropdownMenuLabel>{{ group.title }}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        v-for="item of group.items"
                        :key="item.text"
                        @click="item.action"
                      >
                        <component :is="item.icon" /> {{ item.text }}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <component
                  :is="cell.component"
                  v-if="cell.type == 'icon'"
                  class="size-8 p-1.5 rounded-lg border"
                />
                <Button
                  v-if="cell.type == 'button'"
                  :variant="cell.variant"
                  :size="cell.size"
                  @click="cell.action"
                >
                  {{ cell.text }}
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div v-else class="m-4 flex">
      <span class="mx-auto text-muted-foreground">Veri yok</span>
    </div>
  </div>
</template>
