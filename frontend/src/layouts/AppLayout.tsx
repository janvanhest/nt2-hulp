import { useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { useLogoutMutation } from '@/hooks/useAuthMutations'
import { useMe } from '@/hooks/useMe'
import { isAdmin } from '@/lib/api'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, type NavItemConfig } from '@/lib/nav-config'
import { ROUTES } from '@/lib/routes'

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

function NavWithIndicator({
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
          className="absolute z-0 rounded-lg bg-primary/20 ring-1 ring-primary/40 transition-all duration-200 ease-out"
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

export function AppLayout() {
  const { token, clearToken } = useAuth()
  const { data: user, isPending, isError } = useMe()
  const logoutMutation = useLogoutMutation()

  if (!token) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (isError) {
    clearToken()
    return <Navigate to={ROUTES.login} replace />
  }

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Laden…</p>
      </div>
    )
  }

  const mainItems = NAV_ITEMS.filter((i) => !i.adminOnly)
  const adminItems = NAV_ITEMS.filter((i) => i.adminOnly)
  const showAdminNav = isAdmin(user) && adminItems.length > 0

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b bg-card">
        <div className="flex h-14 items-center gap-4 px-6">
          <Link
            to={ROUTES.home}
            className="font-semibold text-foreground hover:underline"
          >
            NT-2
          </Link>
          <NavWithIndicator
            mainItems={mainItems}
            adminItems={adminItems}
            showAdminNav={showAdminNav}
          />
          {user != null && (
            <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5">
              <span className="text-foreground text-sm font-medium">
                {user.username}
              </span>
              {isAdmin(user) && (
                <Badge variant="secondary" className="text-xs">
                  Beheerder
                </Badge>
              )}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Uitloggen
          </Button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
