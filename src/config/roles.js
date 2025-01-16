export const rolesConfig = {
  'down-circuits': ['admin', 'GROUP_APOLLO_OPERATIONS'],
  'stores': ['admin', 'GROUP_PSC_USERS'],
  'circuit-provider-report': ['admin', 'GROUP_APOLLO_PROD_SUPPORT'],
  'cliqq-wifi-report': ['admin', 'GROUP_PSC_USERS'],
  'store-status-report': ['admin', 'GROUP_APOLLO_PROD_SUPPORT'],
  'zabbix-report': ['admin', 'GROUP_APOLLO_PROD_SUPPORT'],
  'provisioning': ['admin', 'GROUP_APOLLO_OPERATIONS'],
  'activity-log': ['admin', 'GROUP_APOLLO_OPERATIONS', 'GROUP_APOLLO_PROD_SUPPORT'],
  'circuits-log': ['admin', 'GROUP_APOLLO_OPERATIONS', 'GROUP_APOLLO_PROD_SUPPORT', 'GROUP_APOLLO_USER']
}

export const allRoles = [
  'admin',
  'GROUP_PSC_USERS',
  'GROUP_APOLLO_OPERATIONS',
  'GROUP_APOLLO_PROD_SUPPORT',
  'GROUP_APOLLO_USER'
];
