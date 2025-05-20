import { MenuItem } from "@/types/sidebar";

export const menuItems: MenuItem[] = [
  {
    title: "Home",
    icon: "bi-house-door",
    path: "/",
  },
  {
    title: "Animais",
    icon: "bi-piggy-bank",
    path: "/animais",
  },
  {
    title: "Medicação",
    icon: "bi-capsule",
    submenu: [
      {
        title: "Gerenciar Medicamentos",
        path: "/dashboard/medicamento",
      },
      {
        title: "Efetuar Medicação",
        path: "/dashboard/medicacao/efetuar",
      },
      {
        title: "Histórico",
        path: "/dashboard/medicacao/historico",
      },
    ],
  },
  {
    title: "Vacinação",
    icon: "bi-shield-plus",
    path: "/vacinacao",
  },
  {
    title: "Pessoas",
    icon: "bi-people",
    submenu: [
      {
        title: "Gerenciar Pessoas",
        path:"/dashboard/pessoas/cadastro",
      },
      {
        title: "Gerenciar adotantes",
        path: "/dashboard/pessoas/adotante",
      },
      {
        title: "Efetuar doacao",
        path: "/dashboard/pessoas/doacao",
      },
    ],
  },
  {
    title: "Produtos",
    icon: "bi-plus-circle",
    submenu: [
      {
        title: "Gerenciar Produtos",
        path: "/dashboard/produtos/cadastro",
      },
      {
        title: "Efetuar Acerto de Estoque",
        path: "/dashboard/produtos/acerto",
      },
    ],
  },
  {
    title: "Estoque",
    icon: "bi-box",
    path: "/estoque",
  },
];
