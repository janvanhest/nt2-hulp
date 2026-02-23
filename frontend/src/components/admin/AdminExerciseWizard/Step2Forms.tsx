import { VerbFormEditor, getInitialVerbForm } from '@/components/VerbFormEditor'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { WizardStep2Props } from './types'

export const Step2Forms = ({
  verb,
  onSubmit,
  isPending,
  fieldErrors,
}: WizardStep2Props) => {
  const initial = getInitialVerbForm(verb)
  return (
    <Card className="mt-8 max-w-4xl">
      <CardHeader>
        <CardTitle>Stap 2: Vormen invullen</CardTitle>
        <CardDescription>
          Vul de werkwoordsvormen in voor "{verb.infinitive}".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerbFormEditor
          key={verb.id}
          initialInfinitive={initial.infinitive}
          initialForms={initial.forms}
          onSubmit={onSubmit}
          isPending={isPending}
          fieldErrors={fieldErrors}
          layout="twoColumns"
          submitLabel="Opslaan en naar stap 3"
        />
      </CardContent>
    </Card>
  )
}
