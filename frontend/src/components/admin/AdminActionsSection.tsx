import { ROUTES } from '@/lib/routes'
import { AdminActionCard } from './AdminActionCard'

type AdminActionsSectionProps = {
  verbsCount: number
  sentencesCount: number
  isLoading: boolean
}

function sentencesBadge(count: number): string {
  return count === 1 ? '1 zin' : `${count} zinnen`
}

export function AdminActionsSection({
  verbsCount,
  sentencesCount,
  isLoading,
}: AdminActionsSectionProps) {
  const sentencesLabel = sentencesBadge(sentencesCount)
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
          title="Overzicht per werkwoord"
          description="Vormdekking en invulzinnen per werkwoord. Voeg zinnen toe of bewerk ze."
          to={ROUTES.beheerOverzichtPerWerkwoord}
          isLoading={isLoading}
          badge={sentencesLabel}
        />
        <AdminActionCard
          title="Zinnen beheren"
          description="Alleen invulzinnen per werkwoord. Voeg zinnen toe of bewerk ze."
          to={ROUTES.beheerOverzichtPerWerkwoordWithView('zinnen')}
          isLoading={isLoading}
          badge={sentencesLabel}
        />
      </div>
    </section>
  )
}
