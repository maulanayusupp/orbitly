import type { IconName } from '~/utils/iconPaths'

export interface NavItem {
  id: string
  label: string
  to: string
  icon: IconName
}

export const APP_NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', to: '/dashboard', icon: 'home' },
  { id: 'products', label: 'Products', to: '/products', icon: 'box' },
  { id: 'storefront', label: 'Storefront', to: '/store', icon: 'store' },
  { id: 'community', label: 'Community', to: '/community', icon: 'users' },
  { id: 'customers', label: 'Customers', to: '/customers', icon: 'contact' },
  { id: 'marketing', label: 'Marketing & AI', to: '/marketing', icon: 'sparkles' },
  { id: 'analytics', label: 'Analytics', to: '/analytics', icon: 'chart' },
  { id: 'settings', label: 'Settings', to: '/settings', icon: 'settings' },
]

/** The five tabs shown in the mobile bottom bar (PRD §14 journey pages). */
export const MOBILE_NAV_IDS = ['overview', 'products', 'community', 'customers', 'marketing']
