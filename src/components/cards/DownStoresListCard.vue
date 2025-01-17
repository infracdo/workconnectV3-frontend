<template>
  <q-card
        dark
        bordered
        class="bg-primary my-card"
      >

      <div class="q-pa-md">
        <!-- Table -->
        <DownStoresListTable />
      </div>
    </q-card>
</template>

<script setup>
import DownStoresListTable from '../tables/DownStoresListTable.vue';
</script>
