import { PrimeIcons } from "primeng/api";
import { SidebarGroup, SidebarItem } from "./sidebarItem.model";
import { Role } from "./user.model";

export const SIDEBAR_MENU: SidebarGroup[] = [
    {
        label: 'SIDEBAR.HOME',
        icon: PrimeIcons.HOME,
        route: '/'
    },
    {
        label: 'SIDEBAR.BLOG',
        icon: PrimeIcons.BOOK,
        route: '/blog'
    },

    {
        label: 'SIDEBAR.ADMINISTRATION',
        icon: PrimeIcons.CHART_BAR,
        roles: [Role.ADMIN],
        children: [
            {
                label: 'SIDEBAR.SEO',
                route: '/admin/seo',
                icon: PrimeIcons.SEARCH
            },
            {
                label: 'SIDEBAR.USERS',
                route: '/admin/users',
                icon: PrimeIcons.USERS
            }
        ]
    }
];