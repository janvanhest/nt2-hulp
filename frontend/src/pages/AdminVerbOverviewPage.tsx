import { DeleteSentenceConfirmDialog } from '@/components/DeleteSentenceConfirmDialog'
import { FillInSentenceFormCard } from '@/components/FillInSentenceFormCard'
import { VerbSentenceCard } from '@/components/VerbSentenceCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminVerbOverviewPage } from '@/hooks/useAdminVerbOverviewPage'
import { ROUTES } from '@/lib/routes'
import { TARGET_SENTENCES_PER_FORM } from '@/lib/sentenceUtils'
import { Link, useSearchParams } from 'react-router'

const VIEW_ZINNEN = 'zinnen'
const VIEW_VORMDEKKING = 'vormdekking'

type VerbOverviewView = 'zinnen' | 'vormdekking'

type ViewPageConfig = {
  title: string
  subtitle: string
  introText: string
}

function parseView(viewParam: string | null): VerbOverviewView {
  if (viewParam === VIEW_ZINNEN || viewParam === VIEW_VORMDEKKING) return viewParam
  return VIEW_VORMDEKKING
}

const VIEW_PAGE_CONFIG: Record<VerbOverviewView, ViewPageConfig> = {
  zinnen: {
    title: 'Zinnen beheren',
    subtitle: 'Alleen invulzinnen per werkwoord. Voeg zinnen toe of bewerk ze.',
    introText: 'Beheer invulzinnen per werkwoord.',
  },
  vormdekking: {
    title: 'Overzicht per werkwoord',
    subtitle: 'Vormdekking en invulzinnen per werkwoord. Voeg zinnen toe of bewerk ze.',
    introText: `Streef: per werkwoordsvorm min. ${TARGET_SENTENCES_PER_FORM} oefenzinnen.`,
  },
}

export function AdminVerbOverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const view = parseView(searchParams.get('view'))

  const {
    verbs,
    groups,
    verbsLoading,
    noVerbs,
    sentencesError,
    sentencesErrorObj,
    forbiddenMessage,
    showCardList,
    expandedVerbIds,
    selectedSentence,
    sentenceToDelete,
    initialVerbIdFromQuery,
    initialAnswerFormKeyFromQuery,
    deletePending,
    setVerbSublistOpen,
    handleAddSentence,
    openEdit,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleConfirmDelete,
    clearSentenceForm,
  } = useAdminVerbOverviewPage(searchParams, setSearchParams)

  const pageConfig = VIEW_PAGE_CONFIG[view]

  return (
    <main className="min-w-0 overflow-x-hidden p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{pageConfig.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{pageConfig.subtitle}</p>
      </div>

      {forbiddenMessage != null ? (
        <p
          className="bg-destructive/10 text-destructive mt-2 rounded-md px-3 py-2 text-sm"
          role="alert"
        >
          {forbiddenMessage}
        </p>
      ) : noVerbs ? (
        <div className="mt-2 flex flex-col items-start gap-2 text-muted-foreground">
          <p>Voeg eerst werkwoorden toe om oefenzinnen te kunnen koppelen.</p>
          <Button asChild variant="default">
            <Link to={ROUTES.beheerWerkwoorden}>Naar Vervoegingen beheren</Link>
          </Button>
        </div>
      ) : verbsLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sentencesError ? (
        <p className="text-destructive mt-1 text-sm" role="alert">
          {sentencesErrorObj instanceof Error
            ? sentencesErrorObj.message
            : 'Fout bij ophalen invulzinnen.'}
        </p>
      ) : showCardList ? (
        <>
          <p className="text-muted-foreground mb-4 text-sm">{pageConfig.introText}</p>
          <div className="mb-6">
            <FillInSentenceFormCard
              sentence={selectedSentence}
              initialVerbId={initialVerbIdFromQuery}
              initialAnswerFormKey={initialAnswerFormKeyFromQuery}
              verbs={verbs}
              onSuccess={clearSentenceForm}
              onCancel={clearSentenceForm}
            />
          </div>
          <div className="space-y-4">
            {groups.map((group) => (
              <VerbSentenceCard
                key={group.verb.id}
                group={group}
                isExpanded={expandedVerbIds.has(group.verb.id)}
                onExpandChange={(open) => setVerbSublistOpen(group.verb.id, open)}
                onEditSentence={openEdit}
                onDeleteSentence={openDeleteConfirm}
                onAddSentence={handleAddSentence}
                showFormCoverage={view === VIEW_VORMDEKKING}
              />
            ))}
          </div>
        </>
      ) : null}

      <DeleteSentenceConfirmDialog
        open={sentenceToDelete != null}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
        sentence={sentenceToDelete}
        onConfirm={handleConfirmDelete}
        isPending={deletePending}
      />
    </main>
  )
}
