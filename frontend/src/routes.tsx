import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AdminPage } from '@/pages/AdminPage'
import { AdminGenerateExercisePage } from '@/pages/AdminGenerateExercisePage'
import { AdminVerbsPage } from '@/pages/AdminVerbsPage'
import { AdminVerbOverviewPage } from '@/pages/AdminVerbOverviewPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NakijkPage } from '@/pages/NakijkPage'
import { OefenenDoPage } from '@/pages/OefenenDoPage'
import { OefenenPage } from '@/pages/OefenenPage'
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
      {
        path: 'oefenen',
        Component: OefenenPage,
      },
      {
        path: 'oefenen/:id',
        Component: OefenenDoPage,
      },
      {
        path: 'nakijk',
        Component: NakijkPage,
      },
      {
        path: 'beheer',
        Component: AdminLayout,
        children: [
          {
            index: true,
            Component: AdminPage,
          },
          {
            path: 'werkwoorden',
            Component: AdminVerbsPage,
          },
          {
            path: 'overzicht-per-werkwoord',
            Component: AdminVerbOverviewPage,
          },
          {
            path: 'oefening-genereren',
            Component: AdminGenerateExercisePage,
          },
        ],
      },
    ],
  },
])
