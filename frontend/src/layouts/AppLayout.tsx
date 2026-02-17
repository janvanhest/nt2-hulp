import { useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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

/** For mobile Sheet: vertical list, no sliding pill, large touch targets. */
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
  const [sheetOpen, setSheetOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      hamburgerRef.current?.focus()
    }
  }

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
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          <Link
            to={ROUTES.home}
            className="font-semibold text-foreground hover:underline"
          >
            NT-2
          </Link>
          <Button
            ref={hamburgerRef}
            type="button"
            variant="ghost"
            size="icon"
            className="flex md:hidden"
            aria-label="Menu openen"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen(true)}
          >
            <Menu aria-hidden className="size-5" />
          </Button>
          <div className="hidden flex-1 md:flex">
            <NavWithIndicator
              mainItems={mainItems}
              adminItems={adminItems}
              showAdminNav={showAdminNav}
            />
          </div>
          <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetContent
              side="right"
              className="w-full max-w-sm"
              aria-describedby={undefined}
            >
              <SheetHeader className="flex flex-row items-center justify-between space-y-0">
                <SheetTitle id="sheet-nav-title">Menu</SheetTitle>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Menu sluiten"
                    onClick={() => setSheetOpen(false)}
                  >
                    <X aria-hidden className="size-5" />
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav
                className="mt-6 flex flex-col gap-1"
                aria-labelledby="sheet-nav-title"
              >
                {mainItems.map((item) => (
                  <SheetNavItem
                    key={item.to}
                    item={item}
                    onNavigate={() => setSheetOpen(false)}
                  />
                ))}
                {showAdminNav && (
                  <>
                    <Separator className="my-2" />
                    {adminItems.map((item) => (
                      <SheetNavItem
                        key={item.to}
                        item={item}
                        onNavigate={() => setSheetOpen(false)}
                      />
                    ))}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
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
