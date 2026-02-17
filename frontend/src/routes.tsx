import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { ROUTES } from '@/lib/routes'

export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    Component: LoginPage,
  },
  {
    path: ROUTES.home,
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
    ],
  },
])
