import type { FunctionalComponent } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface SidebarDataGroup {
  name: string;
  data: (SidebarDataCollapsible | SidebarDataDirect | SidebarDataAction)[];
}

export interface SidebarDataAction {
  type: 'action';
  title: string;
  action: () => void;
  icon: FunctionalComponent;
}

export interface SidebarDataDirect {
  type: 'direct';
  title: string;
  url: RouteLocationRaw;
  icon: FunctionalComponent;
}

export interface SidebarDataCollapsible {
  type: 'collapsible';
  url: RouteLocationRaw;
  title: string;
  icon: FunctionalComponent;
  isActive: boolean;
  items: SidebarDataCollapsibleItem[];
}

export interface SidebarDataCollapsible {
  title: string;
  icon: FunctionalComponent;
  isActive: boolean;
  items: SidebarDataCollapsibleItem[];
}

export interface SidebarDataCollapsibleItem {
  title: string;
  icon?: FunctionalComponent;
  url: RouteLocationRaw;
}
