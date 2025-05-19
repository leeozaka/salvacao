export interface OpenSubmenus {
  [key: string]: boolean;
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SubMenuItem {
  title: string;
  path: string;
}

export interface MenuItem {
  title: string;
  icon: string;
  path?: string;
  submenu?: SubMenuItem[];
}
