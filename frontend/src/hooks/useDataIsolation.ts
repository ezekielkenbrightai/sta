import { useCallback, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { OVERSIGHT_ROLES } from '../constants/organizations';

/**
 * Central hook for organization-scoped data filtering.
 *
 * - Oversight roles (govt, admin, auditor, etc.) see ALL data.
 * - Org-scoped roles (trader, bank_officer, insurance_agent, logistics_officer)
 *   see only data belonging to their organization.
 */
export function useDataIsolation() {
  const user = useAuthStore((s) => s.user);

  const isOversight = useMemo(
    () => OVERSIGHT_ROLES.includes(user?.role as typeof OVERSIGHT_ROLES[number] || ''),
    [user?.role],
  );

  const orgId = user?.organization_id ?? null;
  const orgName = user?.organization_name ?? null;
  const orgType = user?.organization_type ?? null;

  /** Filter array by matching a string field against the user's org name. Oversight sees all. */
  const filterByOrgName = useCallback(
    <T,>(data: T[], field: keyof T): T[] => {
      if (isOversight || !orgName) return data;
      return data.filter((item) => item[field] === orgName);
    },
    [isOversight, orgName],
  );

  /** Filter array by matching a string field against the user's org ID. Oversight sees all. */
  const filterByOrgId = useCallback(
    <T,>(data: T[], field: keyof T): T[] => {
      if (isOversight || !orgId) return data;
      return data.filter((item) => item[field] === orgId);
    },
    [isOversight, orgId],
  );

  /** Custom filter — oversight sees all, org-scoped applies predicate. */
  const filterCustom = useCallback(
    <T,>(data: T[], predicate: (item: T) => boolean): T[] => {
      if (isOversight) return data;
      return data.filter(predicate);
    },
    [isOversight],
  );

  return { isOversight, orgId, orgName, orgType, user, filterByOrgName, filterByOrgId, filterCustom };
}
