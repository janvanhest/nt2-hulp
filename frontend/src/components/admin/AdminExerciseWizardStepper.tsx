import type { WizardStepperProps } from '@/components/admin/AdminExerciseWizard/types'
import { Badge } from '@/components/ui/badge'
import { countFilledForms } from '@/lib/verbFormConfig'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

export type AdminExerciseWizardStepperProps = WizardStepperProps

const LAST_STEP = 4
const STEP_LABELS: Record<number, string> = {
  1: 'Infinitief',
  2: 'Vormen',
  3: 'Zinnen',
  4: 'Afronden',
}

export const AdminExerciseWizardStepper = ({
  currentStep,
  createdVerb,
  stepComplete,
  stepActive,
  onStepClick,
  formCount,
}: WizardStepperProps) => {
  const steps: {
    index: number
    label: string
    disabled: boolean
    getBadge: () => ReactNode
  }[] = [
    {
      index: 1,
      label: STEP_LABELS[1],
      disabled: false,
      getBadge: () =>
        createdVerb != null ? (
          <Badge variant="secondary" className="text-xs w-fit">
            {createdVerb.infinitive}
          </Badge>
        ) : null,
    },
    {
      index: 2,
      label: STEP_LABELS[2],
      disabled: createdVerb == null,
      getBadge: () =>
        createdVerb != null ? (
          <Badge variant="secondary" className="text-xs w-fit">
            {stepActive(2)
              ? 'Bewerken'
              : countFilledForms(createdVerb.forms) === formCount
                ? 'ingevuld'
                : 'Onvolledig'}
          </Badge>
        ) : null,
    },
    {
      index: 3,
      label: STEP_LABELS[3],
      disabled: currentStep < 3,
      getBadge: () => null,
    },
    {
      index: 4,
      label: STEP_LABELS[4],
      disabled: currentStep < 4,
      getBadge: () => null,
    },
  ]

  return (
    <nav
      className="mt-6 relative flex w-full max-w-2xl justify-between px-2"
      aria-label="Voorbereidingsstappen"
    >
      <div
        className="absolute left-0 right-0 top-[18px] h-0.5 bg-muted -translate-y-1/2"
        aria-hidden
      />
      {steps.map(({ index, label, disabled, getBadge }) => {
        const complete = stepComplete(index)
        const active = stepActive(index)
        const showCheck = complete && index < LAST_STEP
        return (
          <button
            key={index}
            type="button"
            onClick={() => onStepClick(index)}
            disabled={disabled}
            className="relative z-10 flex flex-col items-center gap-1.5 min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
            aria-current={active ? 'step' : undefined}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                complete
                  ? 'bg-primary text-primary-foreground'
                  : active
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground'
                    : 'border-2 border-muted bg-background'
              }`}
            >
              {showCheck ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                index
              )}
            </span>
            <span className="text-xs font-medium text-center">{label}</span>
            {getBadge()}
          </button>
        )
      })}
    </nav>
  )
}
