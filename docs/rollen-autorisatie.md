# Rollen en autorisatie

Overzicht van rollen, waar ze worden gebruikt, hoe je een beheerder aanmaakt en waar autorisatie wordt afgedwongen.

## Rollen

Er zijn twee rollen:

| Rol         | Waarde in API/model | Rechten |
|------------|---------------------|--------|
| **Gebruiker** | `gebruiker`         | Oefenen, nakijkmodel bekijken. Geen beheer. |
| **Beheerder** | `beheerder`         | Alles van gebruiker, plus werkwoorden en zinnen beheren. |

## Waar worden rollen gebruikt?

- **Backend model:** `accounts.models.User` heeft een veld `role` (CharField met choices). Enum: `accounts.models.Role` (`gebruiker`, `beheerder`).
- **Backend API:** Login-response (POST `/api/auth/login/`) en GET `/api/auth/me/` bevatten het veld `role` in het user-object. Beheer-endpoints (zoals GET `/api/beheer/` en toekomstige werkwoorden/zinnen-CRUD) vereisen rol `beheerder`.
- **Frontend:** Type `User` in `frontend/src/lib/api.ts` heeft `role: UserRole` (`'gebruiker' | 'beheerder'`). `useMe()` levert de ingelogde gebruiker; navigatie en route-guards gebruiken `user.role`.

## Beheerder aanmaken

- **Eerste beheerder (aanbevolen):** `python manage.py create_first_admin --username admin`  
  Wachtwoord via environment variable `NT2_FIRST_ADMIN_PASSWORD` of interactief via prompt. Bestaande gebruiker met die username wordt indien nodig op beheerder gezet (idempotent). Zie ook [Epic 0](v3/epics.md).
- **Via Django admin:** Log in op `/admin/`, ga naar Gebruikers, open een gebruiker en zet **Role** op "Beheerder". Sla op.
- **Handmatig in shell:** `python manage.py shell` → bijvoorbeeld:
  ```python
  from accounts.models import User, Role
  u = User.objects.get(username='jouw_gebruiker')
  u.role = Role.beheerder
  u.save()
  ```

## Waar wordt autorisatie afgedwongen?

Autorisatie wordt **altijd in de backend** afgedwongen. De frontend gebruikt rollen voor UX (verbergen van menu’s, redirects) maar is geen beveiligingsgrens.

### Backend

- **Beheer-endpoints** (werkwoorden, zinnen, GET `/api/beheer/`): `permission_classes = BEHEER_PERMISSION_CLASSES` (uit `accounts.permissions`). Zie `accounts.permissions.IsBeheerder` en `accounts.beheer_views`. Zonder beheerderrol → **403 Forbidden** met detail "Alleen beheerder kan deze actie uitvoeren."
- **Oefen- en nakijk-endpoints:** (wanneer toegevoegd) `permission_classes = [IsAuthenticated]` (uit `rest_framework.permissions`). Zonder token → **401 Unauthorized**.
- **Auth:** Login/logout en `/api/auth/me/` zoals geconfigureerd in `accounts.api_views` en `accounts.api_urls`.

### Frontend

- **Route-guard:** Routes onder `/beheer` gebruiken `BeheerLayout` (`frontend/src/layouts/BeheerLayout.tsx`). Als `user.role !== 'beheerder'`, redirect naar home.
- **Navigatie:** In `AppLayout` worden links naar Beheer, Werkwoorden en Zinnen alleen getoond als `user.role === 'beheerder'`.
- **401:** Bij verlopen of ontbrekend token wist de app de token en redirect naar login (o.a. in `apiFetch` en `useMe`).
- **403:** Bij een 403 op een API-call (bijv. beheer-actie met gebruikersrol) tonen callers de `detail` uit de response aan de gebruiker (zie bijv. `BeheerPage`).

## Toevoegen van nieuwe beheer- of oefen-endpoints

- **Beheer (werkwoorden/zinnen):** View voorzien van `permission_classes = BEHEER_PERMISSION_CLASSES` (import uit `accounts.permissions`) en URL onder `api/beheer/` of in een aparte app die dezelfde permission gebruikt. Zonder beheerderrol → 403 met bestaande `IsBeheerder.message`.
- **Oefenen/nakijk:** View voorzien van `permission_classes = [IsAuthenticated]` (uit `rest_framework.permissions`); ongeauthenticeerde requests krijgen 401 (zelfde gedrag als `/api/auth/me/`).
