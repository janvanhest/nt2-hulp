import { ROUTES } from '@/lib/routes'
import { AdminActionCard } from './AdminActionCard'

type AdminActionsSectionProps = {
  verbsCount: number
  sentencesCount: number
  isLoading: boolean
}

export function AdminActionsSection({
  verbsCount,
  sentencesCount,
  isLoading,
}: AdminActionsSectionProps) {
  return (
    <section className="mt-8" aria-label="Acties">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminActionCard
          title="Oefening toevoegen"
          description="Stap 1: kies type (vervoeging of invulzin). Stap 2: kies werkwoorden. Stap 3: aantal items. De oefening wordt direct aangemaakt."
          to={ROUTES.beheerOefeningGenereren}
          isLoading={isLoading}
        />
        <AdminActionCard
          title="Vervoegingen beheren"
          description="Voeg werkwoorden toe en vul de vervoegingen in."
          to={ROUTES.beheerWerkwoorden}
          isLoading={isLoading}
          badge={`${verbsCount} werkwoord${verbsCount !== 1 ? 'en' : ''}`}
        />
        <AdminActionCard
          title="Zinnen beheren"
          description="Beheer invulzinnen gekoppeld aan werkwoorden."
          to={ROUTES.beheerZinnen}
          isLoading={isLoading}
          badge={`${sentencesCount} zin${sentencesCount !== 1 ? 'nen' : ''}`}
        />
      </div>
    </section>
  )
}
