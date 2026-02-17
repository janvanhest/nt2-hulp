import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { NavItemConfig } from '@/lib/nav-config'

const navLinkBaseClassName =
  'relative z-10 inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    navLinkBaseClassName,
    isActive
      ? 'font-semibold text-primary'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
  )

const sheetNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-2.5 rounded-lg px-4 py-3 text-base font-medium transition-colors',
    isActive
      ? 'font-semibold text-primary bg-primary/10'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
  )

function NavItem({
  item,
  index,
  refCallback,
}: {
  item: NavItemConfig
  index: number
  refCallback: (i: number) => (el: HTMLAnchorElement | null) => void
}) {
  const Icon = item.icon
  return (
    <NavLink
      ref={refCallback(index)}
      to={item.to}
      end={item.end}
      className={navLinkClassName}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      {item.label}
    </NavLink>
  )
}

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

export function NavWithIndicator({
  mainItems,
  adminItems,
  showAdminNav,
}: {
  mainItems: NavItemConfig[]
  adminItems: NavItemConfig[]
  showAdminNav: boolean
}) {
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const location = useLocation()
  const allItems = [...mainItems, ...(showAdminNav ? adminItems : [])]
  const activeIndex = (() => {
    const path = location.pathname
    for (let i = allItems.length - 1; i >= 0; i--) {
      const item = allItems[i]
      if (item.end && item.to === '/') {
        if (path === '/') return i
        continue
      }
      if (path === item.to || path.startsWith(item.to + '/')) return i
    }
    return -1
  })()
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const setRef = (i: number) => (el: HTMLAnchorElement | null) => {
    linkRefs.current[i] = el
  }

  useLayoutEffect(() => {
    if (activeIndex < 0 || !navRef.current) return
    const el = linkRefs.current[activeIndex]
    if (!el) return
    const navRect = navRef.current.getBoundingClientRect()
    const linkRect = el.getBoundingClientRect()
    setIndicator({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
    })
  }, [activeIndex, location.pathname, mainItems.length, adminItems.length, showAdminNav])

  let idx = 0
  return (
    <nav ref={navRef} className="relative flex flex-1 items-center gap-2">
      {activeIndex >= 0 && indicator.width > 0 && (
        <span
          className="absolute z-0 rounded-lg bg-primary/20 ring-1 ring-primary/40 transition-[left,width] duration-200 ease-out"
          style={{
            left: indicator.left,
            width: indicator.width,
            top: '50%',
            transform: 'translateY(-50%)',
            height: 'calc(100% - 8px)',
          }}
          aria-hidden
        />
      )}
      {mainItems.map((item) => (
        <NavItem key={item.to} item={item} index={idx++} refCallback={setRef} />
      ))}
      {showAdminNav && (
        <>
          <Separator orientation="vertical" className="mx-1 h-5" />
          {adminItems.map((item) => (
            <NavItem key={item.to} item={item} index={idx++} refCallback={setRef} />
          ))}
        </>
      )}
    </nav>
  )
}

export function MobileNavSheetContent({
  mainItems,
  adminItems,
  showAdminNav,
  onNavigate,
}: {
  mainItems: NavItemConfig[]
  adminItems: NavItemConfig[]
  showAdminNav: boolean
  onNavigate: () => void
}) {
  return (
    <div className="animate-in fade-in duration-200 delay-75">
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
    </div>
  )
}
