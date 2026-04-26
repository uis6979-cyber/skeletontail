import { SidebarItem } from "@/config/sidebar.config";

export const filterSidebarByPermissions = (
  items: SidebarItem[],
  permissions: string[]
): SidebarItem[] => {
  return items
    .filter((item) => {
      if (!item.permission) return true;
      return permissions.includes(item.permission);
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? item.children.filter(
            (child) =>
              !child.permission ||
              permissions.includes(child.permission)
          )
        : undefined,
    }));
};