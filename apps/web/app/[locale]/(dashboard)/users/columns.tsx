import Button from "@/components/ui/button/Button";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { User } from "./types";

export const getUserColumns = (
    t: any,
    onEdit: (user: User) => void,
    onToggleStatus: (user: User) => void
): GridColDef[] => [
        {
            field: "firstName",
            headerName: t("labels.firstName"),
            flex: 1,
        },
        {
            field: "lastName",
            headerName: t("labels.lastName"),
            flex: 1,
        },
        {
            field: "email",
            headerName: t("labels.email"),
            flex: 1,
        },

        {
            field: "isActive",
            headerName: t("labels.status"),
            width: 140,
            renderCell: (params: GridRenderCellParams) => {
                const active = params.row.isActive;

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {active ? t("status.active") : t("status.inactive")}
                    </span>
                );
            },
        },

        {
            field: "actions",
            headerName: t("labels.actions"),
            width: 220,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const user = params.row;

                return (
                    <div className="flex gap-2 items-center">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(user)}
                        >
                            {t("actions.edit")}
                        </Button>

                        <Button
                            size="sm"
                            variant={user.isActive ? "outline" : "primary"}
                            onClick={() => onToggleStatus(user)}
                        >
                            {user.isActive
                                ? t("actions.disable")
                                : t("actions.enable")}
                        </Button>
                    </div>
                );
            },
        },
    ];