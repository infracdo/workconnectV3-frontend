<template>
  <q-card
        dark
        bordered
        class="bg-primary"
      >

      <!-- Card header (title) -->
      <q-card-section>
        <div class="text-h6 text-black">Down Stores</div>
      </q-card-section>

      <q-separator inset />

      <!-- Prometheus down stores sub-card -->
      <div class="row">
        <q-card-section flat class="text-black">
        <q-card class="my-card bg-negative text-primary stores-card">
          <q-card-section>
            <p class="text-h7 text-weight-bolder q-mb-xs" style="font-size: 17px;">43</p>
            <p>Prometheus Down Stores</p>
            </q-card-section>
          </q-card>
        </q-card-section>

        <!-- Zabbix down stores sub-card -->
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
</template>
