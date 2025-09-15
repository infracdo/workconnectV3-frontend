<template>
  <q-btn icon="refresh" flat rounded unelevated class="floating-refresh" @click="refresh"
    >Refresh</q-btn>
  <q-page class="q-pa-sm container-width">
    <dashboard-graph
      title="Down Store Timeline"
      v-if="hasPermission(['GROUP_APOLLO_PROD_SUPPORT', 'GROUP_APOLLO_OPERATIONS'])"
      :iframeKey="iframeKey"
    />
    <dashboard-card-stores
      title="Stores"
      :prop_items="allStores"
      :iframeKey="iframeKey"
      :table-layout="'storeDetails'"
    />
    <q-card class="q-mb-md">
      <table-store-details
        :rows="rows"
        :title="`Down Stores List`"
        :closeBtn="false"
        :loopback-val="'duration'"
      ></table-store-details>
    </q-card>

    <!-- <q-toggle v-model="showHistory"> Show Down Stores History</q-toggle> -->
    <!-- <q-card style="max-width: 1920px; margin: 0 auto" 
        v-if="
          hasPermission([
            'GROUP_APOLLO_PROD_SUPPORT',
            'GROUP_APOLLO_OPERATIONS',
          ])
        ">
      <div id="map-down" style="height: 600px"></div>
    </q-card> -->

    <!-- <card-social
      title="Problematic Stores"
      :prop_items="problematicStores"
      :table-layout="'storeDetails'"
    /> -->

    <!-- <card-social
      title="Problematic Primary Circuits"
      :prop_items="primaryCircuit"
      :table-layout="'storeDetails'"
    />

    <card-social
      title="Problematic Backup Circuits"
      :prop_items="backupCircuit"
      :table-layout="'storeDetails'"
    />
    <card-social
      title="Store Connectivity"
      :prop_items="storeConnectivity"
      :table-layout="'storeDetails'"
    />
    <card-social
      title="Store Health Status"
      :prop_items="storeStatus"
      :table-layout="'storeDetails'"
    /> -->
    <!-- <div class="csv-buttons">
      <q-btn
        @click="extractDataCSV"
        color="primary"
        icon-right="archive"
        label="Export Inventory csv"
        no-caps
      />
      <q-btn
        @click="extractStoreCSV"
        color="primary"
        icon-right="archive"
        label="Export Store Data csv"
        no-caps
      />
    </div> -->
    <dashboard-map
      title="Down Store Map"
      v-if="hasPermission(['GROUP_APOLLO_PROD_SUPPORT', 'GROUP_APOLLO_OPERATIONS'])"
      :rows="initializeMap"
      :refreshKey="refreshKey"

    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { storeToRefs } from "pinia";
import TableDownCircuits from "src/components/tables/TableDownCircuits.vue";
import TableStoreDetails from "src/components/tables/TableStoreDetails.vue";
import {
  prometheusData,
  nmsData,
  extractCSV,
  extractStoreDataCSV,
  getAllStoreCounts,
  getDetailsList,
} from "src/api/api";
import CardSocial from "src/components/cards/CardSocial.vue";
import DashboardCardStores from "src/components/cards/DashboardCardStores.vue";
import DashboardGraph from "src/components/cards/DashboardGraph.vue";
import DashboardMap from "src/components/cards/DashboardMap.vue";
import { useSiteStore } from "src/stores/sites/stores";
import { useQuasar } from "quasar";
import { IcountAllStore, countTypes, IdetailsListData, IMapStoreData } from "src/api/types.js";

import { hasPermission } from "src/utils/helper";
const $q = useQuasar();

$q.loadingBar.setDefaults({
  color: "positive",
  size: "5px",
  position: "bottom",
});

let refreshInterval: number | undefined;
const iframeKey = ref(0);
const refreshKey = ref(0);
const store = useSiteStore();
const showHistory = ref(false);
const allStores = ref<countTypes[]>([]);
const totalDownStores = ref<countTypes[]>([]);
const totalZabbixDownStores = ref();
const problematicStores = ref<countTypes[]>([]);
const primaryCircuit = ref<countTypes[]>([]);
const backupCircuit = ref<countTypes[]>([]);
const circuit24hrs = ref<countTypes[]>([]);
const storeConnectivity = ref<countTypes[]>([]);
const storeStatus = ref<countTypes[]>([]);
// const downStoresPerProviders = ref<countTypes[]>([]);

const rows = ref<IdetailsListData[]>([]);

const getDownStores = async () => {
  rows.value = await getDetailsList("down_store");
};

const initializeMap = computed<IMapStoreData[]>(() =>
  rows.value.map((row) => ({
    site_id: row.site_id,
    latitude: row.latitude,
    longitude: row.longitude,
    zabbix_down_duration: row.zabbix_down_duration,
  }))
);

const setProblematicCircuits = async () => {
  if (Object.keys(store.$state.storeCounts).length === 0) {
    const count = await getAllStoreCounts();
    store.$state.storeCounts = count;
  }

  // totalZabbixDownStores.value = await getZabbixDownStores();
  // store.$state.storeCounts.totalZabbixDownStores = totalZabbixDownStores.value;

  if (hasPermission(["GROUP_APOLLO_PROD_SUPPORT", "GROUP_APOLLO_OPERATIONS"])) {
    allStores.value.push({
      title: "Total Stores",
      value: store.$state.storeCounts.totalStoresLP0,
      loopback: 0,
      bgColor: "bg-info",
      bigSize: true,
    });
    allStores.value.push({
      title: "Total Stores",
      value: store.$state.storeCounts.totalStoresLP1,
      loopback: 1,
      bgColor: "bg-info",
      bigSize: true,
    });
    allStores.value.push({
      title: "Total Stores",
      value: store.$state.storeCounts.totalStoresLP2,
      loopback: 2,
      bgColor: "bg-info",
      bigSize: true,
    });

    allStores.value.push({
      title: "Up Stores",
      value: store.$state.storeCounts.upStoresLP0,
      loopback: 0,
      bgColor: "bg-info",
      bigSize: true,
    });
    allStores.value.push({
      title: "Up Stores",
      value: store.$state.storeCounts.upStoresLP1,
      loopback: 1,
      bgColor: "bg-info",
      bigSize: true,
    });
    allStores.value.push({
      title: "Up Stores",
      value: store.$state.storeCounts.upStoresLP2,
      loopback: 2,
      bgColor: "bg-info",
      bigSize: true,
    });

    allStores.value.push({
      title: "Temporarily Closed",
      value: store.$state.storeCounts.temporarilyClosed,
      loopback: "all",
      bgColor: "bg-info",
      bigSize: true,
    });

    // allStores.value.push({
    //   title: "Mikrotik Stores",
    //   value: store.$state.storeCounts.totalMikrotikStores,
    //   bgColor: "bg-info",

    //   bigSize: true,
    // });

    // allStores.value.push({
    //   title: "Ruijie Stores",
    //   value: store.$state.storeCounts.totalRuijiStores,
    //   bgColor: "bg-info",

    //   bigSize: true,
    // });
    allStores.value.push({
      title: "Prometheus Down Stores",
      value: store.$state.storeCounts.downStoresLP0,
      loopback: 0,
      bgColor: "bg-negative",
      bigSize: true,
    });
    allStores.value.push({
      title: "Prometheus Down Stores",
      value: store.$state.storeCounts.downStoresLP1,
      loopback: 1,
      bgColor: "bg-negative",
      bigSize: true,
    });
    allStores.value.push({
      title: "Prometheus Down Stores",
      value: store.$state.storeCounts.downStoresLP2,
      loopback: 2,
      bgColor: "bg-negative",
      bigSize: true,
    });

    allStores.value.push({
      title: "Zabbix Down Stores",
      value: store.$state.storeCounts.zabbixDownStores,
      loopback: "all",
      bgColor: "bg-negative",
      bigSize: true,
    });
  }
  
  if (hasPermission(["GROUP_PSC_USERS"])) {
    allStores.value.push({
      title: "Total Stores",
      value: store.$state.storeCounts.totalStoresLP0,
      bgColor: "bg-info",
      loopback: "all",
      bigSize: true,
    });

    allStores.value.push({
      title: "Temporarily Closed",
      value: store.$state.storeCounts.temporarilyClosed,
      loopback: "all",
      bgColor: "bg-info",
      bigSize: true,
    });
    allStores.value.push({
      title: "Down Stores",
      value: store.$state.storeCounts.downStoresLP0,
      loopback: "all",
      bgColor: "bg-negative",
      bigSize: true,
    });
  }

  // totalDownStores.value.push({
  //   title: "Mikrotik Down Stores",
  //   value: store.$state.storeCounts.totalDownMikrotik,
  //   bgColor: "#ab2e3c",
  //   routeValue: "",
  //   tableType: "down_mikrotik",
  // });
  // totalDownStores.value.push({
  //   title: "Ruijie Down Stores",
  //   value: store.$state.storeCounts.totalDownRuiji,
  //   bgColor: "#ab2e3c",
  //   routeValue: "",
  //   tableType: "down_ruijie",
  // });
  // problematicStores.value.push({
  //   title: "0% uptime availability (7days)",
  //   value: store.$state.storeCounts.problematicStores0_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "problematic0_7d",
  // });
  // problematicStores.value.push({
  //   title: "< 95% uptime availability (7days)",
  //   value: store.$state.storeCounts.problematicStoresLess95_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "problematic95_7d",
  // });
  // problematicStores.value.push({
  //   title: "< 95% uptime availability (24hrs)",
  //   value: store.$state.storeCounts.problematicStoresLess95_24hrs,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "problematic95_24h",
  // });
  // problematicStores.value.push({
  //   title: "Wireless Only",
  //   value: store.$state.storeCounts.problematicWirelessOnly,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "wireless_only",
  // });
  // problematicStores.value.push({
  //   title: "Single circuit",
  //   value: store.$state.storeCounts.problematicSingleCircuit,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "single_circuit",
  // });

  // primaryCircuit.value.push({
  //   title: "0% uptime availability (7days)",
  //   value: store.$state.storeCounts.problematicPrimary0_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "primary0_7d",
  // });

  // primaryCircuit.value.push({
  //   title: "No Internet",
  //   value: store.$state.storeCounts.primaryCircuitNoInternet,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "primary_no_internet",
  // });
  // primaryCircuit.value.push({
  //   title: "No Provider",
  //   value: store.$state.storeCounts.problematicPrimaryNoProvider,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "primary_no_provider",
  // });
  // primaryCircuit.value.push({
  //   title: "Wireless",
  //   value: store.$state.storeCounts.primaryWireless,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "primary_wireless",
  // });

  // backupCircuit.value.push({
  //   title: "0% uptime availability (7days)",
  //   value: store.$state.storeCounts.problematicBackup0_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "backup0_7d",
  // });
  // backupCircuit.value.push({
  //   title: "< 95% uptime availability (7days)",
  //   value: store.$state.storeCounts.problematicBackupLess95_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "backup95_7d",
  // });
  // backupCircuit.value.push({
  //   title: "100% uptime availability (7days)",
  //   value: store.$state.storeCounts.backup100_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "backup100_7d",
  // });
  // backupCircuit.value.push({
  //   title: "< 95% uptime availability (24hrs)",
  //   value: store.$state.storeCounts.problematicBackupLess95_24hrs,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "backup95_24h",
  // });
  // backupCircuit.value.push({
  //   title: "No Internet",
  //   value: store.$state.storeCounts.backupCircuitNoInternet,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "backup_no_internet",
  // });
  // backupCircuit.value.push({
  //   title: "No Provider",
  //   value: store.$state.storeCounts.problematicBackupNoProvider,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "backup_no_provider",
  // });
  // backupCircuit.value.push({
  //   title: "Wired",
  //   value: store.$state.storeCounts.backupWired,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "backup_wired",
  // });
  // storeConnectivity.value.push({
  //   title: "Dual Circuit",
  //   value: store.$state.storeCounts.dual_circuit_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "dual_circuit_7d",
  // });
  // storeConnectivity.value.push({
  //   title: "Primary Only Up",
  //   value: store.$state.storeCounts.primary_only_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "primary_only_7d",
  // });
  // storeConnectivity.value.push({
  //   title: "Backup Only Up",
  //   value: store.$state.storeCounts.backup_only_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "backup_only_7d",
  // });
  // // Store Health Status
  // storeStatus.value.push({
  //   title: "Down 0%",
  //   value: store.$state.storeCounts.problematicStores0_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "problematic0_7d",
  // });
  // storeStatus.value.push({
  //   title: "Up Problematic > 0% but 95%",
  //   value: store.$state.storeCounts.problematicStoresLess95_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "problematic95_7d",
  // });
  // storeStatus.value.push({
  //   title: "Up Healthy >= 95% But < 100%",
  //   value: store.$state.storeCounts.store_healthy_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "store_healthy_7d",
  // });
  // storeStatus.value.push({
  //   title: "Up Excellent 100%",
  //   value: store.$state.storeCounts.store100_7d,
  //   bgColor: "bg-info",
  //   routeValue: "",
  //   tableType: "store100_7d",
  // });
};

const refresh = async () => {
  $q.loadingBar.start();
  try {
    iframeKey.value++;
    refreshKey.value++;
    store.$state.storeCounts = {} as IcountAllStore;
    allStores.value = [];
    totalDownStores.value = [];
    problematicStores.value = [];
    primaryCircuit.value = [];
    backupCircuit.value = [];
    storeConnectivity.value = [];
    storeStatus.value = [];
    rows.value = [];

    await setProblematicCircuits();
    await getDownStores();
    
  } catch (error) {
    console.log(error);
    $q.notify({
      message: "Could not refresh count data!",
      color: "negative",
    });
  } finally {
    $q.loadingBar.stop();
  }
};
onMounted(async () => {
  // Initial data fetch
  await refresh();

  // Schedule refresh every 30 seconds
  refreshInterval = window.setInterval(() => {
    refresh();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
<style scoped>
.floating-refresh {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #027be3; /* Quasar primary blue */
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.csv-buttons {
  display: flex;
  flex-wrap: wrap;
  max-width: 500px;
  gap: 0.5em;
}
.refresh-btn {
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px 5px 0 0;
  z-index: 50;
}
</style>
