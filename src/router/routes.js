import { setErrorState } from 'src/utils/errorHandler'
import { rolesConfig } from 'src/config/roles';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/DownDashboardPage.vue'),
      },

      {
        path: 'down-circuits',
        component: () => import('pages/DownCircuitsPage.vue'),
        meta: { requiredRoles: rolesConfig['down-circuits'] }
      },

      {
        path: 'stores',
        component: () => import('pages/StoresPage.vue'),
        meta: { requiredRoles: rolesConfig['stores'] }
      },

      {
        path: 'circuit-provider-report',
        component: () => import('pages/CircuitProviderReportPage.vue'),
        meta: { requiredRoles: rolesConfig['circuit-provider-report'] }
      },

      {
        path: 'cliqq-wifi-report',
        component: () => import('pages/CliqqWifiReportPage.vue'),
        meta: { requiredRoles: rolesConfig['cliqq-wifi-report'] }
      },

      {
        path: 'store-status-report',
        component: () => import('src/pages/StoreStatusReportPage.vue'),
        meta: { requiredRoles: rolesConfig['store-status-report'] }
      },

      {
        path: 'zabbix-report',
        component: () => import('pages/ZabbixReportPage.vue'),
        meta: { requiredRoles: rolesConfig['zabbix-report'] }
      },

      {
        path: 'provisioning',
        component: () => import('pages/ProvisioningPage.vue'),
        meta: { requiredRoles: rolesConfig['provisioning'] }
      },

      {
        path: 'activity-log',
        component: () => import('pages/ActivityLogPage.vue'),
        meta: { requiredRoles: rolesConfig['activity-log'] }
      },

      {
        path: 'circuits-log',
        component: () => import('pages/CircuitsLogPage.vue'),
        meta: { requiredRoles: rolesConfig['circuits-log'] }
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it

  // Display 404 Not Found Error Page if the user navigates to the non-existent page
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorPage.vue'),
    beforeEnter: (to, from, next) => {
      setErrorState('404', 'Page Not Found');
      next();
    }
  },

  // Display 403 Unauthorized Page if the user doesn't have the required role to access the page
  {
    path: '/unauthorized',
    component: () => import('src/pages/ErrorPage.vue'),
    beforeEnter: (to, from, next) => {
      setErrorState('403', 'You do not have access to this page.');
      next();
    }
  }
]

export default routes
