import { useRef, useState } from 'react'
import { Link } from 'react-router'
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
import { MobileNavSheetContent, NavWithIndicator } from '@/components/NavWithIndicator'
import type { User } from '@/lib/api'
import type { NavItemConfig } from '@/lib/nav-config'
import { ROUTES } from '@/lib/routes'

export interface AppHeaderProps {
  user: User
  mainItems: NavItemConfig[]
  adminItems: NavItemConfig[]
  showAdminNav: boolean
  onLogout: () => void
  isLoggingOut: boolean
}

/**
 * Header bar (logo, nav, username, logout) and mobile menu sheet.
 * Owns sheet open state and hamburger focus for accessibility.
 */
export function AppHeader({
  user,
  mainItems,
  adminItems,
  showAdminNav,
  onLogout,
  isLoggingOut,
}: AppHeaderProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) {
      hamburgerRef.current?.focus()
    }
  }

  return (
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
          <div className="hidden min-w-0 min-[1150px]:flex min-[1150px]:items-center">
            <span className="truncate rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
              {user.username}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden min-[1150px]:inline-flex"
            onClick={onLogout}
            disabled={isLoggingOut}
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
                <span className="truncate text-sm text-muted-foreground">
                  {user.username}
                </span>
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
                onLogout()
              }}
              disabled={isLoggingOut}
            >
              Uitloggen
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
