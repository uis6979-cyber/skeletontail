import { getMe, User } from "@/services/auth.api";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch the current authenticated user session.
 * Results are cached globally to provide consistent user state across the application.
 */
export function useMe() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: getMe,
  });
}