import { boot } from 'quasar/wrappers';
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://wcdssi.apolloglobal.net:8443/auth',
  realm: 'workconnect-test',
  clientId: 'test-frontend',
});

export default boot(({ app, router }) => {
  let isKeycloakInitialized = false;

  keycloak
    .init({ onLoad: 'login-required', checkLoginIframe: false })
    .then((authenticated) => {
      if (authenticated) {
        app.config.globalProperties.$keycloak = keycloak;

        const roles = keycloak.tokenParsed?.realm_access?.roles || [];
        app.config.globalProperties.$userRoles = roles;

        console.log('User authenticated', keycloak.token);
        isKeycloakInitialized = true;

        router.push('/dashboard');
      } else {
        console.warn('User not authenticated');
      }
    })
    .catch((error) => {
      console.error('Keycloak initialization failed:', error);
    });

  router.beforeEach((to, from, next) => {
    if (!isKeycloakInitialized) {
      return next(false);
    }

    if (to.meta.requiresAuth !== false && !keycloak.authenticated) {
      keycloak.login();
      return;
    }

    const userRoles = app.config.globalProperties.$userRoles;
    if (to.meta.requiredRoles && !userRoles.some(role => to.meta.requiredRoles.includes(role))) {
      console.warn('Access denied: Insufficient role');
      next('/unauthorized');
      return;
    }

    next();
  });
});

export { keycloak };
