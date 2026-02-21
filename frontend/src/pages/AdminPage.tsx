import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ApiError, apiFetch } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useFillInSentences } from '@/hooks/useFillInSentences'
import { useVerbs } from '@/hooks/useVerbs'
import { countFilledForms, VERB_FORM_KEYS } from '@/lib/verbFormConfig'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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

          <section className="mt-6" aria-label="Statistieken">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Werkwoorden</CardTitle>
                  <CardDescription>in de database</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <Skeleton className="h-9 w-14" />
                  ) : (
                    <span className="text-3xl font-bold tabular-nums">
                      {verbsCount}
                    </span>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Invulzinnen</CardTitle>
                  <CardDescription>oefenzinnen gekoppeld aan werkwoorden</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <Skeleton className="h-9 w-14" />
                  ) : (
                    <span className="text-3xl font-bold tabular-nums">
                      {sentencesCount}
                    </span>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Werkwoorden compleet</CardTitle>
                  <CardDescription>alle vormen ingevuld</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <Skeleton className="h-9 w-24" />
                  ) : (
                    <span className="text-3xl font-bold tabular-nums">
                      {verbsCompleteCount}
                      <span className="text-muted-foreground text-lg font-normal">
                        {' '}
                        / {verbsCount}
                      </span>
                    </span>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-8" aria-label="Acties">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="flex h-full flex-col rounded-xl border">
                <CardHeader>
                  <CardTitle className="text-lg">Oefening genereren</CardTitle>
                  <CardDescription>
                    Maak een vervoegingsoefening of invulzin-oefening met een
                    gekozen aantal items.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.beheerOefeningGenereren}>
                      Openen
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="flex h-full flex-col rounded-xl border">
                <CardHeader>
                  <CardTitle className="text-lg">Werkwoorden beheren</CardTitle>
                  <CardDescription>
                    Voeg werkwoorden toe en vul de vervoegingen in.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex flex-wrap items-center gap-2">
                  {statsLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.beheerWerkwoorden}>
                          Openen
                          <ChevronRight className="size-4" />
                        </Link>
                      </Button>
                      <Badge variant="secondary" className="tabular-nums">
                        {verbsCount} werkwoord{verbsCount !== 1 ? 'en' : ''}
                      </Badge>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="flex h-full flex-col rounded-xl border">
                <CardHeader>
                  <CardTitle className="text-lg">Zinnen beheren</CardTitle>
                  <CardDescription>
                    Beheer invulzinnen gekoppeld aan werkwoorden.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex flex-wrap items-center gap-2">
                  {statsLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.beheerZinnen}>
                          Openen
                          <ChevronRight className="size-4" />
                        </Link>
                      </Button>
                      <Badge variant="secondary" className="tabular-nums">
                        {sentencesCount} zin{sentencesCount !== 1 ? 'nen' : ''}
                      </Badge>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {adminCheck?.ok === true && !statsLoading && (
            <p className="text-muted-foreground mt-6 text-sm">Toegang bevestigd.</p>
          )}
        </>
      )}
    </main>
  )
}
