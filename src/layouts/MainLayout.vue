<template>
  <q-layout view="hHh LpR fFf">
    <!-- Navbar -->
    <q-header elevated class="text-black">
      <q-toolbar>

        <!-- Toggle button for left drawer -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- Navbar title -->
        <q-toolbar-title>
          workconnect
        </q-toolbar-title>

        <!-- Display username based from keycloak -->
        <div v-if="$keycloak.authenticated">
          {{ $keycloak.tokenParsed.preferred_username }}
          <!-- User account options -->
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
                <!-- Display username and email of user based from keycloak -->
                <div class="q-ml-xs">
                  <p class="q-ma-none">{{ $keycloak.tokenParsed.preferred_username }}</p>
                  <p class="q-ma-none">{{ $keycloak.tokenParsed.email }}</p>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <!-- Logout button that redirects user to the keycloak login page -->
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

    <!-- Left drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>

        <!-- Navigation links for pages -->
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
import { rolesConfig, allRoles } from 'src/config/roles'

// Navigation links for left drawer
const linksList = [
  {
    title: 'Down Dashboard',
    icon: 'dashboard',
    url: '/',
    requiredRoles: allRoles
  },
  {
    title: 'Down Circuits',
    icon: 'router',
    url: '/down-circuits',
    requiredRoles: rolesConfig['down-circuits']
  },
  {
    title: 'Stores',
    icon: 'location_on',
    url: '/stores',
    requiredRoles: rolesConfig['stores']
  },
  {
    title: 'Circuit Provider Report',
    icon: 'trending_up',
    url: '/circuit-provider-report',
    requiredRoles: rolesConfig['circuit-provider-report']
  },
  {
    title: 'Cliqq Wifi Report',
    icon: 'trending_up',
    url: '/cliqq-wifi-report',
    requiredRoles: rolesConfig['cliqq-wifi-report']
  },
  {
    title: 'Store Status Report',
    icon: 'summarize',
    url: '/store-status-report',
    requiredRoles: rolesConfig['store-status-report']
  },
  {
    title: 'Zabbix Report',
    icon: 'summarize',
    url: '/zabbix-report',
    requiredRoles: rolesConfig['zabbix-report']
  },
  {
    title: 'Provisioning',
    icon: 'add_circle',
    url: '/provisioning',
    requiredRoles: rolesConfig['provisioning']
  },
  {
    title: 'Activity Log',
    icon: 'list',
    url: '/activity-log',
    requiredRoles: rolesConfig['activity-log']
  },
  {
    title: 'Circuits Log',
    icon: 'route',
    url: '/circuits-log',
    requiredRoles: rolesConfig['circuits-log']
  }
]

const leftDrawerOpen = ref(false)

// Display navigation links depending on the role/s set to user
const filteredLinksList = linksList.filter(link => {
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  return !link.requiredRoles || link.requiredRoles.some(role => userRoles.includes(role));
});

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// logout function to redirect user to the keycloak login page
function logout() {
  keycloak.logout({
    redirectUri: window.location.origin
  })
}
</script>
