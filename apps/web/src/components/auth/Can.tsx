import { usePermissions } from "@/hooks/usePermissions";
import { ReactNode } from "react";

type Props = {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
};

/**
 * Conditional renderer that only displays children if the user has the required permission.
 * An optional fallback can be provided for unauthorized states.
 */
export default function Can({ permission, children, fallback = null }: Props) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}