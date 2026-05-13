import { Role } from "./user.model";

export interface SidebarItem {
    label: string;
    icon?: string;
    route?: string;
}
export interface SidebarGroup {
    label: string;
    icon?: string;
    route?: string;
    children?: SidebarItem[];
    roles?: Role[];
}