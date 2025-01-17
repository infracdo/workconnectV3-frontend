<template>
  <q-card
        dark
        bordered
        class="bg-primary my-card"
      >

      <!-- Card header (title) -->
      <q-card-section>
        <div class="text-h6 text-black">Stores</div>
      </q-card-section>

      <q-separator inset />

      <!-- Total stores sub-card -->
      <div class="row">
        <q-card-section flat class="text-black">
        <q-card class="my-card bg-info text-primary stores-card">
          <q-card-section>
            <p class="text-h7 text-weight-bolder q-mb-xs" style="font-size: 17px;">4155</p>
            <p>Total Stores</p>
            </q-card-section>
          </q-card>
        </q-card-section>

        <!-- Temporarily closed sub-card -->
        <q-card-section flat class="text-black">
          <q-card class="my-card bg-info text-primary stores-card">
            <q-card-section>
              <p class="text-weight-bolder q-mb-xs" style="font-size: 17px;">75</p>
              <p>Temporarily Closed</p>
            </q-card-section>
          </q-card>
        </q-card-section>

        <!-- Mikrotik stores sub-card -->
        <q-card-section flat class="text-black">
          <q-card class="my-card bg-info text-primary stores-card">
            <q-card-section>
              <p class="text-weight-bolder q-mb-xs" style="font-size: 17px;">3724</p>
              <p>Mikrotik Stores</p>
            </q-card-section>
          </q-card>
        </q-card-section>

        <!-- Ruijie stores sub-card -->
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
</template>
