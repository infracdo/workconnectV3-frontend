<template>
  <q-page padding>
    <!-- Stores Card -->
    <div class="q-mb-md">
      <StoresCard />
    </div>

    <!-- Down Stores Card -->
    <div class="q-mb-md">
      <DownStoresCard />
    </div>

    <!-- Down Stores List Card -->
    <div>
      <DownStoresListCard />
    </div>
  </q-page>
</template>

<script setup>
import StoresCard from 'src/components/cards/StoresCard.vue';
import DownStoresCard from 'src/components/cards/DownStoresCard.vue';
import DownStoresListCard from 'src/components/cards/DownStoresListCard.vue';
</script>
