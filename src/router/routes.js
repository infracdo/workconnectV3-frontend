const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue',),
    children: [
      {
        path: 'dashboard',
        component: () => import('src/pages/DownDashboardPage.vue'),
        meta: { requiredRoles: ['GROUP_PSC_USERS'] }
      },

      {
        path: 'down-circuits',
        component: () => import('pages/DownCircuitsPage.vue'),
        meta: { requiredRoles: ['GROUP_PSC_USERS'] }
      },

      {
        path: 'stores',
        component: () => import('pages/StoresPage.vue'),
        meta: { requiredRoles: ['GROUP_APOLLO_OPERATIONS'] }
      },

      {
        path: 'circuit-provider-report',
        component: () => import('pages/CircuitProviderReportPage.vue'),
        meta: { requiredRoles: ['GROUP_APOLLO_PROD_SUPPORT'] }
      },

      {
        path: 'cliqq-wifi-report',
        component: () => import('pages/CliqqWifiReportPage.vue')
      },

      {
        path: 'store-status-report',
        component: () => import('src/pages/StoreStatusReportPage.vue')
      },

      {
        path: 'zabbix-report',
        component: () => import('pages/ZabbixReportPage.vue')
      },

      {
        path: 'provisioning',
        component: () => import('pages/ProvisioningPage.vue')
      },

      {
        path: 'activity-log',
        component: () => import('pages/ActivityLogPage.vue')
      },

      {
        path: 'circuits-log',
        component: () => import('pages/CircuitsLogPage.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
