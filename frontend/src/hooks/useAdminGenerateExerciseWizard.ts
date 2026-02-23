import { useNavigate } from 'react-router'
import type { ExerciseType, FillInSentence, Verb, VerbPayload } from '@/lib/api'
import { ApiError, getFieldErrors } from '@/lib/api'
import { ROUTES } from '@/lib/routes'
import { useCreateExercise } from '@/hooks/useExercises'
import {
  useDeleteFillInSentence,
  useFillInSentences,
} from '@/hooks/useFillInSentences'
import { useCreateVerb, useUpdateVerb, useVerbs } from '@/hooks/useVerbs'
import { TARGET_SENTENCES_PER_FORM } from '@/lib/sentenceUtils'
import { getEmptyVerbForm, VERB_FORM_KEYS } from '@/lib/verbFormConfig'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import type {
  UseAdminGenerateExerciseWizardResult,
  WizardExistingVerbDialogProps,
  WizardSentenceDialogsProps,
  WizardStepperProps,
  WizardStep1Props,
  WizardStep2Props,
  WizardStep3Props,
  WizardStep4Props,
} from '@/components/admin/AdminExerciseWizard/types'

export type {
  UseAdminGenerateExerciseWizardResult,
  WizardExistingVerbDialogProps,
  WizardSentenceDialogsProps,
  WizardStepperProps,
  WizardStep1Props,
  WizardStep2Props,
  WizardStep3Props,
  WizardStep4Props,
} from '@/components/admin/AdminExerciseWizard/types'

const FORM_COUNT = VERB_FORM_KEYS.length

/**
 * Maps create/update verb API errors to field errors and shows a toast.
 * Used by step 1 and step 2 submit handlers.
 */
function applyVerbMutationError(
  error: unknown,
  setFieldErrors: (errors: Record<string, string>) => void
): void {
  if (error instanceof ApiError) {
    const errors = getFieldErrors(error)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      toast.error('Fout bij opslaan', { description: error.message })
    }
  } else {
    toast.error('Er is iets misgegaan.', {
      description: error instanceof Error ? error.message : undefined,
    })
  }
}

/**
 * Hook for the admin "Oefening toevoegen" wizard: step 1 (infinitive), step 2 (forms),
 * step 3 (sentences), step 4 (summary + create exercise). Manages verb create/update,
 * existing-verb dialog, sentence add/edit/delete, and exercise creation with navigation.
 * Returns grouped props for each UI block so the page stays thin.
 */
export function useAdminGenerateExerciseWizard(): UseAdminGenerateExerciseWizardResult {
  const navigate = useNavigate()
  const createExerciseMutation = useCreateExercise()
  const createVerbMutation = useCreateVerb()
  const updateVerbMutation = useUpdateVerb()
  const { data: verbs = [], isLoading: verbsLoading } = useVerbs()

  // --- Wizard & verb state
  const [currentStep, setCurrentStep] = useState(1)
  const [createdVerb, setCreatedVerb] = useState<Verb | null>(null)
  const [step1Infinitive, setStep1Infinitive] = useState('')
  const [step1FieldErrors, setStep1FieldErrors] = useState<
    Record<string, string>
  >({})
  const [step2FieldErrors, setStep2FieldErrors] = useState<
    Record<string, string>
  >({})
  const [existingVerbDialogOpen, setExistingVerbDialogOpen] = useState(false)
  const [existingVerbToLoad, setExistingVerbToLoad] = useState<Verb | null>(
    null
  )
  const [sentenceDialogOpen, setSentenceDialogOpen] = useState(false)
  const [sentenceToEdit, setSentenceToEdit] = useState<FillInSentence | null>(
    null
  )
  const [sentenceToDelete, setSentenceToDelete] =
    useState<FillInSentence | null>(null)
  const [step4CardExpanded, setStep4CardExpanded] = useState(true)
  const [targetSentencesPerForm, setTargetSentencesPerForm] = useState(
    TARGET_SENTENCES_PER_FORM
  )
  const [exerciseType, setExerciseType] = useState<ExerciseType>('vervoeging')
  const [numItems, setNumItems] = useState<string>('10')
  const [useAllVerbs, setUseAllVerbs] = useState(true)
  const [selectedVerbIds, setSelectedVerbIds] = useState<Set<number>>(
    new Set()
  )

  const { data: step3Sentences = [] } = useFillInSentences(createdVerb?.id)
  const deleteSentenceMutation = useDeleteFillInSentence()

  // --- Derived
  const sortedVerbs = useMemo(
    () => [...verbs].sort((a, b) => a.infinitive.localeCompare(b.infinitive)),
    [verbs]
  )
  const stepComplete = (stepIndex: number) => currentStep > stepIndex
  const stepActive = (stepIndex: number) => currentStep === stepIndex

  const toggleVerb = (id: number) => {
    setSelectedVerbIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === 1) {
      setCurrentStep(1)
      return
    }
    if (stepIndex === 2 && createdVerb != null) {
      setCurrentStep(2)
      return
    }
    if (stepIndex === 3 && currentStep >= 3) {
      setCurrentStep(3)
      return
    }
    if (stepIndex === 4 && currentStep >= 4) {
      setCurrentStep(4)
    }
  }

  // --- Step 1: add new verb or open existing-verb dialog
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep1FieldErrors({})
    const raw = step1Infinitive.trim()
    if (raw === '') {
      setStep1FieldErrors({ infinitive: 'Infinitief is verplicht.' })
      return
    }
    const infinitive = raw.toLowerCase()
    const existingVerb = verbs.find(
      (v) => v.infinitive.toLowerCase() === infinitive
    )
    if (existingVerb != null) {
      setExistingVerbToLoad(existingVerb)
      setExistingVerbDialogOpen(true)
      return
    }
    const payload: VerbPayload = {
      infinitive,
      forms: getEmptyVerbForm(),
    }
    try {
      const verb = await createVerbMutation.mutateAsync(payload)
      setCreatedVerb(verb)
      setCurrentStep(2)
      toast.success('Werkwoord toegevoegd.')
    } catch (error) {
      applyVerbMutationError(error, setStep1FieldErrors)
    }
  }

  const handleLoadExistingVerb = () => {
    if (existingVerbToLoad != null) {
      setCreatedVerb(existingVerbToLoad)
      setCurrentStep(2)
      setExistingVerbDialogOpen(false)
      setExistingVerbToLoad(null)
      toast.success('Bestaand werkwoord geladen.')
    }
  }

  const handleCancelLoadExistingVerb = () => {
    setExistingVerbDialogOpen(false)
    setExistingVerbToLoad(null)
  }

  // --- Step 2: update verb forms
  const handleStep2Submit = async (payload: VerbPayload) => {
    if (createdVerb == null) return
    setStep2FieldErrors({})
    try {
      await updateVerbMutation.mutateAsync({ id: createdVerb.id, data: payload })
      setCurrentStep(3)
      toast.success('Werkwoord bijgewerkt.')
    } catch (error) {
      applyVerbMutationError(error, setStep2FieldErrors)
    }
  }

  // --- Step 4: create exercise
  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = parseInt(numItems, 10)
    if (Number.isNaN(n) || n < 1) {
      toast.error('Voer een geldig aantal in (minimaal 1).')
      return
    }
    if (!useAllVerbs && selectedVerbIds.size === 0) {
      toast.error('Kies minimaal één werkwoord.')
      return
    }
    const payload = {
      exercise_type: exerciseType,
      num_items: n,
      ...(useAllVerbs ? {} : { verb_ids: Array.from(selectedVerbIds) }),
    }
    createExerciseMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Oefening aangemaakt.')
        navigate(ROUTES.oefenen)
      },
      onError: (err) => {
        const message =
          err instanceof ApiError ? err.message : 'Er is iets misgegaan.'
        toast.error(message)
      },
    })
  }

  // --- Sentence dialog openers (step 3 & 4)
  const openAddSentence = () => {
    setSentenceToEdit(null)
    setSentenceDialogOpen(true)
  }
  const openEditSentence = (s: FillInSentence) => {
    setSentenceToEdit(s)
    setSentenceDialogOpen(true)
  }

  // --- Build grouped return
  const stepper: WizardStepperProps = {
    currentStep,
    createdVerb,
    stepComplete,
    stepActive,
    onStepClick: handleStepClick,
    formCount: FORM_COUNT,
  }

  const step1: WizardStep1Props = {
    infinitive: step1Infinitive,
    onInfinitiveChange: setStep1Infinitive,
    fieldErrors: step1FieldErrors,
    onSubmit: handleStep1Submit,
    isPending: createVerbMutation.isPending,
  }

  const existingVerbDialog: WizardExistingVerbDialogProps = {
    open: existingVerbDialogOpen,
    onConfirm: handleLoadExistingVerb,
    onCancel: handleCancelLoadExistingVerb,
  }

  const step2: WizardStep2Props | null =
    createdVerb != null
      ? {
          verb: createdVerb,
          onSubmit: handleStep2Submit,
          isPending: updateVerbMutation.isPending,
          fieldErrors: step2FieldErrors,
        }
      : null

  const step3: WizardStep3Props | null =
    createdVerb != null
      ? {
          createdVerb,
          sentences: step3Sentences,
          targetSentencesPerForm,
          onTargetChange: setTargetSentencesPerForm,
          onAddSentence: openAddSentence,
          onEditSentence: openEditSentence,
          onDeleteSentence: setSentenceToDelete,
          onGoToStep4: () => setCurrentStep(4),
        }
      : null

  const step4: WizardStep4Props | null =
    createdVerb != null
      ? {
          createdVerb,
          sentences: step3Sentences,
          step4CardExpanded,
          onStep4CardExpandChange: setStep4CardExpanded,
          onEditSentence: openEditSentence,
          onDeleteSentence: setSentenceToDelete,
          onAddSentence: openAddSentence,
          exerciseType,
          onExerciseTypeChange: setExerciseType,
          numItems,
          onNumItemsChange: setNumItems,
          useAllVerbs,
          onUseAllVerbsChange: setUseAllVerbs,
          selectedVerbIds,
          onToggleVerb: toggleVerb,
          sortedVerbs,
          verbsLoading,
          onExerciseSubmit: handleExerciseSubmit,
          exerciseSubmitPending:
            createExerciseMutation.isPending ||
            (verbsLoading && !useAllVerbs),
        }
      : null

  const sentenceDialogs: WizardSentenceDialogsProps = {
    sentenceDialogOpen,
    setSentenceDialogOpen,
    sentenceToEdit,
    setSentenceToEdit,
    sentenceToDelete,
    setSentenceToDelete,
    createdVerb,
    verbs,
    deleteSentenceMutation,
  }

  return {
    currentStep,
    createdVerb,
    stepper,
    step1,
    existingVerbDialog,
    step2,
    step3,
    step4,
    sentenceDialogs,
  }
}
