import { useRef, useState } from 'react'
import { Link, Navigate, Outlet } from 'react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { VisuallyHidden } from 'radix-ui'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MobileNavSheetContent, NavWithIndicator } from '@/components/NavWithIndicator'
import { useAuth } from '@/contexts/AuthContext'
import { useLogoutMutation } from '@/hooks/useAuthMutations'
import { useMe } from '@/hooks/useMe'
import { isAdmin } from '@/lib/api'
import { NAV_ITEMS } from '@/lib/nav-config'
import { ROUTES } from '@/lib/routes'

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
          <div className="hidden flex-1 md:flex">
            <NavWithIndicator
              mainItems={mainItems}
              adminItems={adminItems}
              showAdminNav={showAdminNav}
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
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
              className="hidden md:inline-flex"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              Uitloggen
            </Button>
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
          </div>
          <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetContent side="right" className="w-full max-w-sm">
              <VisuallyHidden.Root>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navigatie en uitloggen</SheetDescription>
              </VisuallyHidden.Root>
              <SheetHeader className="flex flex-row items-center justify-between space-y-0">
                <span id="sheet-nav-title" className="text-lg font-semibold leading-none tracking-tight">
                  Menu
                </span>
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
              <MobileNavSheetContent
                mainItems={mainItems}
                adminItems={adminItems}
                showAdminNav={showAdminNav}
                onNavigate={() => setSheetOpen(false)}
              />
              <Separator className="my-4" />
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  setSheetOpen(false)
                  logoutMutation.mutate()
                }}
                disabled={logoutMutation.isPending}
              >
                Uitloggen
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <Outlet />
      </div>
    </div>
  )
}
