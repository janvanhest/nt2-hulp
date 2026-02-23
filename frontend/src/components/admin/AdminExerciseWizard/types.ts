import type { ExerciseType, FillInSentence, Verb, VerbPayload } from '@/lib/api'
import type { useDeleteFillInSentence } from '@/hooks/useFillInSentences'

export interface WizardStepperProps {
  currentStep: number
  createdVerb: Verb | null
  stepComplete: (stepIndex: number) => boolean
  stepActive: (stepIndex: number) => boolean
  onStepClick: (stepIndex: number) => void
  formCount: number
}

export interface WizardStep1Props {
  infinitive: string
  onInfinitiveChange: (v: string | ((prev: string) => string)) => void
  fieldErrors: Record<string, string>
  onSubmit: (e: React.FormEvent) => Promise<void>
  isPending: boolean
}

export interface WizardExistingVerbDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export interface WizardStep2Props {
  verb: Verb
  onSubmit: (payload: VerbPayload) => Promise<void>
  isPending: boolean
  fieldErrors: Record<string, string>
}

export interface WizardStep3Props {
  createdVerb: Verb
  sentences: FillInSentence[]
  targetSentencesPerForm: number
  onTargetChange: (n: number) => void
  onAddSentence: () => void
  onEditSentence: (s: FillInSentence) => void
  onDeleteSentence: (s: FillInSentence) => void
  onGoToStep4: () => void
}

export interface WizardStep4Props {
  createdVerb: Verb
  sentences: FillInSentence[]
  step4CardExpanded: boolean
  onStep4CardExpandChange: (v: boolean) => void
  onEditSentence: (s: FillInSentence) => void
  onDeleteSentence: (s: FillInSentence) => void
  onAddSentence: () => void
  exerciseType: ExerciseType
  onExerciseTypeChange: (v: ExerciseType) => void
  numItems: string
  onNumItemsChange: (v: string) => void
  useAllVerbs: boolean
  onUseAllVerbsChange: (v: boolean) => void
  selectedVerbIds: Set<number>
  onToggleVerb: (id: number) => void
  sortedVerbs: Verb[]
  verbsLoading: boolean
  onExerciseSubmit: (e: React.FormEvent) => void
  exerciseSubmitPending: boolean
}

export interface WizardSentenceDialogsProps {
  sentenceDialogOpen: boolean
  setSentenceDialogOpen: (open: boolean) => void
  sentenceToEdit: FillInSentence | null
  setSentenceToEdit: (s: FillInSentence | null) => void
  sentenceToDelete: FillInSentence | null
  setSentenceToDelete: (s: FillInSentence | null) => void
  createdVerb: Verb | null
  verbs: Verb[]
  deleteSentenceMutation: ReturnType<typeof useDeleteFillInSentence>
}

/**
 * Return type of {@link useAdminGenerateExerciseWizard}.
 * Grouped by UI: stepper, step1–4, existingVerbDialog, sentenceDialogs.
 * Use wizard.currentStep and wizard.createdVerb for step visibility.
 */
export interface UseAdminGenerateExerciseWizardResult {
  currentStep: number
  createdVerb: Verb | null
  stepper: WizardStepperProps
  step1: WizardStep1Props
  existingVerbDialog: WizardExistingVerbDialogProps
  step2: WizardStep2Props | null
  step3: WizardStep3Props | null
  step4: WizardStep4Props | null
  sentenceDialogs: WizardSentenceDialogsProps
}
