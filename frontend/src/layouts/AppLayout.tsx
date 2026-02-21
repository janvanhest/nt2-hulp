import { useRef, useState } from 'react'
import { Link, Navigate, Outlet } from 'react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Toaster } from '@/components/ui/sonner'
import { MobileNavSheetContent, NavWithIndicator } from '@/components/NavWithIndicator'
import { useAuth } from '@/contexts/AuthContext'
import { useLogoutMutation } from '@/hooks/useAuthMutations'
import { useMe } from '@/hooks/useMe'
import { isAdmin } from '@/lib/api'
import { NAV_ITEMS } from '@/lib/nav-config'
import { ROUTES } from '@/lib/routes'

/**
 * Main app shell: header with nav, username, logout, and mobile sheet menu.
 * Requires auth; redirects to login when no token or /api/auth/me/ fails.
 */
export function AppLayout() {
  const { token, clearToken } = useAuth()
  const { data: user, isPending, isError } = useMe()
  const logoutMutation = useLogoutMutation()
  const [sheetOpen, setSheetOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  /** Syncs sheet open state and returns focus to the hamburger button when the sheet closes (accessibility). */
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
    <div className="flex min-h-svh flex-col overflow-x-hidden">
      <header className="border-b bg-card shrink-0">
        <div className="flex h-14 min-w-0 items-center gap-2 px-4 sm:gap-4 sm:px-6">
          <Link
            to={ROUTES.home}
            className="shrink-0 font-semibold text-foreground hover:underline"
          >
            NT-2
          </Link>
          <div className="hidden min-w-0 flex-1 min-[1150px]:flex">
            <NavWithIndicator
              mainItems={mainItems}
              adminItems={adminItems}
              showAdminNav={showAdminNav}
            />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
            {user != null && (
              <div className="hidden min-w-0 min-[1150px]:flex min-[1150px]:items-center">
                <span className="truncate rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
                  {user.username}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="hidden min-[1150px]:inline-flex"
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
              className="flex min-[1150px]:hidden"
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
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span id="sheet-nav-title" className="text-lg font-semibold leading-none tracking-tight">
                    Menu
                  </span>
                  {user != null && (
                    <span className="truncate text-sm text-muted-foreground">
                      {user.username}
                    </span>
                  )}
                </div>
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
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <main className="mx-auto w-full max-w-4xl">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}
