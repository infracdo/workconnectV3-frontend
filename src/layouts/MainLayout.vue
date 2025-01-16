<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="text-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          workconnect
        </q-toolbar-title>

        <div v-if="$keycloak.authenticated">
          {{ $keycloak.tokenParsed.preferred_username }}
          <q-btn-dropdown
            flat round dense
            icon="account_circle"
            size="20px"
          >
            <div class="column no-wrap q-pa-md">
              <div class="row items-center">
                <q-icon
                  name="account_circle"
                  size="40px"
                />
                <div class="q-ml-xs">
                  <p class="q-ma-none">{{ $keycloak.tokenParsed.preferred_username }}</p>
                  <p class="q-ma-none">{{ $keycloak.tokenParsed.email }}</p>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <div class="row items-center">
                <q-btn flat class="q-pa-none" @click="logout">
                  <q-icon
                    name="logout"
                    size="40px"
                  />
                  <div class="q-ml-xs">
                    <p class="q-ma-none">Logout</p>
                  </div>
                </q-btn>
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>

        <EssentialLink
          v-for="link in filteredLinksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { keycloak } from 'src/boot/keycloak'

const linksList = [
  {
    title: 'Down Dashboard',
    icon: 'dashboard',
    url: '/dashboard',
    requiredRoles: ['admin', 'GROUP_PSC_USERS', 'GROUP_APOLLO_OPERATIONS', 'GROUP_APOLLO_PROD_SUPPORT']
  },
  {
    title: 'Down Circuits',
    icon: 'router',
    url: '/down-circuits',
    requiredRoles: ['admin', 'GROUP_APOLLO_OPERATIONS']
  },
  {
    title: 'Stores',
    icon: 'location_on',
    url: '/stores',
    requiredRoles: ['admin', 'GROUP_PSC_USERS']
  },
  {
    title: 'Circuit Provider Report',
    icon: 'trending_up',
    url: '/circuit-provider-report',
    requiredRoles: ['admin', 'GROUP_APOLLO_PROD_SUPPORT']
  },
  {
    title: 'Cliqq Wifi Report',
    icon: 'trending_up',
    url: '/cliqq-wifi-report',
    requiredRoles: ['admin', 'GROUP_PSC_USERS']
  },
  {
    title: 'Store Status Report',
    icon: 'summarize',
    url: '/store-status-report',
    requiredRoles: ['admin', 'GROUP_APOLLO_PROD_SUPPORT']
  },
  {
    title: 'Zabbix Report',
    icon: 'summarize',
    url: '/zabbix-report',
    requiredRoles: ['admin', 'GROUP_APOLLO_PROD_SUPPORT']
  },
  {
    title: 'Provisioning',
    icon: 'add_circle',
    url: '/provisioning',
    requiredRoles: ['admin', 'GROUP_APOLLO_OPERATIONS']
  },
  {
    title: 'Activity Log',
    icon: 'list',
    url: '/activity-log',
    requiredRoles: ['admin', 'GROUP_APOLLO_PROD_SUPPORT', 'GROUP_APOLLO_OPERATIONS']
  },
  {
    title: 'Circuits Log',
    icon: 'route',
    url: '/circuits-log',
    requiredRoles: ['admin', 'GROUP_APOLLO_PROD_SUPPORT', 'GROUP_APOLLO_OPERATIONS']
  }
]

const leftDrawerOpen = ref(false)

const filteredLinksList = linksList.filter(link => {
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  return !link.requiredRoles || link.requiredRoles.some(role => userRoles.includes(role));
});

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  keycloak.logout({
    redirectUri: window.location.origin
  })
}
</script>
