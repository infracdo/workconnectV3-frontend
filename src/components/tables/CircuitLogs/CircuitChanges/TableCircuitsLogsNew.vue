<template>
  <q-table
    style="height: 600px"
    :columns="columns"
    :rows="filteredRows"
    dense
    class="q-py-sm my-sticky-virtscroll-table"
    row-key="siteId"
    virtual-scroll
    :filter="filter"
    v-model:pagination="pagination"
    :rows-per-page-options="[0]"
  >
    <template #top-left="props">
      <q-select
        v-model="filter"
        dense
        label="Select Port"
        :options="portOptions"
        emit-value
        map-options
        style="width: 250px"
        clearable
        class="q-pr-sm"
      />
      <q-input  dense debounce="300" style="width: 250px" v-model="filter" placeholder="Search" clearable>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template #top-right="props">
      <q-btn @click="refresh" icon="refresh" round flat />
    </template>
    <template v-slot:header="props">
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
      </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="timestamp" :props="props">
          {{ props.row.timestamp }}
        </q-td>
        <q-td key="siteId" :props="props">
          {{ props.row.siteId }}
        </q-td>
        <q-td key="typeOfChange" :props="props">
          {{ props.row.typeOfChange }}
        </q-td>
        <q-td key="previousData" :props="props">
          {{ props.row.previousData }}
        </q-td>
        <q-td key="newData" :props="props">
          {{ props.row.newData }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { QTableProps } from "quasar";
import { rowsCircuitsLog } from "src/api/types";

const props = defineProps<{
  rows: rowsCircuitsLog[];
  // ports?: string[];
  refresh: () => void;
}>();

const filter = ref("");
const selectedPort = ref<string | null>(null);
  const portOptions = [
  { label: 'Port1', value: 'VPN2' },
  { label: 'Port2', value: 'VPN1' }
];

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
    name: "typeOfChange",
    align: "left",
    label: "Type of Change",
    field: "typeOfChange",
    sortable: true,
  },
  {
    name: "previousData",
    align: "left",
    label: "Previous Data",
    field: "previousData",
    sortable: true,
  },
  {
    name: "newData",
    align: "left",
    label: "New Data",
    field: "newData",
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

const filteredRows = computed(() => {
  let filtered = props.rows;

  if (selectedPort.value) {
    filtered = filtered.filter(row =>
      row.typeOfChange?.toUpperCase().includes(selectedPort.value as string)
    );
  }

  return filtered;
})
</script>

<style scoped>
td {
  max-width: 300px;
  /* white-space: pre-wrap; */
}
</style>
