import { useQuery } from '@tanstack/react-query'
import { ApiError, apiFetch } from '@/lib/api'
import { useFillInSentences } from '@/hooks/useFillInSentences'
import { useVerbs } from '@/hooks/useVerbs'
import { countFilledForms, VERB_FORM_KEYS } from '@/lib/verbFormConfig'
import { AdminActionsSection } from '@/components/admin/AdminActionsSection'
import { AdminStatsSection } from '@/components/admin/AdminStatsSection'

const FORM_COUNT = VERB_FORM_KEYS.length

export function AdminPage() {
  const { data: adminCheck, isError, error } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const res = await apiFetch('/api/beheer/')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(res.status, body)
      }
      return res.json() as Promise<{ ok: boolean }>
    },
  })

  const { data: verbs = [], isLoading: verbsLoading } = useVerbs()
  const { data: sentences = [], isLoading: sentencesLoading } = useFillInSentences()

  const forbiddenMessage =
    isError && error instanceof ApiError && error.status === 403 ? error.message : null

  const verbsCount = verbs.length
  const sentencesCount = sentences.length
  const verbsCompleteCount = verbs.filter(
    (v) => countFilledForms(v.forms) === FORM_COUNT
  ).length
  const statsLoading = verbsLoading || sentencesLoading

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Beheer</h1>
      {forbiddenMessage != null ? (
        <p
          className="bg-destructive/10 text-destructive mt-2 rounded-md px-3 py-2 text-sm"
          role="alert"
        >
          {forbiddenMessage}
        </p>
      ) : (
        <>
          <p className="text-muted-foreground mt-1">
            Overzicht beheer. Werkwoorden en zinnen beheren:
          </p>

          <AdminStatsSection
            verbsCount={verbsCount}
            sentencesCount={sentencesCount}
            verbsCompleteCount={verbsCompleteCount}
            isLoading={statsLoading}
          />

          <AdminActionsSection
            verbsCount={verbsCount}
            sentencesCount={sentencesCount}
            isLoading={statsLoading}
          />

          {adminCheck?.ok === true && !statsLoading && (
            <p className="text-muted-foreground mt-6 text-sm">Toegang bevestigd.</p>
          )}
        </>
      )}
    </main>
  )
}
