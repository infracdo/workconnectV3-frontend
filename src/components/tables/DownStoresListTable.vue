<template>
  <q-table
          flat bordered dense
          title="Down-Stores-List"
          :rows="rows"
          :columns="columns"
          row-key="name"
          :visible-columns="visibleColumns"
          :filter="filter"
        >
          <template v-slot:top="props">
            <!-- Table title -->
            <div class="col-3 q-table__title text-weight-medium">Down Stores List</div>

            <q-space />

            <!-- Dropdown filter -->
            <q-select
              v-model="visibleColumns"
              multiple
              outlined
              dense
              options-dense
              :display-value="`Select Visible Columns`"
              emit-value
              map-options
              :options="columns"
              option-value="name"
              options-cover
              class="q-mr-md"
              style="min-width: 150px"
            />

            <!-- Search filter -->
            <q-input
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
              class="q-mr-md"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Grid view button -->
            <q-btn
              flat round dense
              icon="grid_view"
              text-color="black"
              @click="exportTable"
            >
              <q-tooltip>
                Grid
              </q-tooltip>
            </q-btn>

            <!-- Export table to CSV -->
            <q-btn
              flat round dense
              icon="archive"
              text-color="blue-9"
              @click="exportTable"
            >
              <q-tooltip>
                Export Table CSV
              </q-tooltip>
            </q-btn>

            <!-- Fullscreen button -->
            <q-btn
              flat round dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-xs"
            />
          </template>

        </q-table>
</template>

<script setup>
import { ref } from 'vue'

// Column names
const columns = [
  {
    name: 'siteId',
    required: true,
    label: 'Site ID',
    align: 'left',
    field: row => row.siteId,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'storeName', align: 'left', label: 'Store Name', field: 'storeName', sortable: true },
  { name: 'downDuration', align: 'left', label: 'Down Duration', field: 'downDuration', sortable: true },
  { name: 'primaryCircuitProvider', align: 'left', label: 'Primary Circuit Provider', field: 'primaryCircuitProvider' },
  { name: 'backupCircuitProvider', align: 'left', label: 'Backup Circuit Provider', field: 'backupCircuitProvider' },
  { name: 'region', align: 'left', label: 'Region', field: 'region' },
  { name: 'city', align: 'left', label: 'City', field: 'city', sortable: true },
  { name: 'province', align: 'left', label: 'Province', field: 'province', sortable: true }
]

// Sample data
const rows = [
  {
    siteId: 'ST-0022',
    storeName: 'Retiro',
    downDuration: '46 days, 21 hours, and 1 minute',
    primaryCircuitProvider: 'GLOBE WIRED',
    backupCircuitProvider: 'SMART SIM',
    region: 'NC',
    city: 'City of Manila',
    province: 'Metro Manila'
  },
  {
    siteId: 'ST-2491',
    storeName: 'Tiwi',
    downDuration: '44 days, 21 hours, and 4 minutes',
    primaryCircuitProvider: 'GLOBE WIRED',
    backupCircuitProvider: 'GLOBE SIM',
    region: '05',
    city: 'Tiwi',
    province: 'Albay'
  },
  {
    siteId: 'ST-0880',
    storeName: 'Alfonso',
    downDuration: '38 days, 21 hours, and 35 minutes',
    primaryCircuitProvider: 'STREAMTECH',
    backupCircuitProvider: 'SMART SIM',
    region: '4A',
    city: 'Alfonso',
    province: 'Cavite'
  }
]

// Options for dropdown filter
const visibleColumns = ref(
  [
    'storeName',
    'desc',
    'downDuration',
    'primaryCircuitProvider',
    'backupCircuitProvider',
    'region',
    'city',
    'province'
  ]
);

const filter = ref('');
</script>
