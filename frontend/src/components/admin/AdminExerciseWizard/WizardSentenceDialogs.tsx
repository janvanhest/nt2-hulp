import { DeleteSentenceConfirmDialog } from '@/components/DeleteSentenceConfirmDialog'
import { FillInSentenceFormDialog } from '@/components/FillInSentenceFormDialog'
import { toast } from 'sonner'
import type { WizardSentenceDialogsProps } from './types'

/**
 * Add/edit and delete sentence dialogs for the admin exercise wizard (step 3 & 4).
 */
export const WizardSentenceDialogs = ({
  sentenceDialogOpen,
  setSentenceDialogOpen,
  sentenceToEdit,
  setSentenceToEdit,
  sentenceToDelete,
  setSentenceToDelete,
  createdVerb,
  verbs,
  deleteSentenceMutation,
}: WizardSentenceDialogsProps) => (
  <>
    <FillInSentenceFormDialog
      open={sentenceDialogOpen}
      onOpenChange={(open) => {
        setSentenceDialogOpen(open)
        if (!open) setSentenceToEdit(null)
      }}
      sentence={sentenceToEdit}
      initialVerbId={createdVerb?.id}
      fixedVerbId={createdVerb?.id}
      verbs={verbs}
    />

    <DeleteSentenceConfirmDialog
      open={sentenceToDelete != null}
      onOpenChange={(open) => {
        if (!open) setSentenceToDelete(null)
      }}
      sentence={sentenceToDelete}
      onConfirm={() => {
        if (sentenceToDelete == null) return
        deleteSentenceMutation.mutate(sentenceToDelete.id, {
          onSuccess: () => {
            toast.success('Invulzin verwijderd.')
            setSentenceToDelete(null)
          },
          onError: (err) => {
            toast.error(
              err instanceof Error ? err.message : 'Verwijderen mislukt'
            )
          },
        })
      }}
      isPending={deleteSentenceMutation.isPending}
    />
  </>
)
