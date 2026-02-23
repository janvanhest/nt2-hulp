import { Button } from '@/components/ui/button'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { ROUTES } from '@/lib/routes'
import { TOTAL_VERB_FORMS } from '@/lib/sentenceUtils'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Link } from 'react-router'

export interface VerbSentenceCardActionsProps {
  detailsOpen: boolean
  isExpanded: boolean
  onExpandChange: (open: boolean) => void
  onAddSentence?: (verbId: number) => void
  verbId: number
  sentenceCount: number
  /** When false, hide the "Vormen" / "Verberg vormdetails" toggle. */
  showFormCoverage?: boolean
}

const toggleButtonClass =
  'group w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground'

export function VerbSentenceCardActions({
  detailsOpen,
  isExpanded,
  onExpandChange,
  onAddSentence,
  verbId,
  sentenceCount,
  showFormCoverage = true,
}: VerbSentenceCardActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-2 sm:min-w-[10rem] sm:max-w-[13rem]'
      )}
    >
      <div className="flex flex-row flex-wrap gap-1">
        {showFormCoverage && (
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(toggleButtonClass, 'min-h-9 sm:min-h-8')}
              aria-expanded={detailsOpen}
              aria-label="Vormen per type tonen of verbergen"
            >
              {detailsOpen ? (
                <>
                  <ChevronUpIcon className="size-4 shrink-0" />
                  <span className="sm:inline">Verberg vormdetails</span>
                  <span className="sm:hidden">Vormen</span>
                </>
              ) : (
                <>
                  <ChevronDownIcon className="size-4 shrink-0" />
                  Vormen ({TOTAL_VERB_FORMS})
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(toggleButtonClass, 'min-h-9 sm:min-h-8')}
          aria-expanded={isExpanded}
          aria-label="Zinnen tonen of verbergen"
          onClick={() => onExpandChange(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="size-4 shrink-0" />
              <span className="sm:inline">Verberg zinnen</span>
              <span className="sm:hidden">Zinnen</span>
            </>
          ) : (
            <>
              <ChevronDownIcon className="size-4 shrink-0" />
              Zinnen
              {sentenceCount > 0 && ` (${sentenceCount})`}
            </>
          )}
        </Button>
      </div>
      {onAddSentence != null ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-9 w-full sm:min-h-8"
          onClick={() => onAddSentence(verbId)}
        >
          Zin toevoegen
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm" className="min-h-9 w-full sm:min-h-8">
          <Link to={`${ROUTES.beheerOverzichtPerWerkwoord}?verb=${verbId}`}>
            Zin toevoegen
          </Link>
        </Button>
      )}
    </div>
  )
}
