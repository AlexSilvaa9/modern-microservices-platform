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
        label: 'HEADER.CATALOG',
        icon: PrimeIcons.SEARCH,
        route: '/catalog'
    },
    {
        label: 'SIDEBAR.CART',
        icon: PrimeIcons.SHOPPING_CART,
        route: '/cart'
    },


    {
        label: 'SIDEBAR.ADMINISTRATION',
        icon: PrimeIcons.CHART_BAR,
        roles: [Role.ADMIN],
        children: [
            {
                label: 'SIDEBAR.COMMUNICATION',
                route: '/admin/communication',
                icon: PrimeIcons.ENVELOPE
            },
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