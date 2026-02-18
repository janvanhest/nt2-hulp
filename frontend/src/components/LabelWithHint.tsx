import { Info } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface LabelWithHintProps {
  htmlFor: string
  label: string
  hint?: string
}

/**
 * Label with optional hint in a tooltip. Keeps form labels and hints in one place;
 * hint is exposed to assistive tech via the trigger’s aria-describedby.
 */
export function LabelWithHint({ htmlFor, label, hint }: LabelWithHintProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined

  return (
    <Label htmlFor={htmlFor} className="flex items-center gap-1.5">
      {label}
      {hint != null && hint !== '' && (
        <Tooltip>
          <TooltipTrigger
            type="button"
            tabIndex={0}
            className="inline-flex rounded p-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Uitleg"
            aria-describedby={hintId}
          >
            <Info aria-hidden className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent id={hintId} side="top" className="max-w-xs">
            {hint}
          </TooltipContent>
        </Tooltip>
      )}
    </Label>
  )
}
