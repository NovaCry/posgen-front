import type { RouteLocationRaw } from 'vue-router';

export interface SidebarDataGroup {
  name: string;
  data: (SidebarDataCollapsible | SidebarDataDirect | SidebarDataAction)[];
}

export interface SidebarDataAction {
  type: 'action';
  title: string;
  action: () => void;
  icon: string;
}

export interface SidebarDataDirect {
  type: 'direct';
  title: string;
  url: RouteLocationRaw;
  icon: string;
}

export interface SidebarDataCollapsible {
  type: 'collapsible';
  url: RouteLocationRaw;
  title: string;
  icon: string;
  isActive: boolean;
  items: SidebarDataCollapsibleItem[];
}

export interface SidebarDataCollapsible {
  title: string;
  icon: string;
  isActive: boolean;
  items: SidebarDataCollapsibleItem[];
}

export interface SidebarDataCollapsibleItem {
  title: string;
  icon?: string;
  url: RouteLocationRaw;
}
