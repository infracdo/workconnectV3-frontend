<template>
  <q-page class="q-pa-sm column">
    <q-card class="col column shadow-4 hover-shadow">
      <!-- Header Section -->
      <q-card-section class="q-pb-none">
        <q-item-label class="text-h6">
          <span> Troubleshooting </span>
          <q-space />
          <q-separator />
        </q-item-label>
      </q-card-section>

      <!-- Form Section -->
      <q-card-section class="q-pt-none q-pb-none">
        <q-form @submit="submitTroubleshootPlaybook">
          <div
            class="row items-center justify-between q-gutter-md"
            style="width: 100%"
          >
            <div style="width: 25%">
              <q-select
                :options="playbook_options()"
                v-model="troubleshootingType"
                style="max-width: 300px"
                filled
                emit-value
                map-options
                dense
              />
            </div>
            <div class="row items-center q-gutter-md">
              <q-input
                filled
                v-model="storeId"
                label="Store ID"
                dense
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please enter store ID',
                ]"
                style="width: 200px"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="storeId"
                    ref="storeInput"
                    name="backspace"
                    class="cursor-pointer"
                    @mousedown.prevent="onReset"
                    tabindex="0"
                    role="button"
                    aria-label="Clear"
                    hint="Clear"
                  />
                </template>
              </q-input>
              <q-btn
                label=""
                type="submit"
                color="primary"
                class="self-start"
                :disable="isRunDisabled"
              >
                <template v-slot:default>
                  <q-icon name="play_arrow" style="padding-right: 3px;" />
                  <span style="padding-right: 12px;">Run</span>
                  <q-tooltip>
                    {{
                      isRunDisabled
                        ? "Playbook and Store ID required"
                        : "Execute playbook"
                    }}
                  </q-tooltip>
                </template>
              </q-btn>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <!-- Output Section -->
      <q-card-section
        v-if="playbookOutput"
        class="col q-pb-md q-pt-none"
        style="display: flex; flex-direction: column;"
      >
        <q-banner
          dense
          class="bg-grey-2 text-dark full-width full-height q-pa-sm"
          style="flex: 1 1 auto; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start;"
        >
          <pre
            class="scroll"
            style="white-space: pre-wrap; word-wrap: break-word; overflow-y: auto; height: 100%; margin: 0; text-align: left; padding: 12px;"

          >
{{ playbookOutput }}
          </pre>
        </q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, nextTick, Ref, computed } from "vue";
import { useQuasar } from "quasar";
import type { QInput } from "quasar";
import axios from "axios";
import {
  getPublicIp,
  checkSiteExists,
  insertWorkconnectLog,
  executeTroubleshootPlaybook,
} from "src/api/api";

const $q = useQuasar();

$q.loadingBar.setDefaults({
  color: "positive",
  size: "5px",
  position: "bottom",
});

const storeId = ref("");
const storeInput: Ref<QInput | null> = ref(null);
const troubleshootingType = ref<string>("Select Playbook");

const playbookOutput = ref<string | null>(null);

const playbook_options = (): { label: string; value: string }[] => {
  let optionz = [];
  optionz.push(
    {
      label: "Operations | Get IP ARP",
      value: "ipArp",
    },
    {
      label: "Operations | Get DHCP Client",
      value: "dhcpClient",
    },
    {
      label: "Operations | Get Interface Status",
      value: "interfaceStatus",
    },
    {
      label: "Operations | Get IP Address",
      value: "ipAddress",
    },
    {
      label: "Operations | Get IP Route",
      value: "ipRoute",
    },
    {
      label: "Operations | Get Public IP & Provider",
      value: "publicIpProvider",
    }
  );
  return optionz;
};

const parsePublicIpAndProvider = async () => {
  $q.loading.show({
    message: "Gathering latest public IP and provider data..",
  });
  try {
    const response = await getPublicIp(storeId.value);
    playbookOutput.value = response;
    insertWorkconnectLog(
      `Auto-discovering public IP and provider for ${storeId.value}`
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        $q.notify({
          message: "Unauthorized Access Request failed with Status Code 401",
          color: "negative",
        });
      }
    }
  } finally {
    $q.loading.hide();
  }
};

const parseTroubleshootOutput = async () => {
  $q.loading.show({
    message: "Gathering latest circuit data..",
  });
  try {
    const response = await executeTroubleshootPlaybook(storeId.value, troubleshootingType.value);
    console.log("Original response:" + response);
    playbookOutput.value = response.replace(/,/g, '');
    console.log("Response without commas:" + playbookOutput.value);
    insertWorkconnectLog(
      `Auto-discovering circuit data for ${storeId.value}`
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        $q.notify({
          message: "Unauthorized Access Request failed with Status Code 401",
          color: "negative",
        });
      } else if (error.response?.status === 500) {
        $q.notify({
          message: "An error occurred while running the playbook",
          color: "negative",
        });
      }
    }
  } finally {
    $q.loading.hide();
  }
};

const isRunDisabled = computed(() => {
  const isStoreIdInvalid = !storeId.value || storeId.value.trim() === '' || storeId.value.length < 7;
  const isTypeInvalid = !playbook_options().some(
    (option) => option.value === troubleshootingType.value
  );
  return isStoreIdInvalid || isTypeInvalid;
});

const onReset = async () => {
  storeId.value = "";
  await nextTick(); // Wait for input to update
  const inputEl = storeInput.value?.$el.querySelector(
    "input"
  ) as HTMLInputElement | null;
  inputEl?.focus();
};

const submitTroubleshootPlaybook = async () => { // add parameter for playbook name
  playbookOutput.value = null;
  $q.loading.show({
    message: `Running Troubleshoot Playbook for ${storeId.value}`,
  });
  try {
    // CHECK FIRST IF STORE EXISTS
    const siteExists = await checkSiteExists(storeId.value);
    if (!siteExists) {
      $q.notify({
        message: "Store does not exist",
        color: "negative",
      });
      return;
    }
    // IF EXISTS, PROCEED TO RUNNING PLAYBOOK
    let response = null;
    if (troubleshootingType.value === "publicIpProvider") {
      response = await parsePublicIpAndProvider();
    } else {
      response = await parseTroubleshootOutput();
      if (response != null) {
        $q.notify({
          message: "Successfully ran troubleshoot playbook for " + storeId.value,
          color: "accent",
          actions: [
            {
              icon: "close",
              color: "white",
              round: true,
              handler: () => {},
            },
          ],
        });
      }
    }

  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.error;
      playbookOutput.value = "Error occurred. " + errorMessage;
      $q.notify({
        message: errorMessage,
        color: "negative",
        position: "top",
      });
    }
  } finally {
    $q.loading.hide();
  }
};
</script>
<style scoped>
.hover-shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s ease-in-out;
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
