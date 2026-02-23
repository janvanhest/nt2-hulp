import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { NavItemConfig } from '@/lib/nav-config'

/** Shared props for nav components that receive main/admin items and visibility. */
interface NavItemsProps {
  mainItems: NavItemConfig[]
  adminItems: NavItemConfig[]
  showAdminNav: boolean
}

export type NavWithIndicatorProps = NavItemsProps

export interface MobileNavSheetContentProps extends NavItemsProps {
  onNavigate: () => void
}

const navLinkBaseClassName =
  'relative z-10 inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    navLinkBaseClassName,
    isActive
      ? 'font-semibold text-primary'
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

export function NavWithIndicator({
  mainItems,
  adminItems,
  showAdminNav,
}: NavWithIndicatorProps) {
  /** Inset (px) for the active nav indicator; affects size of the grey pill. */
  const INDICATOR_INSET_X = 2
  const INDICATOR_INSET_Y = 2

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
      left: linkRect.left - navRect.left + INDICATOR_INSET_X,
      width: Math.max(0, linkRect.width - INDICATOR_INSET_X * 2),
    })
  }, [activeIndex, location.pathname, mainItems.length, adminItems.length, showAdminNav, INDICATOR_INSET_X, INDICATOR_INSET_Y])

  let idx = 0
  return (
    <nav ref={navRef} className="relative flex min-w-0 flex-1 items-center gap-2">
      {activeIndex >= 0 && indicator.width > 0 && (
        <span
          className="absolute z-0 rounded-lg bg-zinc-200 transition-[left,width] duration-200 ease-out dark:bg-zinc-600"
          style={{
            left: indicator.left,
            width: indicator.width,
            top: '50%',
            transform: 'translateY(-50%)',
            height: `calc(100% - ${INDICATOR_INSET_Y * 2}px)`,
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
