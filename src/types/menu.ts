export interface MenuItem {
  name: string;
  description: string;
  path: string;
  status?: 'required' | 'recommended' | 'optional';
  prerequisites?: string[];
  category?: string;
  icon?: JSX.Element;
  skills?: string[];
  children?: MenuItem[];
  customStyle?: string;
  customHoverStyle?: string;
  badges?: Array<{ text: string; color: string; }>;
  disabled?: boolean;
  comingSoon?: boolean;
} 