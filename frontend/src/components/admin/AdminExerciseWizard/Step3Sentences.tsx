import { VerbSentenceTable } from '@/components/VerbSentenceTable'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link } from 'react-router'
import { ROUTES } from '@/lib/routes'
import {
  countCoveredForms,
  TARGET_SENTENCES_PER_FORM_OPTIONS,
  TOTAL_VERB_FORMS,
} from '@/lib/sentenceUtils'
import type { WizardStep3Props } from './types'

export const Step3Sentences = ({
  createdVerb,
  sentences,
  targetSentencesPerForm,
  onTargetChange,
  onAddSentence,
  onEditSentence,
  onDeleteSentence,
  onGoToStep4,
}: WizardStep3Props) => (
  <Card className="mt-8 max-w-4xl">
    <CardHeader>
      <CardTitle>Stap 3: Invulzinnen voor {createdVerb.infinitive}</CardTitle>
      <CardDescription>
        Voeg invulzinnen toe voor dit werkwoord. Kies de werkwoordsvorm en
        optioneel een of meer thema&apos;s.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 rounded-md border bg-muted/30 px-3 py-2">
        <Label htmlFor="step3-target" className="text-sm font-medium">
          Streef aantal invulzinnen per werkwoordsvorm:
        </Label>
        <Select
          value={String(targetSentencesPerForm)}
          onValueChange={(v) => onTargetChange(Number(v))}
        >
          <SelectTrigger id="step3-target" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TARGET_SENTENCES_PER_FORM_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm">
          {countCoveredForms(sentences, targetSentencesPerForm)} van{' '}
          {TOTAL_VERB_FORMS} werkwoordsvormen hebben min. dit aantal zinnen.
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" onClick={onAddSentence}>
          Zin toevoegen
        </Button>
        <Link
          to={ROUTES.beheerOverzichtPerWerkwoordWithView('zinnen')}
          className="text-sm text-muted-foreground hover:underline"
        >
          Naar Zinnen beheren
        </Link>
      </div>
      <VerbSentenceTable
        sentences={sentences}
        onEditSentence={(s, _e) => onEditSentence(s)}
        onDeleteSentence={onDeleteSentence}
      />
      <div className="flex justify-end pt-2">
        <Button type="button" onClick={onGoToStep4}>
          Ga naar stap 4: Overzicht werkwoord
        </Button>
      </div>
    </CardContent>
  </Card>
)
