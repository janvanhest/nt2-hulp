import type { AnswerFormKey, FillInSentence, Verb } from '@/lib/api'
import { FillInSentenceForm } from '@/components/FillInSentenceForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface FillInSentenceFormCardProps {
  /** Existing sentence when editing; null for create. */
  sentence: FillInSentence | null
  initialVerbId?: number
  initialAnswerFormKey?: AnswerFormKey | ''
  verbs: Verb[]
  onSuccess: () => void
  onCancel?: () => void
}

export function FillInSentenceFormCard({
  sentence,
  initialVerbId,
  initialAnswerFormKey,
  verbs,
  onSuccess,
  onCancel,
}: FillInSentenceFormCardProps) {
  const isCreate = sentence === null

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCreate ? 'Invulzin toevoegen' : 'Invulzin bewerken'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FillInSentenceForm
          sentence={sentence}
          initialVerbId={initialVerbId}
          initialAnswerFormKey={initialAnswerFormKey}
          verbs={verbs}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  )
}
