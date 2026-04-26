import {
  GridIcon,
  ListIcon,
  UserCircleIcon,
} from "@/icons";

export type SidebarItem = {
  name: string;
  icon: any;
  path?: string;
  permission?: string; // 🔥 CAMBIO
  children?: SidebarItem[];
};

export const sidebarConfig: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: GridIcon,
    path: "/",
    permission: "dashboard.view",
  },

  {
    name: "Users",
    icon: UserCircleIcon,
    path: "/users",
    permission: "users.view",
  },

  {
    name: "Management",
    icon: ListIcon,
    children: [
      {
        name: "Projects",
        path: "/projects",
        permission: "projects.view",
      },
      {
        name: "Tasks",
        path: "/tasks",
        permission: "tasks.view",
      },
    ],
  },
];