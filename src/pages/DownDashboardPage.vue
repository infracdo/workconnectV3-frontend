<template>
  <q-page padding>
    <!-- Stores Card -->
    <div class="q-mb-md">
      <q-card
        dark
        bordered
        class="bg-primary my-card"
      >
      <q-card-section>
        <div class="text-h6 text-black">Stores</div>
      </q-card-section>

      <q-separator inset />

      <div class="row">
        <q-card-section flat class="text-black">
        <q-card class="my-card bg-info text-primary stores-card">
          <q-card-section>
            <p class="text-h7 text-weight-bolder q-mb-xs" style="font-size: 17px;">4155</p>
            <p>Total Stores</p>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-section flat class="text-black">
          <q-card class="my-card bg-info text-primary stores-card">
            <q-card-section>
              <p class="text-weight-bolder q-mb-xs" style="font-size: 17px;">75</p>
              <p>Temporarily Closed</p>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-section flat class="text-black">
          <q-card class="my-card bg-info text-primary stores-card">
            <q-card-section>
              <p class="text-weight-bolder q-mb-xs" style="font-size: 17px;">3724</p>
              <p>Mikrotik Stores</p>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-section flat class="text-black">
          <q-card class="my-card bg-info text-primary stores-card">
            <q-card-section>
              <p class="text-weight-bolder q-mb-xs" style="font-size: 17px;">356</p>
              <p>Ruijie Stores</p>
            </q-card-section>
          </q-card>
        </q-card-section>
      </div>
    </q-card>
    </div>

    <!-- Down Stores Card -->
    <div class="q-mb-md">
      <q-card
        dark
        bordered
        class="bg-primary my-card"
      >
      <q-card-section>
        <div class="text-h6 text-black">Down Stores</div>
      </q-card-section>

      <q-separator inset />

      <div class="row">
        <q-card-section flat class="text-black">
        <q-card class="my-card bg-negative text-primary stores-card">
          <q-card-section>
            <p class="text-h7 text-weight-bolder q-mb-xs" style="font-size: 17px;">43</p>
            <p>Prometheus Down Stores</p>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-section flat class="text-black">
          <q-card class="my-card bg-negative text-primary stores-card">
            <q-card-section>
              <p class="text-weight-bolder q-mb-xs" style="font-size: 17px;">73</p>
              <p>Zabbix Down Stores</p>
            </q-card-section>
          </q-card>
        </q-card-section>
      </div>
    </q-card>
    </div>

    <!-- Down Stores List Card -->
    <div>
      <q-card
        dark
        bordered
        class="bg-primary my-card"
      >

      <div class="q-pa-md">
        <q-table
          flat bordered dense
          title="Treats"
          :rows="rows"
          :columns="columns"
          row-key="name"
          :visible-columns="visibleColumns"
          :filter="filter"
        >
          <template v-slot:top="props">
            <div class="col-3 q-table__title text-weight-medium">Down Stores List</div>

            <q-space />

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

            <q-btn
              flat round dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-xs"
            />
          </template>

        </q-table>
      </div>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

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

export default {
  setup () {
    return {
      visibleColumns: ref([ 'storeName', 'desc', 'downDuration', 'primaryCircuitProvider', 'backupCircuitProvider', 'region', 'city', 'province' ]),
      columns,
      rows
    }
  }
}
</script>

<style scoped>
.stores-card {
  width: 280px;
  height: 90px;
}
</style>
