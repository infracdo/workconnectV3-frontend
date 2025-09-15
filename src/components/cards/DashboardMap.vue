<template>
  <q-card class="q-mb-md" flat>
    <q-card-section class="">
      <q-item-label class="text-h6 q-mb-sm">
        <span> {{ title }}</span>
        <q-space />
        <q-separator />
      </q-item-label>
      <q-card style="max-width: 1920px; margin: 0 auto">
        <div :key="refreshKey">
          <div id="map-down" style="height: 600px"></div>
        </div>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import L from "leaflet";
import { IMapStoreData } from "src/api/types.js";

import redPin from "/red-pin2.png";
import softYellowPin from "/softestyellow-pin.png";
import yellowPin from "/oneday-yellow-pin.png";
import darkRedPin from "/carmine-pin.png";
import orangePin from "/darkOrange-pin.png";

const props = defineProps<{
  title: string;
  refreshKey: number;
  rows: IMapStoreData[];
}>();

let loadTimeout: number | null = null;
let map: L.Map | null = null;
let markers: L.LayerGroup | null = null;

const icons = {
  yellow: L.icon({
    iconUrl: yellowPin,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  orange: L.icon({
    iconUrl: orangePin,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  red: L.icon({ iconUrl: redPin, iconSize: [25, 41], iconAnchor: [12, 41] }),
  darkRed: L.icon({
    iconUrl: darkRedPin,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  softYellow: L.icon({
    iconUrl: softYellowPin,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

const debouncedLoadMap = () => {
  if (loadTimeout) clearTimeout(loadTimeout);
  loadTimeout = window.setTimeout(() => {
    loadMap();
  }, 300);
};

const loadMap = () => {
  if (!map) {
    map = L.map("map-down").setView([12.988, 121.774], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    map.attributionControl.setPosition('bottomleft');
  }
  if (markers && map) {
    markers.clearLayers();
  } else if (map) {
    markers = L.layerGroup().addTo(map);
  }
  props.rows.forEach((row) => {
    if (
      row.latitude !== null &&
      row.longitude !== null &&
      row.latitude !== undefined &&
      row.longitude !== undefined &&
      row.latitude !== 0 &&
      row.longitude !== 0
    ) {
      const downTime = new Date(row.zabbix_down_duration).getTime();
      const now = Date.now();
      const diffDays = (now - downTime) / (1000 * 60 * 60 * 24);

      let icon = icons.softYellow;
      if (diffDays < 1) icon = icons.yellow;
      else if (diffDays < 3) icon = icons.orange;
      else if (diffDays < 7) icon = icons.red;
      else icon = icons.darkRed;

      L.marker([row.latitude, row.longitude], { icon })
        .addTo(markers!)
        .bindPopup(`<b>Site ID:</b> ${row.site_id}`);
    }
  });
};

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
    markers = null;
  }
});

onMounted(() => {
  nextTick(() => {
    debouncedLoadMap();
  });
});

watch(
  () => props.rows,
  (newRows) => {
    if (newRows && newRows.length > 0) {
      if (map) {
        map.remove();
        map = null;
        markers = null;
      }
      debouncedLoadMap();
      console.log("map refreshed via rows watcher");
    }
  },
  { immediate: true, deep: true }
);

</script>
<style scoped>
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
