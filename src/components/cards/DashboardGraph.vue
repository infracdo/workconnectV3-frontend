<template>
  <q-card class="q-mb-md" flat>
    <q-card-section class="">
      <q-item-label class="text-h6 q-mb-sm">
        <span> {{ title }}</span>
        <q-space />
        <q-separator />
      </q-item-label>
      <q-select
        :options="timeOptions"
        v-model="timeSelected"
        map-options
        emit-value
        dense
        style="max-width: 300px"
        class="q-pr-sm q-pb-sm"
        outlined
      ></q-select>
      <q-card class="iframe-card">
        <div class="history-graph-container" v-if="true" :key="iframeKey">
          <iframe :src="generateUrl()" frameborder="200"></iframe>
        </div>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  title: string;
  iframeKey: number;
}>();
const timeSelected = ref("1d");
const timeOptions = [
  { label: "Last 5 minutes", value: "5m" },
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 30 minutes", value: "30m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 3 hours", value: "3h" },
  { label: "Last 6 hours", value: "6h" },
  { label: "Last 12 hours", value: "12h" },
  { label: "Last 24 hours", value: "1d" },
  { label: "Last 2 days", value: "2d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 15 days", value: "15d" },
  { label: "Last 30 days", value: "1M" },
  { label: "Last 3 months", value: "3M" },
  { label: "Last 6 months", value: "6M" },
  { label: "Last 9 months", value: "9M" },
  { label: "Last 1 years", value: "1y" },
  { label: "Last 2 years", value: "2y" },
];
// GRAFANA  ------------------------------------------------

const generateUrl = () => {
  // return `https://grafana.apolloglobal.net/d-solo/h2GD6-DIk/store-count-history?orgId=1&from=now-${timeSelected.value}&to=now&panelId=4&theme=${theme.value}`;
  return `https://grafana.apolloglobal.net/d-solo/F1G-z3G7k/psc-vpn?orgId=1&from=now-${timeSelected.value}&to=now&panelId=2078&theme=${theme.value}`;
};
const theme = ref("light");

// GRAFANA  ------------------------------------------------
</script>
<style scoped>
.iframe-card {
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Ensure the card takes the full height */
  box-shadow: none !important;
}
.history-graph-container {
  max-width: 100%;
  width: 100%;
}
.history-graph-container > iframe {
  width: 100%;
  max-width: 11000px; /* Adjust the max-width as needed */
  height: 180px; /* Adjust the height as needed */
}
.q-card {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}
.child-container {
  border-radius: 5px;
}
.child-container-list {
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}
.child-container-list:hover {
  cursor: pointer;
  transform: scale(1.05);
}
.child-container-list:active {
  box-shadow: rgba(0, 0, 0, 0.16) 0 3px 7px inset;
  transform: translateY(2px);
}
.q-dialog .q-card {
  width: 100%;
  max-width: 1200px;
}

.q-card-section-align {
  display: flex;
  align-items: center;
}
</style>
