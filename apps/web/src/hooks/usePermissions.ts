import { useCallback, useMemo } from "react";
import { useMe } from "./useMe";

/**
 * Custom hook to verify user permissions based on the current authenticated session.
 * Provides memoized helpers for single and bulk permission checks.
 */
export function usePermissions() {
  const { data: me } = useMe();

  const permissions = useMemo(() => me?.permissionsModule || [], [me?.permissionsModule]);

  /**
   * Verifies if the current user has the specified permission string (e.g., 'users.view').
   */
  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );

  /**
   * Verifies if the current user possesses at least one of the permissions in the provided list.
   */
  const hasAny = useCallback(
    (list: string[]) => list.some((p) => permissions.includes(p)),
    [permissions]
  );

  return useMemo(() => ({
    permissions,
    hasPermission,
    hasAny,
  }), [permissions, hasPermission, hasAny]);
}