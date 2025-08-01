import type { RouteLocationRaw } from 'vue-router';

export interface CommandRaw {
  id: string;
  name: string;
  icon?: string;
}

export interface LinkCommand extends CommandRaw {
  type: 'link';
  href: RouteLocationRaw;
}

export interface ActionCommand extends CommandRaw {
  type: 'action';
  action: () => void;
}

export type Command = LinkCommand | ActionCommand;

export interface CommandGroup {
  title: string;
  commands: Command[];
}
