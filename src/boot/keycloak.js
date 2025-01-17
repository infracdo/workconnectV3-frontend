import { boot } from 'quasar/wrappers';
import Keycloak from 'keycloak-js';

// Create a Keycloak instance and define the Keycloak configurations
const keycloak = new Keycloak({
  url: process.env.VITE_KEYCLOAK_URL, // Reads Keycloak configurations from the .env file
  realm: process.env.VITE_KEYCLOAK_REALM, // Reads Keycloak configurations from the .env file
  clientId: process.env.VITE_KEYCLOAK_CLIENT_ID, // Reads Keycloak configurations from the .env file
});

export default boot(({ app, router }) => {
  let isKeycloakInitialized = false;

  keycloak
    .init({ onLoad: 'login-required', checkLoginIframe: false })
    .then((authenticated) => {
      if (authenticated) {
        // Store the Keycloak instance globally for accessibility
        app.config.globalProperties.$keycloak = keycloak;

        // Extract user roles from the token
        const roles = keycloak.tokenParsed?.realm_access?.roles || [];
        app.config.globalProperties.$userRoles = roles; // Set the extracted user roles globally for accessibility

        // Logs the token to the console if the user is authenticated
        console.log('User authenticated', keycloak.token);
        isKeycloakInitialized = true; // Initialize to true

        // Redirect the user to the dashboard page
        router.push('/dashboard');
      } else {
        // Logs if the user is not authenticated
        console.warn('User not authenticated');
      }
    })
    .catch((error) => {
      // Logs if there is an error when initializing Keycloak
      console.error('Keycloak initialization failed:', error);
    });

  // Runs before every route change
  router.beforeEach((to, from, next) => {
    // If Keycloak is not initialized, block navigation
    if (!isKeycloakInitialized) {
      return next(false);
    }

    // If the route requires authentication and the user is not authenticated, Keycloak prompts the user to login
    if (to.meta.requiresAuth !== false && !keycloak.authenticated) {
      keycloak.login();
      return;
    }

    // If there is a defined role in the route and the user doesn't have the required role, it redirects the user to the Unauthorized page
    const userRoles = app.config.globalProperties.$userRoles;
    if (to.meta.requiredRoles && !userRoles.some(role => to.meta.requiredRoles.includes(role))) {
      console.error("Access denied: User doesn't have the required role."); // Logs if the user doesn't have the required role/s
      next('/unauthorized'); // Redirect to the /unauthorized route
      return;
    }

    // If all conditions has been passed, it allows navigation to proceed
    next();
  });
});

export { keycloak };
