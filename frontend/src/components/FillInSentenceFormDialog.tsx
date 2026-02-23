import type { AnswerFormKey, FillInSentence, Verb } from '@/lib/api'
import { FillInSentenceForm } from '@/components/FillInSentenceForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface FillInSentenceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sentence: FillInSentence | null
  initialVerbId?: number
  fixedVerbId?: number
  initialAnswerFormKey?: AnswerFormKey | ''
  verbs: Verb[]
}

export function FillInSentenceFormDialog({
  open,
  onOpenChange,
  sentence,
  initialVerbId,
  fixedVerbId,
  initialAnswerFormKey,
  verbs,
}: FillInSentenceFormDialogProps) {
  const isCreate = sentence === null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {isCreate ? 'Invulzin toevoegen' : 'Invulzin bewerken'}
          </DialogTitle>
        </DialogHeader>
        <FillInSentenceForm
          sentence={sentence}
          initialVerbId={initialVerbId}
          fixedVerbId={fixedVerbId}
          initialAnswerFormKey={initialAnswerFormKey}
          verbs={verbs}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
