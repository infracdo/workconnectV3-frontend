<template>
  <q-page>
    <div class="q-pa-md">
      <!-- Same Circuit Accordion -->
      <q-expansion-item
        v-model="sameCircuitExpanded"
        :label="`Same Circuit (${sameCircuitRows.length} circuits)`"
        header-class="bg-light-blue-10 text-weight-bold text-white"
        expand-icon-class="text-white"
        class="q-mb-md rounded-expansion-item"
        @show="showActiveAccordion('sameCircuit')"
      >
        <TableProblemCircuits
          :title="`Same Circuit (${sameCircuitRows.length} circuits)`"
          :rows="sameCircuitRows"
          :selectedFilter="'sameCircuit'"
          @refresh="refreshSameCircuit"
        />
      </q-expansion-item>

      <!-- Modem Connected but No Internet Accordion -->
      <q-expansion-item
        v-model="modemConnectedButNoInternetExpanded"
        :label="`Modem Connected but No Internet (${modemConnectedButNoInternetRows.length} circuits)`"
        header-class="bg-light-blue-10 text-weight-bold text-white font-weight-bold"
        expand-icon-class="text-white"
        class="q-mb-md rounded-expansion-item"
        @show="showActiveAccordion('modemConnectedButNoInternet')"
      >
        <TableProblemCircuits
          :title="`Modem Connected but No Internet (${modemConnectedButNoInternetRows.length} circuits)`"
          :rows="modemConnectedButNoInternetRows"
          :selectedFilter="'modemConnectedButNoInternet'"
          @refresh="refreshModemConnectedButNoInternet"
        />
      </q-expansion-item>

      <!-- Factory Reset Modem Accordion -->
      <q-expansion-item
        v-model="factoryResetModemExpanded"
        :label="`Factory Reset Modem (${factoryResetModemRows.length} circuits)`"
        header-class="bg-light-blue-10 text-weight-bold text-white"
        expand-icon-class="text-white"
        class="q-mb-md rounded-expansion-item"
        @show="showActiveAccordion('factoryResetModem')"
      >
        <TableProblemCircuits
          :title="`Factory Reset Modem (${factoryResetModemRows.length} circuits)`"
          :rows="factoryResetModemRows"
          :selectedFilter="'factoryResetModem'"
          @refresh="refreshFactoryResetModem"
        />
      </q-expansion-item>

      <!-- Circuit-Up Loopback-Down Stores Accordion -->
      <q-expansion-item
        v-model="circuitUpLoopbackDownStoresExpanded"
        :label="`Circuit-Up Loopback-Down Stores (${downStoreRows.length} circuits)`"
        header-class="bg-light-blue-10 text-weight-bold text-white"
        expand-icon-class="text-white"
        class="q-mb-md rounded-expansion-item"
        @show="showActiveAccordion('circuitUpLoopbackDownStores')"
      >
        <TableProblemCircuits
          :title="`Circuit-Up Loopback-Down Stores (${downStoreRows.length} circuits)`"
          :rows="downStoreRows"
          :selectedFilter="'circuitUpLoopbackDownStores'"
          @refresh="refreshCircuitUpLoopbackDownStores"
        />
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getDetailsList } from "src/api/api";
import { IStoreInfoCircuits } from "src/api/types";
import TableProblemCircuits from "src/components/tables/TableProblemCircuits.vue";

const rows = ref<IStoreInfoCircuits[]>([]);
const downStoreRows = ref<IStoreInfoCircuits[]>([]);
const loading = ref(false);
const sameCircuitExpanded = ref(false);
const modemConnectedButNoInternetExpanded = ref(false);
const factoryResetModemExpanded = ref(false);
const circuitUpLoopbackDownStoresExpanded = ref(false);
const activeAccordion = ref("");

onMounted(async () => {
  await fetchData();
  await refreshCircuitUpLoopbackDownStores();
});

const fetchData = async () => {
  try {
    loading.value = true;
    const dataProviderCircuitsToday = await getDetailsList(
      "store_info_circuits"
    );
    // const dataVpnConnectionToday = await getAllVpnConnectionToday() // no need to call api for vpn0 info
    // console.log(dataVpnConnectionToday)

    // Create a map of vpn connections by site_id for quick lookup
    // const vpnConnectionsMap = new Map<string, IVpnConnectionToday>();
    // dataVpnConnectionToday.forEach((vpn: IVpnConnectionToday) => {
    //   vpnConnectionsMap.set(vpn.siteId, vpn);
    // });

    // Merge the data where site_ids match
    const mergedData = dataProviderCircuitsToday.map(
      (circuit: IStoreInfoCircuits) => {
        // const vpnData = vpnConnectionsMap.get(circuit.site_id);

        let discovered_ip_vpn_0 = "NONE";
        // let viaValue = ''
        // let loopback0TelcoProvider = ''

        // if (vpnData) {
        //   if (vpnData.publicIp === circuit.discovered_ip_vpn_1) {
        //     viaValue = 'Primary'
        //     loopback0TelcoProvider = circuit.prov_vpn_1
        //   } else if (vpnData.publicIp === circuit.discovered_ip_vpn_2) {
        //     viaValue = 'Backup'
        //     loopback0TelcoProvider = circuit.prov_vpn_2
        //   }
        // }

        if (dataProviderCircuitsToday) {
          if (circuit.gtw_vpn_0 === "PRIMARY") {
            discovered_ip_vpn_0 = circuit.discovered_ip_vpn_1;
          } else if (circuit.gtw_vpn_0 === "BACKUP") {
            discovered_ip_vpn_0 = circuit.discovered_ip_vpn_2;
          }
        }

        return {
          ...circuit,
          // Add the vpn connection data to each circuit
          discovered_ip_vpn_0: discovered_ip_vpn_0,
          // vpn0TelcoProvider: loopback0TelcoProvider, // redundant, equivalent to prov_vpn_0
          // via: viaValue // redundant, equivalent to gtw_vpn_0
        };
      }
    );

    rows.value = mergedData;

    // rows.value = dataProviderCircuitsToday;
  } catch (err) {
    console.error("Failed to fetch circuits: ", err);
  } finally {
    loading.value = false;
  }
};

const refreshSameCircuit = async () => {
  try {
    loading.value = true;
    await fetchData();
  } catch (error) {
    console.error("Error refreshing same circuit table: ", error);
  } finally {
    loading.value = false;
  }
};

const refreshModemConnectedButNoInternet = async () => {
  try {
    loading.value = true;
    await fetchData();
  } catch (error) {
    console.error(
      "Error refreshing modem connected but no internet table: ",
      error
    );
  } finally {
    loading.value = false;
  }
};

const refreshFactoryResetModem = async () => {
  try {
    loading.value = true;
    await fetchData();
  } catch (error) {
    console.error("Error refreshing factory reset modem table: ", error);
  } finally {
    loading.value = false;
  }
};

const refreshCircuitUpLoopbackDownStores = async () => {
  try {
    loading.value = true;
    
    const dataProviderCircuitsToday = await getDetailsList(
      "false_down_store"
    );

    const mergedData = dataProviderCircuitsToday.map(
      (circuit: IStoreInfoCircuits) => {

        let discovered_ip_vpn_0 = "NONE";
        if (dataProviderCircuitsToday) {
          if (circuit.gtw_vpn_0 === "PRIMARY") {
            discovered_ip_vpn_0 = circuit.discovered_ip_vpn_1;
          } else if (circuit.gtw_vpn_0 === "BACKUP") {
            discovered_ip_vpn_0 = circuit.discovered_ip_vpn_2;
          }
        }

        return {
          ...circuit,
          discovered_ip_vpn_0: discovered_ip_vpn_0,
        };
      }
    );

    downStoreRows.value = mergedData;
  } catch (error) {
    console.error("Error refreshing circuit up loopback down stores table: ", error);
  } finally {
    loading.value = false;
  }
};

const showActiveAccordion = (activeValue: string) => {
  activeAccordion.value = activeValue;

  if (activeValue === "sameCircuit") {
    modemConnectedButNoInternetExpanded.value = false;
    factoryResetModemExpanded.value = false;
    circuitUpLoopbackDownStoresExpanded.value = false;
  } else if (activeValue === "modemConnectedButNoInternet") {
    sameCircuitExpanded.value = false;
    factoryResetModemExpanded.value = false;
    circuitUpLoopbackDownStoresExpanded.value = false;
  } else if (activeValue === "factoryResetModem") {
    sameCircuitExpanded.value = false;
    modemConnectedButNoInternetExpanded.value = false;
    circuitUpLoopbackDownStoresExpanded.value = false;
  } else if (activeValue === "circuitUpLoopbackDownStores") {
    sameCircuitExpanded.value = false;
    modemConnectedButNoInternetExpanded.value = false;
    factoryResetModemExpanded.value = false;
  }
};
    
const INVALID_DATA = new Set(["NONE", "NO DATA", "NO MAC", "NO IP", "NO GATEWAY_IP", "", null, undefined]);

const isValidData = (data: string) => data && !INVALID_DATA.has(data.toUpperCase());

const sameCircuitRows = computed(() => {
  return rows.value.filter((row) =>
    isValidData(row.discovered_ip_vpn_1) &&
    isValidData(row.discovered_ip_vpn_2) &&
    row.discovered_ip_vpn_1 === row.discovered_ip_vpn_2
  );
});

const modemConnectedButNoInternetRows = computed(() => {
  // return rows.value.filter((row) => {
  //   const noNegativeValue = row.discovered_ip_vpn_0 !== "NONE";

  //   const noPublicIpAndTelco =
  //     ((!row.discovered_ip_vpn_1 && !row.prov_vpn_1) ||
  //       (!row.discovered_ip_vpn_2 && !row.prov_vpn_2)) &&
  //     row.discovered_ip_vpn_1 !== "No Data" &&
  //     row.discovered_ip_vpn_2 !== "No Data";

  //   const portWithModem =
  //     ((row.mac_address_1 && row.gateway_ip_1) ||
  //       (row.mac_address_2 && row.gateway_ip_2)) &&
  //     row.mac_address_1 !== "NO MAC" &&
  //     row.mac_address_2 !== "NO MAC" &&
  //     row.mac_address_1 !== "NO DATA" &&
  //     row.mac_address_2 !== "NO DATA" &&
  //     row.gateway_ip_1 !== "NO GATEWAY_IP" &&
  //     row.gateway_ip_2 !== "NO GATEWAY_IP" &&
  //     row.gateway_ip_1 !== "NO DATA" &&
  //     row.gateway_ip_2 !== "NO DATA";

  //   return noNegativeValue && noPublicIpAndTelco && portWithModem;
  // });

  return rows.value.filter((row) => {

    const isValidInterface = (mac: string, gtw: string, ip: string) => // has mac and gateway, has no ip and no prov
      isValidData(mac) && isValidData(gtw) && !isValidData(ip);

    return (
      isValidInterface(row.mac_address_1, row.gateway_ip_1, row.discovered_ip_vpn_1) || // for hits in primary
      isValidInterface(row.mac_address_2, row.gateway_ip_2, row.discovered_ip_vpn_2) // for hit in backup
    );
  });
});

const factoryResetModemRows = computed(() => {
  //
  // return rows.value.filter(
  //   (row) =>
  // row.discovered_ip_vpn_0 !== 'NONE' && // must not be none
  // ((row.mac_address_1 && row.gateway_ip_1) || (row.mac_address_2 && row.gateway_ip_2)) && // must have values for mac and gateway ip
  // (row.prov_vpn_1 === 'GLOBE SIM' || row.prov_vpn_1 === 'SMART SIM') &&
  // (row.prov_vpn_2 === 'GLOBE SIM' || row.prov_vpn_2 === 'SMART SIM') &&
  // row.mac_address_1 !== 'NO MAC' && row.gateway_ip_1 !== 'NO GATEWAY_IP' && row.mac_address_2 !== 'NO MAC' && row.gateway_ip_2 !== 'NO GATEWAY_IP' &&
  // (row.gateway_ip_1 === '192.168.1.1' || row.gateway_ip_2 === '192.168.1.1')

  return rows.value.filter((row) => {
    if (row.discovered_ip_vpn_0 === "NONE") return false; // means no interface found

    const isValidProvider = (prov: string) =>
      prov === "GLOBE SIM" || prov === "SMART SIM";

    const isValidInterface = (mac: string, ip: string, prov: string) =>
      mac && mac !== "NO MAC" && ip === "192.168.1.1" && isValidProvider(prov);

    return (
      isValidInterface(row.mac_address_1, row.gateway_ip_1, row.prov_vpn_1) ||
      isValidInterface(row.mac_address_2, row.gateway_ip_2, row.prov_vpn_2)
    );
  });
});

</script>

<style scoped>
.rounded-expansion-item {
  border-radius: 5px;
  overflow: hidden;
}
</style>
