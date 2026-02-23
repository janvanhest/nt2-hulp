import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export interface Step3NoVerbCardProps {
  onGoToStep1: () => void
}

/**
 * Shown on step 3 when no verb has been created yet.
 * Prompts the user to go to step 1 first.
 */
export const Step3NoVerbCard = ({ onGoToStep1 }: Step3NoVerbCardProps) => (
  <Card className="mt-8 max-w-lg">
    <CardHeader>
      <CardTitle>Stap 3: Invulzinnen</CardTitle>
      <CardDescription>
        Ga eerst naar stap 1 om een werkwoord toe te voegen, daarna kun je hier
        invulzinnen beheren.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button type="button" onClick={onGoToStep1}>
        Naar stap 1
      </Button>
    </CardContent>
  </Card>
)
