import { PrimeIcons } from "primeng/api";
import { SidebarGroup, SidebarItem } from "./sidebarItem.model";
import { Role } from "./user.model";

export const SIDEBAR_MENU: SidebarGroup[] = [
    {
        label: 'SIDEBAR.HOME',
        icon: PrimeIcons.HOME,
        route: '/home'
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
        label: 'SIDEBAR.ORDERS',
        icon: PrimeIcons.RECEIPT,
        route: '/orders/history',
    },


    {
        label: 'SIDEBAR.ADMINISTRATION',
        icon: PrimeIcons.CHART_BAR,
        roles: [Role.ADMIN],
        children: [
            {
                label: 'SIDEBAR.ADMINISTRATION.COMMUNICATION',
                route: '/admin/communication',
                icon: PrimeIcons.ENVELOPE
            },
            {
                label: 'SIDEBAR.ADMINISTRATION.SEO',
                route: '/admin/seo',
                icon: PrimeIcons.SEARCH
            },
            {
                label: 'SIDEBAR.ADMINISTRATION.USERS',
                route: '/admin/users',
                icon: PrimeIcons.USERS
            },
                        {
                label: 'SIDEBAR.ADMINISTRATION.ORDERS',
                route: '/admin/orders',
                icon: PrimeIcons.BOOK
            }
        ]
    }
];