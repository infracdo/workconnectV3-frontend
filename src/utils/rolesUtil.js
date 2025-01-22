import { keycloak } from "src/boot/keycloak";
import { rolesConfig } from "src/config/rolesConfig";

export function hasRoleAccess(componentName) {
  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const config = rolesConfig[componentName] || [];

  if (!config) return true;

  if (config.deny) {
    return !config.deny.some(deniedRole => userRoles.includes(deniedRole));
  }

  if (config.allow) {
    return config.allow.some(allowedRole => userRoles.includes(allowedRole));
  }

  return true;
}
