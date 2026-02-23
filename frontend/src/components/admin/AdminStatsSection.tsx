import { AdminStatCard } from './AdminStatCard'

type AdminStatsSectionProps = {
  verbsCount: number
  sentencesCount: number
  verbsCompleteCount: number
  isLoading: boolean
}

export function AdminStatsSection({
  verbsCount,
  sentencesCount,
  verbsCompleteCount,
  isLoading,
}: AdminStatsSectionProps) {
  return (
    <section className="mt-6" aria-label="Statistieken">
      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard
          title="Werkwoorden"
          description="in de database"
          isLoading={isLoading}
        >
          <span className="text-3xl font-bold tabular-nums">{verbsCount}</span>
        </AdminStatCard>
        <AdminStatCard
          title="Invulzinnen"
          description="oefenzinnen gekoppeld aan werkwoorden"
          isLoading={isLoading}
        >
          <span className="text-3xl font-bold tabular-nums">
            {sentencesCount}
          </span>
        </AdminStatCard>
        <AdminStatCard
          title="Werkwoorden compleet"
          description="alle vormen ingevuld"
          isLoading={isLoading}
        >
          <span className="text-3xl font-bold tabular-nums">
            {verbsCompleteCount}
            <span className="text-muted-foreground text-lg font-normal">
              {' '}
              / {verbsCount}
            </span>
          </span>
        </AdminStatCard>
      </div>
    </section>
  )
}
