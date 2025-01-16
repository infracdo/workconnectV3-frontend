<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        {{ errorState.errorCode }} <!-- Display error code -->
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ errorState.errorMessage }} <!-- Display error message -->
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/dashboard"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
import { getErrorState } from 'src/utils/errorHandler';

// Fetch error state for error codes and messages
const errorState = getErrorState();
</script>
