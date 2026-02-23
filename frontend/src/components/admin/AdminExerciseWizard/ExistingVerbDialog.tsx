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
import type { WizardExistingVerbDialogProps } from './types'

/**
 * Dialog when the user enters an infinitive that already exists.
 * Offers to load that verb and go to step 2.
 */
export const ExistingVerbDialog = ({
  open,
  onConfirm,
  onCancel,
}: WizardExistingVerbDialogProps) => (
  <AlertDialog
    open={open}
    onOpenChange={(isOpen) => {
      if (!isOpen) onCancel()
    }}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Werkwoord bestaat al</AlertDialogTitle>
        <AlertDialogDescription>
          Dit werkwoord staat al in de lijst. Wilt u de reeds bekende data laden
          en naar stap 2 gaan om de vormen te bewerken?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Annuleren</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>
          Ja, data laden
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
