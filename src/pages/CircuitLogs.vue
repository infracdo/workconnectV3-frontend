<template>
  <q-page padding  :loading="loading">
    <div class = "top-props">
      <q-input
          filled
          v-model="input"
          dense
          readonly
          :label="timeLabel"
          class="children-props"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                ref="proxy"
              >
                <q-date v-model="logDate" range @range-end="loadTable"> </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn
          label="All Circuit Logs"
          @click="allLogs"
          outline
          class="children-props"
        ></q-btn>

    </div>

    <!-- <q-tab name="port1" label="Port 1"></q-tab> -->
    <!-- <q-tabs v-model="circuitLogTabs" dense class="text-dark" active-color="primary" indicator-color="primary"
      align="justify">
      <q-tab name="mac" label="Mac" />
      <q-tab name="provider" label="Provider"/>
      <q-tab name="imsi" label="IMSI"  />
      <q-tab name="connection" label="Connection"  />
    </q-tabs> -->

    <q-tabs v-model="circuitLogTabs" dense class="text-dark" active-color="primary" indicator-color="primary"
      align="justify">
      <q-tab name="upCircuit" label="Up" />
      <q-tab name="downCircuit" label="Down"/>
      <!-- <q-tab name="imsi" label="IMSI"  /> -->
      <q-tab name="newCircuit" label="New"  />
      <q-tab name="changedCircuit" label="Changed"  />
    </q-tabs>


    <!-- <q-tab-panels v-model="circuitLogTabs">
      <q-tab-panel name="mac">
        <table-circuits-logs-mac :rows="rowCircuitsLogMac" :store-id="storeId" :ports="ports"
          :refresh="loadDataTableMac" />
      </q-tab-panel>
      <q-tab-panel name="provider">
        <table-circuits-logs-provider :rows="rowCircuitsLogProv" :store-id="storeId" :ports="ports"
          :refresh="loadDataTableProvider" />
      </q-tab-panel>
      <q-tab-panel name="imsi">
        <table-circuits-logs-i-m-s-i :rows="rowCircuitsLogImsi" :store-id="storeId" :ports="ports"
          :refresh="loadDataTableImsi" />
      </q-tab-panel>
      <q-tab-panel name="connection">
        <table-circuits-logs-connection :rows="rowCircuitsLogConnection" :store-id="storeId" :ports="ports"
          :refresh="loadDataTableConnection" />
      </q-tab-panel>

    </q-tab-panels> -->

    <q-tab-panels v-model="circuitLogTabs">
      <q-tab-panel name="upCircuit">
        <table-circuits-logs-up :rows="rowCircuitsLogUp" :store-id="storeId" :ports="ports"
          :refresh="loadDataTableUpCircuit" />
      </q-tab-panel>
      <q-tab-panel name="downCircuit">
        <table-circuits-logs-down :rows="rowCircuitsLogDown" :store-id="storeId" :ports="ports"
          :refresh="loadDataTableDownCircuit" />
      </q-tab-panel>
      <q-tab-panel name="newCircuit">
        <table-circuits-logs-new :rows="rowCircuitsLogNew" :store-id="storeId" :ports="ports"
          :refresh="loadDataTableNewCircuit" />
      </q-tab-panel>
      <q-tab-panel name="changedCircuit">
        <table-circuits-logs-changed :rows="rowCircuitsLogChanged" :store-id="storeId" :ports="ports"
          :refresh="loadDataTableChangedCircuit" />
      </q-tab-panel>
    </q-tab-panels>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// import TableCircuitsLogs from "src/components/tables/TableCircuitsLogs.vue";
// import TableCircuitsLogsMac from "src/components/tables/CircuitLogs/TableCircuitsLogsMac.vue";
// import TableCircuitsLogsIMSI from "src/components/tables/CircuitLogs/TableCircuitsLogsIMSI.vue";
// import TableCircuitsLogsProvider from "src/components/tables/CircuitLogs/TableCircuitsLogsProvider.vue";
// import TableCircuitsLogsConnection from "src/components/tables/CircuitLogs/TableCircuitsLogsConnection.vue";
import TableCircuitsLogsUp from "src/components/tables/CircuitLogs/CircuitChanges/TableCircuitsLogsUp.vue";
import TableCircuitsLogsDown from "src/components/tables/CircuitLogs/CircuitChanges/TableCircuitsLogsDown.vue";
import TableCircuitsLogsNew from "src/components/tables/CircuitLogs/CircuitChanges/TableCircuitsLogsNew.vue";
import TableCircuitsLogsChanged from "src/components/tables/CircuitLogs/CircuitChanges/TableCircuitsLogsChanged.vue";
import {
  getCircuitLogsBySiteId,
  getCircuitLogsMac,
  getCircuitLogsChanges,
  getCircuitsLogMacByTimePeriod,
  getCircuitsLogProvByTimePeriod,
  getCircuitsLogImsiByTimePeriod,
  getCircuitLogsConnection,
  getCircuitLogsChangesUp,
  getCircuitChangesLogsByDateRange
} from "src/api/api";
import { rowsCircuitsLog } from "src/api/types";
import { useSiteStore } from "src/stores/sites/stores";
import { storeToRefs } from "pinia";

const store = useSiteStore();
const { logDate } = storeToRefs(store);

const timeLabel = ref("Select Time Period");

const loading = ref(false);
const proxy = ref({ hide: () => { } });
const input = ref();

const filter = ref("");
const props = defineProps<{
  storeId: string;
  router?: string;
  getLogsPeriod?: () => void;
  getAll?: () => void;
}>();

// const rowCircuitsLogMac = ref<rowsCircuitsLog[]>([]);
// const rowCircuitsLogProv = ref<rowsCircuitsLog[]>([]);
// const rowCircuitsLogImsi = ref<rowsCircuitsLog[]>([]);
// const rowCircuitsLogConnection = ref<rowsCircuitsLog[]>([]);
const rowCircuitsLogUp = ref<rowsCircuitsLog[]>([]);
const rowCircuitsLogDown = ref<rowsCircuitsLog[]>([]);
const rowCircuitsLogNew = ref<rowsCircuitsLog[]>([]);
const rowCircuitsLogChanged = ref<rowsCircuitsLog[]>([]);
const ports = ref<string[]>([]);
// const circuitLogTabs = ref("mac");
const circuitLogTabs = ref("upCircuit");

const visibleColumns = ref([
  "user",
  "action",
  "service",
  "payload",
  "timestamp",
  "status",
]);


const getLogs = () => {
  const from = logDate.value.from;
  const to = logDate.value.to;
  input.value = `${from} to ${to}`;
  try {
    loading.value = true;
    props.getLogsPeriod?.();
    proxy.value.hide();
  } catch {
    console.log("No Data Found");
  } finally {
    loading.value = false;
  }
};

const loadTable = async ( ) => {
  // rowCircuitsLogMac.value = [];
  // rowCircuitsLogProv.value = [];
  // // rowCircuitsLogImsi.value = [];
  // rowCircuitsLogConnection.value = [];
  // loadDataTableMac();
  // loadDataTableProvider();
  // // loadDataTableImsi();
  // loadDataTableConnection();

  rowCircuitsLogUp.value = [];
  rowCircuitsLogDown.value = [];
  rowCircuitsLogNew.value = [];
  rowCircuitsLogChanged.value = [];
  loadDataTableUpCircuit();
  loadDataTableDownCircuit();
  loadDataTableNewCircuit();
  loadDataTableChangedCircuit();

}

const allLogs = async() => {
  logDate.value.from = "";
  logDate.value.to = "";
  // rowCircuitsLogMac.value = [];
  // rowCircuitsLogProv.value = [];
  // // rowCircuitsLogImsi.value = [];
  // rowCircuitsLogConnection.value = [];
  // loadDataTableMac();
  // loadDataTableProvider();
  // // loadDataTableImsi();
  // loadDataTableConnection();

  rowCircuitsLogUp.value = [];
  rowCircuitsLogDown.value = [];
  rowCircuitsLogNew.value = [];
  rowCircuitsLogChanged.value = [];
  loadDataTableUpCircuit();
  loadDataTableDownCircuit();
  loadDataTableNewCircuit();
  loadDataTableChangedCircuit();
}

// const loadDataTableMac = async () => {
//   console.log(logDate.value.from, logDate.value.to);
//   if (logDate.value.from === "" || logDate.value.to === "") {
//     // rowCircuitsLogMac.value = await getCircuitLogsMac();
//     rowCircuitsLogMac.value = await getCircuitLogsMac("mac address");
//   }
//   else {
//     timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
//     rowCircuitsLogMac.value = await getCircuitsLogMacByTimePeriod(logDate.value.from.replace(/\//g, '-'), logDate.value.to.replace(/\//g, '-'));

//   }

//   // const uniquePorts = new Set(rowCircuitsLogMac.value.map((entry) => entry.port));
//   // ports.value = [...uniquePorts];

// };
const loadDataTableUpCircuit = async () => {
  console.log(logDate.value.from, logDate.value.to);
  if (logDate.value.from === "" || logDate.value.to === "") {
    // rowCircuitsLogMac.value = await getCircuitLogsMac();
    rowCircuitsLogUp.value = await getCircuitLogsChangesUp();
  }
  else {
    timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
    rowCircuitsLogUp.value = await getCircuitChangesLogsByDateRange("up", [], logDate.value.from, logDate.value.to);
  }

  // const uniquePorts = new Set(rowCircuitsLogUp.value.map((entry) => entry.port));
  // ports.value = [...uniquePorts];

};

// const loadDataTableProvider = async () => {
//   console.log(logDate.value.from, logDate.value.to);
//   if (logDate.value.from === "" || logDate.value.to === "") {
//     // rowCircuitsLogProv.value = await getCircuitLogsProvider();
//     rowCircuitsLogProv.value = await getCircuitLogsProvider("provider");
//   }
//   else {
//     timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
//     rowCircuitsLogProv.value = await getCircuitsLogProvByTimePeriod(logDate.value.from.replace(/\//g, '-'), logDate.value.to.replace(/\//g, '-'));
//   }
//   // const uniquePorts = new Set(rowCircuitsLogProv.value.map((entry) => entry.port));
//   // ports.value = [...uniquePorts];
// };
const loadDataTableDownCircuit = async () => {
  console.log(logDate.value.from, logDate.value.to);
  if (logDate.value.from === "" || logDate.value.to === "") {
    // rowCircuitsLogProv.value = await getCircuitLogsProvider();
    rowCircuitsLogDown.value = await getCircuitLogsChanges(["unreachable", "no discovered mac address"]);
  }
  else {
    timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
    rowCircuitsLogDown.value = await getCircuitChangesLogsByDateRange("down", ["unreachable", "no discovered mac address"], logDate.value.from, logDate.value.to);
  }
  // const uniquePorts = new Set(rowCircuitsLogProv.value.map((entry) => entry.port));
  // ports.value = [...uniquePorts];
};


// const loadDataTableImsi = async () => {
//   console.log(logDate.value.from, logDate.value.to);
//   if (logDate.value.from === "" || logDate.value.to === "") {
//     // rowCircuitsLogImsi.value = await getCircuitLogsImsi();
//     rowCircuitsLogImsi.value = await getCircuitLogsImsi("circuit");
//   }
//   else {
//     timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
//     rowCircuitsLogImsi.value = await getCircuitsLogImsiByTimePeriod(logDate.value.from.replace(/\//g, '-'), logDate.value.to.replace(/\//g, '-'));
//   }
//   // const uniquePorts = new Set(rowCircuitsLogProv.value.map((entry) => entry.port));
//   // ports.value = [...uniquePorts];
// };
// const loadDataTableConnection = async () => {
//   console.log(logDate.value.from, logDate.value.to);
//   if (logDate.value.from === "" || logDate.value.to === "") {
//     rowCircuitsLogConnection.value = await getCircuitLogsConnection("circuit");
//   }
//   else {
//     timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
//     rowCircuitsLogConnection.value = await getCircuitsLogImsiByTimePeriod(logDate.value.from.replace(/\//g, '-'), logDate.value.to.replace(/\//g, '-'));
//   }
//   // const uniquePorts = new Set(rowCircuitsLogProv.value.map((entry) => entry.port));
//   // ports.value = [...uniquePorts];
// };
const loadDataTableNewCircuit = async () => {
  console.log(logDate.value.from, logDate.value.to);
  if (logDate.value.from === "" || logDate.value.to === "") {
    rowCircuitsLogNew.value = await getCircuitLogsChanges(["new"]);
  }
  else {
    timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
    rowCircuitsLogNew.value = await getCircuitChangesLogsByDateRange("new", ["new"], logDate.value.from, logDate.value.to);
  }
  // const uniquePorts = new Set(rowCircuitsLogProv.value.map((entry) => entry.port));
  // ports.value = [...uniquePorts];
};

const loadDataTableChangedCircuit = async () => {
  console.log(logDate.value.from, logDate.value.to);
  if (logDate.value.from === "" || logDate.value.to === "") {
    rowCircuitsLogChanged.value = await getCircuitLogsChanges(["changed"]);
  }
  else {
    timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
    rowCircuitsLogChanged.value = await getCircuitChangesLogsByDateRange("changed", ["changed"], logDate.value.from, logDate.value.to);
  }
  // const uniquePorts = new Set(rowCircuitsLogProv.value.map((entry) => entry.port));
  // ports.value = [...uniquePorts];
};

onMounted(() => {
  loadTable();
});
</script>

<style scoped>
.top-props {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 1em;
  flex-wrap: wrap;
  padding: 1px 10px;
  margin: 10px 10px;
  justify-content: flex-end;
}
</style>

