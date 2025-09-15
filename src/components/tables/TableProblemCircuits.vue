<template>
    <q-table
        :columns="columns"
        :rows="filteredRows"
        row-key="site_id"
        :filter="filter"
        separator="horizontal"
        dense
    >
        <template #top-left="props">
            <!-- Search Bar -->
            <q-input
                dense
                debounce="300"
                style="width: 250px;"
                v-model="searchFilter"
                placeholder="Search"
                clearable
                @update:model-value="handleSearch"
            >
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>

        <template #top-right="props">
            <q-btn @click="$emit('refresh')" icon="refresh" round flat />
            <q-btn
          v-show="hasPermission(['ROLE_GENERATE_REPORTS'])"
          flat
          round
          dense
          icon="upload_file"
          @click="exportTable"
          color="primary"
        >
          <q-tooltip>Export Table CSV</q-tooltip>
        </q-btn>
        </template>

        <template v-slot:header="props">
            <q-tr :props="props">
                <q-th rowspan="2" class="text-white bg-light-blue-10 text-center border-right">Store ID</q-th>
                
                <!-- Loopback0 Group -->
                <q-th colspan="3" class="text-white bg-light-blue-10 text-center border-right">Loopback0</q-th>
                
                <!-- Primary Circuit Group -->
                <q-th colspan="4" class="text-white bg-light-blue-10 text-center border-right">Primary Circuit</q-th>
                
                <!-- Backup Circuit Group -->
                <q-th colspan="4" class="text-white bg-light-blue-10 text-center">Backup Circuit</q-th>
            </q-tr>
            <q-tr :props="props">
                <!-- Loopback0 Subheaders -->
                <q-th class="text-white bg-light-blue-10 text-center">Public IP</q-th>
                <q-th class="text-white bg-light-blue-10 text-center">Telco Provider</q-th>
                <q-th class="text-white bg-light-blue-10 text-center border-right">In Use</q-th>
                
                <!-- Primary Circuit Subheaders -->
                <q-th class="text-white bg-light-blue-10 text-center">Public IP</q-th>
                <q-th class="text-white bg-light-blue-10 text-center">Telco Provider</q-th>
                <q-th class="text-white bg-light-blue-10 text-center">MAC Address</q-th>
                <q-th class="text-white bg-light-blue-10 text-center border-right">Gateway IP</q-th>
                
                <!-- Backup Circuit Subheaders -->
                <q-th class="text-white bg-light-blue-10 text-center">Public IP</q-th>
                <q-th class="text-white bg-light-blue-10 text-center">Telco Provider</q-th>
                <q-th class="text-white bg-light-blue-10 text-center">MAC Address</q-th>
                <q-th class="text-white bg-light-blue-10 text-center">Gateway IP</q-th>
            </q-tr>
        </template>

        <template v-slot:body="props">
            <q-tr :props=props>
                <!-- Site ID -->
                <q-td key="site_id" :props="props" class="border-right">
                    {{  props.row.site_id  }}
                </q-td>

                <!-- LoopbackO/VPN -->
                <q-td key="vpn0PublicIp" :props="props">
                    {{  isDataValid(props.row.discovered_ip_vpn_0) ? props.row.discovered_ip_vpn_0 : null  }}
                </q-td>

                <q-td key="vpn0TelcoProvider" :props="props">
                    {{  isDataValid(props.row.prov_vpn_0) ? props.row.prov_vpn_0 : null  }}
                </q-td>

                <q-td key="via" :props="props" class="border-right">
                    {{  isDataValid(props.row.gtw_vpn_0) ? props.row.gtw_vpn_0 : null  }}
                </q-td>

                <!-- Primary Circuit -->
                <q-td key="public_ip_primary" :props="props" :class="{'text-red text-bold': selectedFilter === 'sameCircuit' && props.row.discovered_ip_vpn_1 === props.row.discovered_ip_vpn_2 && props.row.discovered_ip_vpn_1 !== 'NONE'}">
                    {{  isDataValid(props.row.discovered_ip_vpn_1) ? props.row.discovered_ip_vpn_1 : null  }}
                </q-td>

                <q-td key="provider_primary" :props="props">
                    {{  isDataValid(props.row.prov_vpn_1) ? props.row.prov_vpn_1 : null  }}
                </q-td>

                <q-td
                    key="mac_primary"
                    :props="props"
                    :class="{
                        'text-red text-bold': shouldHighlightMacPrimary(props.row),
                    }"
                >
                    {{  isDataValid(props.row.mac_address_1) ? props.row.mac_address_1 : null  }}
                </q-td>

                <q-td
                    key="gtw_primary"
                    :props="props"
                    :class="{
                        'text-red text-bold border-right': (selectedFilter === 'factoryResetModem' && props.row.gateway_ip_1 === '192.168.1.1' && props.row.prov_vpn_1?.includes(' SIM')) || shouldHighlightGatewayPrimary(props.row), 'border-right': !!(selectedFilter === 'factoryResetModem' && props.row.gateway_ip_1 === '192.168.1.1' && props.row.prov_vpn_1?.includes('SIM')) || !(shouldHighlightGatewayPrimary(props.row))
                    }"
                >
                    {{  isDataValid(props.row.gateway_ip_1) ? props.row.gateway_ip_1 : null  }}
                </q-td>

                <!-- Backup Circuit -->
                <q-td key="public_ip_backup" :props="props" :class="{'text-red text-bold': selectedFilter === 'sameCircuit' && props.row.discovered_ip_vpn_1 === props.row.discovered_ip_vpn_2 && props.row.discovered_ip_vpn_2 !== 'NONE'}">
                    {{  isDataValid(props.row.discovered_ip_vpn_2) ? props.row.discovered_ip_vpn_2 : null  }}
                </q-td>

                <q-td key="provider_backup" :props="props">
                    {{  isDataValid(props.row.prov_vpn_2) ? props.row.prov_vpn_2 : null  }}
                </q-td>

                <q-td
                    key="mac_backup"
                    :props="props"
                    :class="{
                        'text-red text-bold': shouldHighlightMacBackup(props.row)
                    }"
                >
                    {{  isDataValid(props.row.mac_address_2) ? props.row.mac_address_2 : null  }}
                </q-td>

                <q-td
                    key="gtw_backup"
                    :props="props"
                    :class="{
                        'text-red text-bold': (selectedFilter === 'factoryResetModem' && props.row.gateway_ip_2 === '192.168.1.1' && props.row.prov_vpn_2?.includes(' SIM')) || shouldHighlightGatewayBackup(props.row)
                    }"
                >
                    {{  isDataValid(props.row.gateway_ip_2) ? props.row.gateway_ip_2 : null  }}
                </q-td>
            </q-tr>
        </template>
    </q-table>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useSiteStore } from "src/stores/sites/stores";
import { QTableProps, exportFile, useQuasar } from 'quasar';
import { IStoreInfoCircuits } from 'src/api/types';
import { hasPermission } from "src/utils/helper";

const props = defineProps<{
    rows: IStoreInfoCircuits[]
    title: string;
    optionCircuitIssues?: { label: string; value: string }[]
    refresh?: () => void
    selectedFilter: string
}>()

const $q = useQuasar();
const store = useSiteStore();

// const selectedFilter = ref("")
const searchFilter = ref("")
const filter = ref("")

const columns = ref<QTableProps['columns']>([
    // SITE ID
    {
        name: 'site_id',
        label: 'Store ID',
        field: 'site_id',
        align: 'center',
        sortable: true,
    },
    // LOOPBACK0
    {
        name: 'vpn0PublicIp',
        label: 'VPN0 Public IP',
        field: 'discovered_ip_vpn_0',
        align: 'center',
        sortable: true,
    },
    {
        name: 'vpn0TelcoProvider',
        label: 'VPN0 Telco Provider',
        field: 'prov_vpn_0',
        align: 'center',
        sortable: true,
    },
    {
        name: 'via',
        label: 'Via',
        field: 'gtw_vpn_0',
        align: 'center',
        sortable: true,
    },
    // PRIMARY CIRCUIT
    {
        name: 'public_ip_primary',
        label: 'VPN1 Public IP',
        field: 'discovered_ip_vpn_1',
        align: 'center',
        sortable: true,
    },
    {
        name: 'provider_primary',
        label: 'VPN1 Telco Provider',
        field: 'prov_vpn_1',
        align: 'center',
        sortable: true,
    },
    {
        name: 'mac_primary',
        label: 'Port2 MAC Address',
        field: 'mac_address_1',
        align: 'center',
        sortable: true,
    },
    {
        name: 'gtw_primary',
        label: 'Port2 Gateway IP',
        field: 'gateway_ip_1',
        align: 'center',
        sortable: true,
    },
    // BACKUP CIRCUIT
    {
        name: 'public_ip_backup',
        label: 'VPN2 Public IP',
        field: 'discovered_ip_vpn_2',
        align: 'center',
        sortable: true,
    },
    {
        name: 'provider_backup',
        label: 'VPN2 Telco Provider',
        field: 'prov_vpn_2',
        align: 'center',
        sortable: true,
    },
    {
        name: 'mac_backup',
        label: 'Port1 MAC Address',
        field: 'mac_address_2',
        align: 'center',
        sortable: true,
    },
    {
        name: 'gtw_backup',
        label: 'Port1 Gateway IP',
        field: 'gateway_ip_2',
        align: 'center',
        sortable: true,
    },
]);

const emit = defineEmits(['refresh'])

const filteredRows = computed(() => {
    if (!searchFilter.value) {
        return props.rows;
    }

    const searchTerm = searchFilter.value.toLowerCase()
    return props.rows.filter(row => 
        Object.values(row).some(
            val => val && val.toString().toLowerCase().includes(searchTerm)
        )
    )
})

const handleSearch = (value: string | number | null) => {
    searchFilter.value = value !== null ? String(value) : ''
}
    
const INVALID_DATA = new Set(["NONE", "NO DATA", "NO MAC", "NO IP", "NO GATEWAY_IP", "", null, undefined]);

const isDataValid = (data: string) => data && !INVALID_DATA.has(data.toUpperCase());

const shouldHighlightMacPrimary = (row: IStoreInfoCircuits) => {
    return props.selectedFilter === 'modemConnectedButNoInternet' && 
        row.mac_address_1 &&
        isDataValid(row.mac_address_1) &&
        !isDataValid(row.discovered_ip_vpn_1)
}

const shouldHighlightGatewayPrimary = (row: IStoreInfoCircuits) => {
    return props.selectedFilter === 'modemConnectedButNoInternet' && 
        row.gateway_ip_1 &&
        isDataValid(row.gateway_ip_1) &&
        !isDataValid(row.discovered_ip_vpn_1)
}

const shouldHighlightMacBackup = (row: IStoreInfoCircuits) => {
    return props.selectedFilter === 'modemConnectedButNoInternet' && 
        row.mac_address_2 &&
        isDataValid(row.mac_address_2) &&
        !isDataValid(row.discovered_ip_vpn_2)
}

const shouldHighlightGatewayBackup = (row: IStoreInfoCircuits) => {
    return props.selectedFilter === 'modemConnectedButNoInternet' && 
        row.gateway_ip_2 &&
        isDataValid(row.gateway_ip_2) &&
        !isDataValid(row.discovered_ip_vpn_2)
}

const wrapCsvValue = (val: any, formatFn?: Function | undefined, row?: any) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  // Excel accepts \n and \r in strings, but some other CSV parsers do not
  formatted = formatted.split("\n").join("\\n").split("\r").join("\\r");

  return `"${formatted}"`;
};

const exportTable = () => {
  const content = [
    (columns.value || []).map((col) => wrapCsvValue(col.label)),
    ...props.rows.map((row) =>
        (columns.value || [])
        .map((col) =>
            wrapCsvValue(
            getExportValue(row, typeof col.field === 'string' ? col.field : col.name),
            col.format,
            row
            )
        )
        .join(",")
    ),
    ].join("\r\n");

  const fileName = props.title
    ? `Circuit Issues - ${props.title}.csv`
    : `${props.title}.csv`;

  const status = exportFile(fileName, content, "text/csv");

  if (status !== true) {
    $q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
};

const getExportValue = (row: IStoreInfoCircuits, colName: string) => {
  const value = (row as any)[colName];
  const displayVal = isDataValid(value) ? value : '';

  switch (colName) {
    case 'discovered_ip_vpn_1':
    case 'discovered_ip_vpn_2':
      if (
        props.selectedFilter === 'sameCircuit' &&
        row.discovered_ip_vpn_1 === row.discovered_ip_vpn_2 &&
        row.discovered_ip_vpn_1 !== 'NONE'
      ) {
        return `*${displayVal}*`;
      }
      break;

    case 'mac_address_1':
      if (shouldHighlightMacPrimary(row)) return `*${displayVal}*`;
      break;
    case 'gateway_ip_1':
      if (shouldHighlightGatewayPrimary(row)) return `*${displayVal}*`;
      if (props.selectedFilter === 'factoryResetModem' && row.gateway_ip_1 === '192.168.1.1' && row.prov_vpn_1?.includes(' SIM')) {
        return `*${displayVal}*`;
      }
      break;

    case 'mac_address_2':
      if (shouldHighlightMacBackup(row)) return `*${displayVal}*`;
      break;
    case 'gateway_ip_2':
      if (shouldHighlightGatewayBackup(row)) return `*${displayVal}*`;
      if (props.selectedFilter === 'factoryResetModem' && row.gateway_ip_2 === '192.168.1.1' && row.prov_vpn_2?.includes(' SIM')) {
        return `*${displayVal}*`;
      }
      break;
  }

  return displayVal;
};

</script>

<style scoped>
.border-right {
  border-right: 1px solid #c2c2c2
}
</style>