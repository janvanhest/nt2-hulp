import { NavLink } from 'react-router'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { NavItemConfig } from '@/lib/nav-config'
import type { MobileNavSheetContentProps } from '@/components/NavWithIndicator'

const sheetNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium transition-colors',
    isActive
      ? 'font-semibold text-primary bg-primary/10'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
  )

function SheetNavItem({
  item,
  onNavigate,
}: {
  item: NavItemConfig
  onNavigate: () => void
}) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={sheetNavLinkClassName}
      onClick={onNavigate}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      {item.label}
    </NavLink>
  )
}

export function MobileNavSheetContent({
  mainItems,
  adminItems,
  showAdminNav,
  onNavigate,
}: MobileNavSheetContentProps) {
  return (
    <nav className="mt-6 flex flex-col gap-1" aria-labelledby="sheet-nav-title">
      {mainItems.map((item) => (
        <SheetNavItem
          key={item.to}
          item={item}
          onNavigate={onNavigate}
        />
      ))}
      {showAdminNav && (
        <>
          <Separator className="my-2" />
          {adminItems.map((item) => (
            <SheetNavItem
              key={item.to}
              item={item}
              onNavigate={onNavigate}
            />
          ))}
        </>
      )}
    </nav>
  )
}
