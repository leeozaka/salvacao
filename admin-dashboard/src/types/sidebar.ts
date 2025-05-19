export interface OpenSubmenus {
  produtos: boolean;
  medicacao: boolean;
  pessoas: boolean;
  [key: string]: boolean; // Permite adicionar mais submenus no futuro
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
