export const PERMISSIONS = {
  MANAGE_ADMINS: 'manage_admins',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_ORDERS: 'manage_orders',
  MANAGE_CONTENT: 'manage_content',
  MANAGE_SETTINGS: 'manage_settings',
}

export const ROLE_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  admin: [PERMISSIONS.MANAGE_PRODUCTS, PERMISSIONS.MANAGE_ORDERS, PERMISSIONS.MANAGE_CONTENT],
  catalog_manager: [PERMISSIONS.MANAGE_PRODUCTS],
  order_manager: [PERMISSIONS.MANAGE_ORDERS],
  content_manager: [PERMISSIONS.MANAGE_CONTENT],
}

export const hasPermission = (adminUser, permission) => {
  if (!permission) return Boolean(adminUser?.active)
  if (!adminUser?.active) return false
  const rolePermissions = ROLE_PERMISSIONS[adminUser.role] || []
  const directPermissions = Array.isArray(adminUser.permissions) ? adminUser.permissions : []
  return rolePermissions.includes(permission) || directPermissions.includes(permission)
}
