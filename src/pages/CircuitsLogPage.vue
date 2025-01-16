<template>
  <q-page padding>
    <div v-if="hasAccess">
      <p>Circuits Log Page</p>
    </div>

    <div v-else>
      <p>You do not have access to this page.</p>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { keycloak } from 'src/boot/keycloak';

const hasAccess = computed(() => {
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  return userRoles.includes('admin') || userRoles.includes('GROUP_APOLLO_PROD_SUPPORT') || userRoles.includes('GROUP_APOLLO_OPERATIONS');
});
</script>
