/**
 * Role-Based Access Control (RBAC)
 *
 * Role hierarchy (highest → lowest):
 *   super_admin > owner > manager > staff > guide > support
 *
 * Each role has a set of permissions it may perform.
 */

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF: 'staff',
  GUIDE: 'guide',
  SUPPORT: 'support',
  CUSTOMER: 'customer',
};

export const PERMISSIONS = {
  // Tenant management (SaaS owner only)
  MANAGE_TENANTS: 'manage_tenants',
  MANAGE_PACKAGES: 'manage_packages',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  VIEW_SAAS_ANALYTICS: 'view_saas_analytics',

  // Tour management
  CREATE_TOUR: 'create_tour',
  EDIT_TOUR: 'edit_tour',
  DELETE_TOUR: 'delete_tour',
  VIEW_TOURS: 'view_tours',

  // Schedule management
  MANAGE_SCHEDULES: 'manage_schedules',
  VIEW_SCHEDULES: 'view_schedules',

  // Booking management
  CREATE_BOOKING: 'create_booking',
  VIEW_BOOKINGS: 'view_bookings',
  MANAGE_BOOKINGS: 'manage_bookings',
  CANCEL_BOOKING: 'cancel_booking',

  // Customer management
  VIEW_CUSTOMERS: 'view_customers',
  MANAGE_CUSTOMERS: 'manage_customers',

  // Staff management
  MANAGE_STAFF: 'manage_staff',
  VIEW_STAFF: 'view_staff',

  // Payments
  VIEW_PAYMENTS: 'view_payments',
  MANAGE_PAYMENTS: 'manage_payments',

  // Analytics
  VIEW_ANALYTICS: 'view_analytics',

  // Reviews
  MANAGE_REVIEWS: 'manage_reviews',

  // Contacts / Support
  VIEW_CONTACTS: 'view_contacts',
  REPLY_CONTACTS: 'reply_contacts',

  // Settings
  MANAGE_SETTINGS: 'manage_settings',
};

/** Map of role → set of permissions */
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.OWNER]: [
    PERMISSIONS.CREATE_TOUR,
    PERMISSIONS.EDIT_TOUR,
    PERMISSIONS.DELETE_TOUR,
    PERMISSIONS.VIEW_TOURS,
    PERMISSIONS.MANAGE_SCHEDULES,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.MANAGE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKING,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.MANAGE_CUSTOMERS,
    PERMISSIONS.MANAGE_STAFF,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.MANAGE_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_REVIEWS,
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.REPLY_CONTACTS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.CREATE_TOUR,
    PERMISSIONS.EDIT_TOUR,
    PERMISSIONS.VIEW_TOURS,
    PERMISSIONS.MANAGE_SCHEDULES,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.MANAGE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKING,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.MANAGE_CUSTOMERS,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_REVIEWS,
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.REPLY_CONTACTS,
  ],

  [ROLES.STAFF]: [
    PERMISSIONS.VIEW_TOURS,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.VIEW_CONTACTS,
  ],

  [ROLES.GUIDE]: [
    PERMISSIONS.VIEW_TOURS,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.VIEW_BOOKINGS,
  ],

  [ROLES.SUPPORT]: [
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.REPLY_CONTACTS,
    PERMISSIONS.VIEW_CUSTOMERS,
  ],

  [ROLES.CUSTOMER]: [
    PERMISSIONS.VIEW_TOURS,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CREATE_BOOKING,
  ],
};

/**
 * Check if a role has a given permission.
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}

/**
 * Assert that a session user has a required permission.
 * Throws a 403 response if not authorized.
 *
 * @param {object} session - decoded JWT payload (must include `role`)
 * @param {string} permission - from PERMISSIONS object
 */
export function requirePermission(session, permission) {
  if (!session || !hasPermission(session.role, permission)) {
    throw new Response(
      JSON.stringify({ error: 'Forbidden: insufficient permissions' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Get all permissions for a role.
 * @param {string} role
 * @returns {string[]}
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}
