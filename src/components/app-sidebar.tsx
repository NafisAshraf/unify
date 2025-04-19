"use client";

import * as React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
};

export function AppSidebar({
  data,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: {
    user: {
      name: string;
      email: string;
      avatar: string;
    };
    navMain: {
      title: string;
      url: string;
      icon: LucideIcon | string;
      isActive?: boolean;
    }[];
  };
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="font-semibold text-xl">Unify</div>
                {/* <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold ">Unify</span>
                  <span className="text-xs">v1.0.0</span>
                </div> */}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            icon:
              typeof item.icon === "string" && item.icon in iconMap
                ? iconMap[item.icon as keyof typeof iconMap]
                : item.icon,
          }))}
          itemsHeading="Admin Panel"
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
