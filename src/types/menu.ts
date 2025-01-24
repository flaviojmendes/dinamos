export interface MenuItem {
  path: string;
  name: string;
  description: string;
  children?: MenuItem[];
  disabled?: boolean;
  comingSoon?: boolean;
} 