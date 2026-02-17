import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  FileCheck,
  FileText,
  Home,
  List,
  Settings,
} from 'lucide-react'
import type { AppPath } from '@/lib/routes'
import { ROUTES } from '@/lib/routes'

export interface NavItemConfig {
  to: AppPath
  label: string
  icon: LucideIcon
  end?: boolean
  adminOnly?: boolean
}

/** Single source of truth for main nav items. Filter by adminOnly in layout. */
export const NAV_ITEMS: NavItemConfig[] = [
  { to: ROUTES.home, label: 'Home', icon: Home, end: true },
  { to: ROUTES.oefenen, label: 'Oefenen', icon: BookOpen },
  { to: ROUTES.nakijk, label: 'Nakijkmodel', icon: FileCheck },
  { to: ROUTES.beheer, label: 'Beheer', icon: Settings, adminOnly: true },
  {
    to: ROUTES.beheerWerkwoorden,
    label: 'Werkwoorden',
    icon: List,
    adminOnly: true,
  },
  {
    to: ROUTES.beheerZinnen,
    label: 'Zinnen',
    icon: FileText,
    adminOnly: true,
  },
]
