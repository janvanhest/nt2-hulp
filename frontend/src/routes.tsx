import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/layouts/AppLayout'
import { BeheerLayout } from '@/layouts/BeheerLayout'
import { BeheerPage } from '@/pages/BeheerPage'
import { BeheerWerkwoordenPage } from '@/pages/BeheerWerkwoordenPage'
import { BeheerZinnenPage } from '@/pages/BeheerZinnenPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NakijkPage } from '@/pages/NakijkPage'
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
        path: 'nakijk',
        Component: NakijkPage,
      },
      {
        path: 'beheer',
        Component: BeheerLayout,
        children: [
          {
            index: true,
            Component: BeheerPage,
          },
          {
            path: 'werkwoorden',
            Component: BeheerWerkwoordenPage,
          },
          {
            path: 'zinnen',
            Component: BeheerZinnenPage,
          },
        ],
      },
    ],
  },
])
