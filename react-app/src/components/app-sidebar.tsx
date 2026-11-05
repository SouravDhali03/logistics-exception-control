"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { InboxIcon, Activity01Icon, Clock01Icon, AiLearningIcon, Analytics01Icon, Settings05Icon, ShipIcon, TruckIcon } from "@hugeicons/core-free-icons"

const exceptraLogoUrl = `${import.meta.env.BASE_URL}exceptra-logo.png`

const data = {
  user: {
    name: "Sourav Dhali",
    email: "coordinator@exceptra.app",
    avatar: "",
  },
  teams: [
    {
      name: "Exceptra Control",
      logo: (
        <span className="relative flex size-8 shrink-0 overflow-hidden rounded-lg">
          <img src={exceptraLogoUrl} alt="Exceptra" className="size-8 object-contain" />
        </span>
      ),
      plan: "Operations workspace",
    },
    {
      name: "North America",
      logo: (
        <HugeiconsIcon icon={ShipIcon} strokeWidth={2} />
      ),
      plan: "Regional workspace",
    },
    {
      name: "Europe",
      logo: (
        <HugeiconsIcon icon={TruckIcon} strokeWidth={2} />
      ),
      plan: "Regional workspace",
    },
  ],
  navMain: [
    {
      title: "Exception inbox",
      url: "#inbox",
      icon: (
        <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />
      ),
      isActive: true,
    },
    {
      title: "Live monitoring",
      url: "#live-monitoring",
      icon: (
        <HugeiconsIcon icon={Activity01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Decision history",
      url: "#decision-history",
      icon: (
        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Learning review",
      url: "#learning-review",
      icon: (
        <HugeiconsIcon icon={AiLearningIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Reports",
      url: "#reports",
      icon: (
        <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Settings",
      url: "#settings",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
