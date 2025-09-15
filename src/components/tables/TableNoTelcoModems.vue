<template>
  <q-table
    style="height: 600px"
    :columns="columns"
    :rows="props.rows"
    dense
    row-key="siteId"
    :filter="filter"
    v-model:pagination="pagination"
    :rows-per-page-options="[0]"
  >
    <template #top-left="props">
      <!-- <q-select v-model="filter" dense label="Select Port" :options="ports" style="width: 250px" clearable
        class="q-pr-sm" /> -->
      <q-input  dense debounce="300" style="width: 250px" v-model="filter" placeholder="Search" clearable>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template #top-right="props">
      <q-btn @click="refresh" icon="refresh" round flat />
    </template>

    <!-- <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-white bg-light-blue-10"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template> -->

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th rowspan="2" class="text-white bg-light-blue-10 text-center border-right">Timestamp</q-th>
        <q-th rowspan="2" class="text-white bg-light-blue-10 text-center border-right">Site ID</q-th>
        <q-th colspan="2" class="text-white bg-light-blue-10 text-center border-right">VPN0</q-th>
        <q-th colspan="6" class="text-white bg-light-blue-10 text-center border-right">VPN1</q-th>
        <q-th colspan="6" class="text-white bg-light-blue-10 text-center border-right">VPN2</q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th class="text-white bg-light-blue-10 text-center">Gateway</q-th>
        <q-th class="text-white bg-light-blue-10 text-center border-right">Provider</q-th>

        <q-th class="text-white bg-light-blue-10 text-center">Discovered IP</q-th>
        <q-th class="text-white bg-light-blue-10 text-center">MAC Address</q-th>
        <q-th class="text-white bg-light-blue-10 text-center">Gateway IP</q-th>
        <q-th class="text-white bg-light-blue-10 text-center">Provider</q-th>
        <q-th class="text-white bg-light-blue-10 text-center">Last Up</q-th>
        <q-th class="text-white bg-light-blue-10 text-center border-right">Status</q-th>

        <q-th class="text-white bg-light-blue-10 text-center">Discovered IP</q-th>
        <q-th class="text-white bg-light-blue-10 text-center">MAC Address</q-th>
        <q-th class="text-white bg-light-blue-10 text-center">Gateway IP</q-th>
        <q-th class="text-white bg-light-blue-10 text-center">Provider</q-th>
        <q-th class="text-white bg-light-blue-10 text-center">Last Up</q-th>
        <q-th class="text-white bg-light-blue-10 text-center border-right">Status</q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="timestamp" :props="props" class="border-right">
          {{ props.row.timestamp }}
        </q-td>
        <q-td key="siteId" :props="props" class="border-right">
          {{ props.row.siteId }}
        </q-td>

        <q-td key="gtwVpn0" :props="props">
          {{ props.row.gtwVpn0 }}
        </q-td>
        <q-td key="providerVpn0" :props="props" class="text-center border-right">
          {{ props.row.providerVpn0 }}
        </q-td>

        <q-td key="discoveredIpVpn1" :props="props" :class="{'bg-yellow-1': shouldHighlightProvider1(props.row)}">
          {{ props.row.discoveredIpVpn1 }}
        </q-td>
        <q-td key="macAddress1" :props="props" :class="{'bg-yellow-1': shouldHighlightProvider1(props.row)}">
          {{ props.row.macAddress1 }}
        </q-td>
        <q-td key="gatewayIp1" :props="props" :class="{'bg-yellow-1': shouldHighlightProvider1(props.row)}">
          {{ props.row.gatewayIp1 }}
        </q-td>
        <q-td key="providerVpn1" :props="props" :class="{'bg-yellow-1 text-red text-bold': shouldHighlightProvider1(props.row)}">
          {{ props.row.providerVpn1 }}
        </q-td>
        <q-td key="lastUpVpn1" :props="props" :class="{'bg-yellow-1': shouldHighlightProvider1(props.row)}">
          {{ props.row.lastUpVpn1 }}
        </q-td>
        <q-td
          key="statusVpn1"
          :props="props"
          class="border-right"
          :class="{
            'bg-yellow-1': shouldHighlightProvider1(props.row)
          }">
          {{ props.row.statusVpn1 }}
        </q-td>

        <q-td key="discoveredIpVpn2" :props="props" :class="{'bg-yellow-1': shouldHighlightProvider2(props.row)}">
          {{ props.row.discoveredIpVpn2 }}
        </q-td>
        <q-td key="macAddress2" :props="props" :class="{'bg-yellow-1': shouldHighlightProvider2(props.row)}">
          {{ props.row.macAddress2 }}
        </q-td>
        <q-td key="gatewayIp2" :props="props" :class="{'bg-yellow-1': shouldHighlightProvider2(props.row)}">
          {{ props.row.gatewayIp2 }}
        </q-td>
        <q-td key="providerVpn2" :props="props" :class="{'bg-yellow-1 text-red text-bold': shouldHighlightProvider2(props.row)}">
          {{ props.row.providerVpn2 }}
        </q-td>
        <q-td key="lastUpVpn2" :props="props" :class="{'bg-yellow-1': shouldHighlightProvider2(props.row)}">
          {{ props.row.lastUpVpn2 }}
        </q-td>
        <q-td key="statusVpn2" :props="props" class="border-right" :class="{'bg-yellow-1': shouldHighlightProvider2(props.row)}">
          {{ props.row.statusVpn2 }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { QTableProps } from "quasar";
import { rowsModemsButNoTelco } from "src/api/types";

const props = defineProps<{
  rows: rowsModemsButNoTelco[];
  // ports?: string[];
  refresh: () => void;
}>();

const filter = ref("");

const pagination = ref({
  rowsPerPage: props.rows.length,
  sortBy: "timestamp",
  descending: true,
});

const columns = [
  {
    name: "timestamp",
    align: "left",
    label: "Timestamp",
    field: "timestamp",
    sortable: true,
  },
  {
    name: "siteId",
    align: "left",
    label: "Site ID",
    field: "siteId",
    sortable: true,
  },
  {
    name: "gtwVpn0",
    align: "left",
    label: "Gateway VPN0",
    field: "gtwVpn0",
    sortable: true,
  },
  {
    name: "providerVpn0",
    align: "left",
    label: "Provider VPN0",
    field: "providerVpn0",
    sortable: true,
  },
  {
    name: "discoveredIpVpn1",
    align: "left",
    label: "Discovered IP VPN1",
    field: "discoveredIpVpn1",
    sortable: true,
  },
  {
    name: "macAddress1",
    align: "left",
    label: "MAC Address 1",
    field: "macAddress1",
    sortable: true,
  },
  {
    name: "gatewayIp1",
    align: "left",
    label: "Gateway IP 1",
    field: "gatewayIp1",
    sortable: true,
  },
  {
    name: "providerVpn1",
    align: "left",
    label: "Provider VPN1",
    field: "providerVpn1",
    sortable: true,
  },
  {
    name: "lastUpVpn1",
    align: "left",
    label: "Last Up VPN1",
    field: "lastUpVpn1",
    sortable: true,
  },
  {
    name: "statusVpn1",
    align: "left",
    label: "Status VPN1",
    field: "statusVpn1",
    sortable: true,
  },
  {
    name: "discoveredIpVpn2",
    align: "left",
    label: "Discovered IP VPN2",
    field: "discoveredIpVpn2",
    sortable: true,
  },
  {
    name: "macAddress2",
    align: "left",
    label: "MAC Address 2",
    field: "macAddress2",
    sortable: true,
  },
  {
    name: "gatewayIp2",
    align: "left",
    label: "Gateway IP 2",
    field: "gatewayIp2",
    sortable: true,
  },
  {
    name: "providerVpn2",
    align: "left",
    label: "Provider VPN2",
    field: "providerVpn2",
    sortable: true,
  },
  {
    name: "lastUpVpn2",
    align: "left",
    label: "Last Up VPN2",
    field: "lastUpVpn2",
    sortable: true,
  },
  {
    name: "statusVpn2",
    align: "left",
    label: "Status VPN2",
    field: "statusVpn2",
    sortable: true,
  },
] as QTableProps["columns"];


const truncateArray = (stringArray: string[]): string => {
  const maxItems = 3;
  if (stringArray.length <= 3) {
    return stringArray.join(", ");
  } else {
    const truncated = stringArray.slice(0, maxItems);
    return `${truncated.join(", ")} + ${stringArray.length - maxItems} ...`;
  }
};

const getBadgeColor = (macStatus: string) => {
  switch (macStatus) {
    case 'added':
      return 'green';
    case 'removed':
      return 'red';
    case 'changed':
      return 'orange';
    default:
      return 'blue'; // You can set a default color or handle other cases as needed
  }
};

const shouldHighlightProvider1 = (row: rowsModemsButNoTelco) => {
  return row.macAddress1 && row.providerVpn1 === "NONE"
}

const shouldHighlightProvider2 = (row: rowsModemsButNoTelco) => {
  return row.macAddress2 && row.providerVpn2 === "NONE"
}
</script>

<style scoped>
td {
  max-width: 300px;
  /* white-space: pre-wrap; */
}
.border-right {
  border-right: 1px solid #c2c2c2;
}
</style>
