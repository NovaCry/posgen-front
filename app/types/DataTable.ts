import type { ButtonVariants } from '@/components/ui/button';
import type { FunctionalComponent, VNode } from 'vue';

export interface ImageCell {
  type: 'image';
  uri: string;
  alt: string;
}

export interface TextCell {
  type: 'text';
  data: string;
}

export interface BadgeCell {
  type: 'badge';
  data: string;
  background: string;
  color: string;
}

export interface ImageGroup {
  type: 'image-group';
  data: ImageCell[];
}

export interface MenuCell {
  type: 'menu';
  data: MenuGroup[];
}

export interface ButtonCell {
  type: 'button';
  text: string;
  action: () => void;
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
}

export interface IconCell {
  type: 'icon';
  component: FunctionalComponent | VNode;
}

export interface MenuGroup {
  type: 'group';
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  type: 'item';
  icon: FunctionalComponent;
  dialog?: boolean;
  text: string;
  action: () => void;
}

export type Cell =
  | TextCell
  | ImageCell
  | ImageGroup
  | BadgeCell
  | MenuCell
  | ButtonCell
  | IconCell;

export type TableData = Record<string, string | Cell[]>;
