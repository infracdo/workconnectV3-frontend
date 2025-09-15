<template>
  <q-page>
    <router-view></router-view>

    <div v-if="route.name === 'Stores'" class="q-pa-md">
      <!-- <q-btn @click="refreshTable">Refresh</q-btn> -->
      <!-- <table-store-details
        title="Store Summary"
        :rows="rows"
        :close-btn="false"
        :refresh="refreshTable"
      ></table-store-details> -->
      <table-circuit-loop
        title="Store Summary Circuits"
        :rows="rowsCircuit"
        :close-btn="false"
        :refresh="refreshTable"
        :loopback-val="'uptime'"
      >
      </table-circuit-loop>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { QTableProps } from "quasar";
import {
  getAllStoreData,
  getStoreProfile,
  getStoreProfileAdditional,
  getDetailsList,
  getZabbixCircuitReport,
} from "src/api/api";
import {
  IstoreProfile,
  IdetailsListData,
  ICircuitLoops,
} from "src/api/types";
import { getLoopbackStatus } from "src/api/testApi";
import { useSiteStore } from "src/stores/sites/stores";
import TableStoreDetails from "src/components/tables/TableStoreDetails.vue";
import TableCircuitLoop from "src/components/tables/TableCircuitLoop.vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import TableZabbix from "src/components/tables/TableZabbix.vue";

const $q = useQuasar();
const store = useSiteStore();
const router = useRouter();
const route = useRoute();

const searchStoreId = ref("");
const showTable = ref(false);

const rows = ref<IdetailsListData[]>([]);
const rowsCircuit = ref<ICircuitLoops[]>([]);

const refreshTable = async () => {
  rowsCircuit.value = [];
  store.$state.storeCircuitRow = await getDetailsList(
    "store_info_circuits_loop"
  );
  rowsCircuit.value = store.$state.storeCircuitRow;
};

onMounted(async () => {
  if (!store.$state.storeCircuitRow.length) {
    await refreshTable();
  } else {
    rowsCircuit.value = store.$state.storeCircuitRow;
  }
});
</script>

<style scoped>
.q-tr:hover {
  background-color: rgb(25, 28, 36, 0.1);
  cursor: pointer;
}
.q-tr:active {
  color: red;
}
</style>
