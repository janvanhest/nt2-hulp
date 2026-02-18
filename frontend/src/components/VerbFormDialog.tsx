import type { Verb, VerbPayload } from '@/lib/api'
import { ApiError, getFieldErrors } from '@/lib/api'
import {
  VerbFormEditor,
  getInitialVerbForm,
} from '@/components/VerbFormEditor'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateVerb, useUpdateVerb } from '@/hooks/useVerbs'
import { toast } from 'sonner'
import * as React from 'react'

export interface VerbFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  verb: Verb | null
}

export function VerbFormDialog({ open, onOpenChange, verb }: VerbFormDialogProps) {
  const createMutation = useCreateVerb()
  const updateMutation = useUpdateVerb()
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const isCreate = verb === null
  const isPending = createMutation.isPending || updateMutation.isPending
  const initial = React.useMemo(
    () => getInitialVerbForm(verb),
    [verb?.id, verb?.infinitive, verb?.forms]
  )

  React.useEffect(() => {
    if (!open) setFieldErrors({})
  }, [open])

  const handleSubmit = async (payload: VerbPayload) => {
    setFieldErrors({})
    try {
      if (isCreate) {
        await createMutation.mutateAsync(payload)
        toast.success('Werkwoord toegevoegd.')
      } else {
        await updateMutation.mutateAsync({ id: verb.id, data: payload })
        toast.success('Werkwoord bijgewerkt.')
      }
      onOpenChange(false)
    } catch (error) {
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
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {isCreate ? 'Werkwoord toevoegen' : 'Werkwoord bewerken'}
          </DialogTitle>
        </DialogHeader>
        <VerbFormEditor
          key={verb?.id ?? 'new'}
          initialInfinitive={initial.infinitive}
          initialForms={initial.forms}
          onSubmit={handleSubmit}
          isPending={isPending}
          fieldErrors={fieldErrors}
        />
      </DialogContent>
    </Dialog>
  )
}
