import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, UsersRound, Calendar, Bell, UserRoundPlusIcon, User, UserRound} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },

    
    {
        title: 'Assignee',
        href: '/assignee',
        icon: UserRoundPlusIcon,
    },

    {
        title: 'Projects',
        href: '/projects',
        icon: Folder,
    },

    {
        title: 'Members',
        href: '/members',
        icon: UserRound,
    },

    {
        title: 'Teams',
        href: '/teams',
        icon: UsersRound,
    },

    {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
    },

    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },


];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
               
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
