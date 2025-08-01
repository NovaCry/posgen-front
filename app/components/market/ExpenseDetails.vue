<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
</script>

<template>
  <div class="mt-4 border rounded-xl overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[200px]"> Ücretlendirme </TableHead>
          <TableHead>Miktar/Oran</TableHead>
          <TableHead class="text-right"> Net </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell class="font-medium"> Sepet Toplamı </TableCell>
          <TableCell class="text-green-400"> +$250.00 </TableCell>
          <TableCell class="text-right text-green-400"> $250.00 </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium"> KDV </TableCell>
          <TableCell class="text-green-400"> +$2.50 </TableCell>
          <TableCell class="text-right text-green-400"> $252.50 </TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium"> Kredi Kartı </TableCell>
          <TableCell class="text-red-400"> -$252.50 </TableCell>
          <TableCell class="text-right text-red-400"> $0.00 </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
