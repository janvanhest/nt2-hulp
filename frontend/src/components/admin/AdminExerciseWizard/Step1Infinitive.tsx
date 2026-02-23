import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { INFINITIVE_DESCRIPTION } from '@/lib/verbFormConfig'
import type { WizardStep1Props } from './types'

export const Step1Infinitive = ({
  infinitive,
  onInfinitiveChange,
  fieldErrors,
  onSubmit,
  isPending,
}: WizardStep1Props) => (
  <Card className="mt-8 max-w-md mx-auto">
    <CardHeader className="text-center">
      <CardTitle>Stap 1: Werkwoord toevoegen</CardTitle>
      <CardDescription>
        Voer de infinitief in. Na "Volgende stap" vul je in stap 2 de
        werkwoordsvormen in.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-6 items-center"
      >
        <div className="space-y-2 w-full max-w-xs flex flex-col items-center text-center">
          <Label htmlFor="step1-infinitive">Infinitief</Label>
          <Input
            id="step1-infinitive"
            className="w-full"
            value={infinitive}
            onChange={(e) => onInfinitiveChange(e.target.value)}
            onBlur={() =>
              onInfinitiveChange((v: string) => v.trim().toLowerCase())
            }
            aria-invalid={!!fieldErrors.infinitive}
            aria-describedby={
              fieldErrors.infinitive ? 'step1-infinitive-error' : undefined
            }
            placeholder="bijv. lopen"
          />
          {fieldErrors.infinitive && (
            <p
              id="step1-infinitive-error"
              className="text-destructive text-sm"
              role="alert"
            >
              {fieldErrors.infinitive}
            </p>
          )}
          <p className="text-muted-foreground text-sm">
            {INFINITIVE_DESCRIPTION}
          </p>
        </div>
        <div className="w-full flex justify-end">
          <Button type="submit" disabled={isPending} className="w-fit shrink-0">
            {isPending ? 'Bezig…' : 'Volgende stap'}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
)
