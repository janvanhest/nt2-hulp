import {
  ExistingVerbDialog,
  Step1Infinitive,
  Step2Forms,
  Step3NoVerbCard,
  Step3Sentences,
  Step4SummaryAndExercise,
  WizardSentenceDialogs,
} from '@/components/admin/AdminExerciseWizard'
import { AdminExerciseWizardStepper } from '@/components/admin/AdminExerciseWizardStepper'
import { useAdminGenerateExerciseWizard } from '@/hooks/useAdminGenerateExerciseWizard'

export const AdminGenerateExercisePage = () => {
  const wizard = useAdminGenerateExerciseWizard()
  const { currentStep, createdVerb } = wizard

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Oefening toevoegen</h1>
      <p className="text-muted-foreground mt-1">
        Volg de stappen. Na elke stap kun je door naar de volgende.
      </p>

      <AdminExerciseWizardStepper {...wizard.stepper} />

      {currentStep === 1 && <Step1Infinitive {...wizard.step1} />}

      <ExistingVerbDialog {...wizard.existingVerbDialog} />

      {currentStep === 2 && wizard.step2 != null && (
        <Step2Forms {...wizard.step2} />
      )}

      {currentStep === 3 && wizard.step3 != null && (
        <Step3Sentences {...wizard.step3} />
      )}

      {currentStep === 3 && createdVerb == null && (
        <Step3NoVerbCard onGoToStep1={() => wizard.stepper.onStepClick(1)} />
      )}

      <WizardSentenceDialogs {...wizard.sentenceDialogs} />

      {currentStep === 4 && wizard.step4 != null && (
        <Step4SummaryAndExercise {...wizard.step4} />
      )}
    </main>
  )
}
