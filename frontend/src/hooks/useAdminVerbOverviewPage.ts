import { ApiError } from '@/lib/api'
import type { AnswerFormKey, FillInSentence, Verb } from '@/lib/api'
import {
  useFillInSentences,
  useDeleteFillInSentence,
} from '@/hooks/useFillInSentences'
import { useVerbs } from '@/hooks/useVerbs'
import { buildGroupsByVerb } from '@/lib/sentenceUtils'
import { ANSWER_FORM_KEYS } from '@/lib/verbFormConfig'
import { toast } from 'sonner'
import * as React from 'react'
import type { VerbSentenceGroup } from '@/lib/sentenceUtils'

function parseQueryParams(searchParams: URLSearchParams): {
  verbId: number | undefined
  answerFormKey: AnswerFormKey | undefined
} {
  const verbParam = searchParams.get('verb')
  const formParam = searchParams.get('form')
  const verbId =
    verbParam != null && /^\d+$/.test(verbParam) ? Number(verbParam) : undefined
  const answerFormKey =
    formParam != null && ANSWER_FORM_KEYS.includes(formParam as AnswerFormKey)
      ? (formParam as AnswerFormKey)
      : undefined
  return { verbId, answerFormKey }
}

function getForbiddenMessage(
  verbsError: boolean,
  verbsErrorObj: unknown,
  sentencesError: boolean,
  sentencesErrorObj: unknown
): string | null {
  if (verbsError && verbsErrorObj instanceof ApiError && verbsErrorObj.status === 403) {
    return verbsErrorObj.message
  }
  if (sentencesError && sentencesErrorObj instanceof ApiError && sentencesErrorObj.status === 403) {
    return sentencesErrorObj.message
  }
  return null
}

export interface UseAdminVerbOverviewPageResult {
  verbs: Verb[]
  groups: VerbSentenceGroup[]
  verbsLoading: boolean
  sentencesLoading: boolean
  noVerbs: boolean
  sentencesError: boolean
  sentencesErrorObj: unknown
  forbiddenMessage: string | null
  showCardList: boolean
  expandedVerbIds: Set<number>
  selectedSentence: FillInSentence | null
  sentenceToDelete: FillInSentence | null
  initialVerbIdFromQuery: number | undefined
  initialAnswerFormKeyFromQuery: AnswerFormKey | undefined
  deletePending: boolean
  setVerbSublistOpen: (verbId: number, open: boolean) => void
  handleAddSentence: (verbId: number) => void
  openEdit: (sentence: FillInSentence, e: React.MouseEvent) => void
  openDeleteConfirm: (sentence: FillInSentence) => void
  closeDeleteConfirm: () => void
  handleConfirmDelete: () => void
  clearSentenceForm: () => void
}

export type SetSearchParams = (params: Record<string, string> | (() => Record<string, string>)) => void

export function useAdminVerbOverviewPage(
  searchParams: URLSearchParams,
  setSearchParams: SetSearchParams
): UseAdminVerbOverviewPageResult {
  const { verbId: initialVerbIdFromQuery, answerFormKey: initialAnswerFormKeyFromQuery } =
    React.useMemo(() => parseQueryParams(searchParams), [searchParams])

  const { data: verbs = [], isLoading: verbsLoading, isError: verbsError, error: verbsErrorObj } =
    useVerbs()
  const {
    data: sentences = [],
    isLoading: sentencesLoading,
    isError: sentencesError,
    error: sentencesErrorObj,
  } = useFillInSentences()
  const deleteMutation = useDeleteFillInSentence()

  const groups = React.useMemo(
    () => buildGroupsByVerb(verbs, sentences),
    [verbs, sentences]
  )

  const [selectedSentence, setSelectedSentence] = React.useState<FillInSentence | null>(null)
  const [sentenceToDelete, setSentenceToDelete] = React.useState<FillInSentence | null>(null)
  const [expandedVerbIds, setExpandedVerbIds] = React.useState<Set<number>>(new Set())

  const setVerbSublistOpen = React.useCallback((verbId: number, open: boolean) => {
    setExpandedVerbIds((prev) => {
      const next = new Set(prev)
      if (open) next.add(verbId)
      else next.delete(verbId)
      return next
    })
  }, [])

  const noVerbs = !verbsLoading && verbs.length === 0
  const forbiddenMessage = getForbiddenMessage(
    verbsError,
    verbsErrorObj,
    sentencesError,
    sentencesErrorObj
  )

  const clearSentenceForm = React.useCallback(() => {
    setSelectedSentence(null)
    setSearchParams({})
  }, [setSearchParams])

  const handleAddSentence = React.useCallback(
    (verbId: number) => {
      setSelectedSentence(null)
      setSearchParams({ verb: String(verbId) })
    },
    [setSearchParams]
  )

  const openEdit = React.useCallback((sentence: FillInSentence, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSentence(sentence)
  }, [])

  const openDeleteConfirm = React.useCallback((sentence: FillInSentence) => {
    setSentenceToDelete(sentence)
  }, [])

  const closeDeleteConfirm = React.useCallback(() => {
    setSentenceToDelete(null)
  }, [])

  const handleConfirmDelete = React.useCallback(() => {
    if (sentenceToDelete == null) return
    deleteMutation.mutate(sentenceToDelete.id, {
      onSuccess: () => {
        toast.success('Invulzin verwijderd.')
        closeDeleteConfirm()
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error('Verwijderen mislukt', { description: err.message })
        } else {
          toast.error('Verwijderen mislukt', {
            description: err instanceof Error ? err.message : undefined,
          })
        }
      },
    })
  }, [sentenceToDelete, deleteMutation, closeDeleteConfirm])

  const isLoading = verbsLoading || sentencesLoading
  const showCardList = !noVerbs && !isLoading && !sentencesError

  return {
    verbs,
    groups,
    verbsLoading,
    sentencesLoading,
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
    deletePending: deleteMutation.isPending,
    setVerbSublistOpen,
    handleAddSentence,
    openEdit,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleConfirmDelete,
    clearSentenceForm,
  }
}
