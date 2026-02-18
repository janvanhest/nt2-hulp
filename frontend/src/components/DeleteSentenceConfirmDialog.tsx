import type { FillInSentence } from '@/lib/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { sentencePreview } from '@/lib/sentenceUtils'

export interface DeleteSentenceConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sentence: FillInSentence | null
  onConfirm: () => void
  isPending: boolean
}

export function DeleteSentenceConfirmDialog({
  open,
  onOpenChange,
  sentence,
  onConfirm,
  isPending,
}: DeleteSentenceConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invulzin verwijderen</AlertDialogTitle>
          <AlertDialogDescription>
            Weet je zeker dat je deze invulzin wilt verwijderen?
            {sentence != null && (
              <span className="mt-2 block text-muted-foreground">
                {sentencePreview(sentence.sentence_template, 80)}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuleren</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Bezig…' : 'Verwijderen'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
