<template>
  <q-card class="q-mb-md" flat>
    <q-card-section class="">
      <q-item-label class="text-h6 q-mb-sm">
        <span> {{ title }}</span>
        <q-space />
        <span v-if="date_timestamp" class="text-subtitle1"
          >Last Updated Date: {{ date_timestamp }}</span
        >
        <q-separator />
      </q-item-label>
      <q-select
        :options="panelOptions"
        v-model="panelSelected"
        v-if="
          hasPermission([
            'GROUP_APOLLO_PROD_SUPPORT',
            'GROUP_APOLLO_OPERATIONS',
          ])
        "
        map-options
        emit-value
        dense
        style="max-width: 300px"
        class="q-pr-sm q-pb-sm"
        outlined
      ></q-select>
      <div class="container">
        <div
          v-for="item in filteredItems"
          :key="item.bgColor"
          :class="`${item.bigSize ? 'big-card' : 'small-card'}`"
        >
          <q-item
            :style="`background-color: ; ${
              item.bigSize ? 'aspect-ratio: 21/7;' : 'aspect-ratio: 16/6;'
            }`"
            :class="`
              ${item.tableType ? 'child-container-list ' : 'child-container'} ${
              item.bgColor
            }`"
          >
            <q-item-section
              class="text-white q-item-class"
              @click="handleOpenList(item.tableType, item.title)"
            >
              <div class="label-wrapper">
                <div class="value-label">{{ item.value }}</div>
                <div class="title-label">{{ item.title }}</div>
              </div>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="openFirstModal">
    <q-card class="card-dialog">
      <q-card-section class="row q-py-none q-card-section-align">
      </q-card-section>

      <q-card-section class="q-pa-none">
        <table-store-details
          v-if="tableLayout === 'storeDetails'"
          :title="currentTitle"
          :rows="rowDetails"
          :close-btn="true"
          :card-title="props.title"
          :loopback-val="'duration'"
        ></table-store-details>
        <table-provider-circuit
          v-if="tableLayout === 'circuitDetails'"
          :title="currentTitle"
          :rows="rowDetails"
          :close-btn="true"
          :card-title="props.title"
          :loopback-val="'uptime'"
        >
        </table-provider-circuit>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { countTypes } from "src/api/types";
import { toRefs, ref, reactive, computed } from "vue";
import { getDetailsList } from "src/api/api";
import { DetailsList, IdetailsListData, IProviderCircuit } from "src/api/types";
import TableStoreDetails from "src/components/tables/TableStoreDetails.vue";
import TableProviderCircuit from "../tables/TableProviderCircuit.vue";
import { useQuasar, QSpinnerDots } from "quasar";
import { insertWorkconnectLog } from "src/api/api";
import { hasPermission } from "src/utils/helper";

const props = defineProps<{
  title: string;
  iframeKey: number;
  prop_items: countTypes[];
  tableLayout: "storeDetails" | "circuitDetails";
  date_timestamp?: string;
}>();
const panelSelected = ref(0);
const panelOptions = [
  { label: "Loopback 0", value: 0 },
  { label: "Loopback 1", value: 1 },
  { label: "Loopback 2", value: 2 },
];
const $q = useQuasar();
const openFirstModal = ref(false);
const currentTitle = ref("");
const rowDetails = ref<IdetailsListData[] | IProviderCircuit[]>([]);
const filteredItems = computed(() => {
  return props.prop_items.filter((item) => {
    return item.loopback === panelSelected.value || item.loopback === "all";
  });
});

const handleOpenList = async (
  store: DetailsList | undefined,
  title: string
) => {
  if (!store) {
    console.warn("Store is undefined/No Table");
    return;
  }

  $q.loading.show({
    message: "Gathering data. Hang on...",
    spinner: QSpinnerDots,
  });
  try {
    insertWorkconnectLog(`Opening listing for ${store}`);
    rowDetails.value = await getDetailsList(store);
    currentTitle.value = title;
    openFirstModal.value = true;
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      message: "Could not retrieve Store Lists, Something went wrong!",
      color: "negative",
    });
  }
  $q.loading.hide();
};
</script>
<style scoped>
.value-label {
  font-size: clamp(1.5rem, 4vw, 4.5rem);
  font-weight: 700;
  line-height: 1;
  color: #ffffff;
  flex-grow: 1;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}
.title-label {
  font-size: clamp(0.8rem, 1.4vw, 1.8rem);
  font-weight: 400;
  color: rgba(255, 255, 255);
  margin: 0.2em 0 0 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.q-item-class {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0;
  margin: 0;
}
.q-item__section {
  width: 100%;
}

.container {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.big-card {
  border-radius: 5px;
  flex: 0 0 calc((100% / 3) - (2 * 1em / 3));
  font-size: 1rem;
  box-sizing: border-box;
}
.small-card {
  border-radius: 5px;
  flex: 0 0 calc((100% / 3) - (2 * 1em / 3));
  font-size: 0.75rem;
  box-sizing: border-box;
}
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
