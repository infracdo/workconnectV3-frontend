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
      >
      </q-btn>
    </div>

    <TableNoTelcoModems :rows="rowNoTelcoModems" :store-id="storeId" :refresh="loadDataTableNoTelcoModems" />

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TableNoTelcoModems from "src/components/tables/TableNoTelcoModems.vue";
import { getModemsButNoTelco, getCircuitInfoByDateRange } from "src/api/api";
import { rowsModemsButNoTelco } from "src/api/types";
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

const rowNoTelcoModems = ref<rowsModemsButNoTelco[]>([]);
const ports = ref<string[]>([]);

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
  rowNoTelcoModems.value = [];
  loadDataTableNoTelcoModems();
}

const allLogs = async() => {
  logDate.value.from = "";
  logDate.value.to = "";
  rowNoTelcoModems.value = [];
  loadDataTableNoTelcoModems();
}

const loadDataTableNoTelcoModems = async () => {
  console.log(logDate.value.from, logDate.value.to);
  if (logDate.value.from === "" || logDate.value.to === "") {
    rowNoTelcoModems.value = await getModemsButNoTelco();
  }
  else {
    timeLabel.value = `${logDate.value.from} to ${logDate.value.to}`;
    rowNoTelcoModems.value = await getCircuitInfoByDateRange(logDate.value.from, logDate.value.to);
  }

  // const uniquePorts = new Set(rowCircuitsLogMac.value.map((entry) => entry.port));
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
