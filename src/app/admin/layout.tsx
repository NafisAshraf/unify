import { AppSidebar } from "@/components/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CurrentPage from "@/components/current-page";
import { BookOpen, GraduationCap, LayoutDashboard, Users } from "lucide-react";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@unify.edu",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: "LayoutDashboard",
      isActive: true,
    },
    {
      title: "Students",
      url: "/admin/students",
      icon: "GraduationCap",
    },
    {
      title: "Teachers",
      url: "/admin/teachers",
      icon: "Users",
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: "BookOpen",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar data={data} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <CurrentPage />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto pe-6">
            <DarkModeToggle />
          </div>
        </header>

        <div className="w-[95%] mx-auto pt-3">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
