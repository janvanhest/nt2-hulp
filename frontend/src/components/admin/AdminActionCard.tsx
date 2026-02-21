import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type AdminActionCardProps = {
  title: string
  description: string
  to: string
  isLoading: boolean
  badge?: string
}

export function AdminActionCard({
  title,
  description,
  to,
  isLoading,
  badge,
}: AdminActionCardProps) {
  return (
    <Card className="flex h-full flex-col rounded-xl border">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent
        className={
          badge
            ? 'mt-auto flex flex-wrap items-center gap-2'
            : 'mt-auto'
        }
      >
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <Button asChild variant="outline" size="sm">
              <Link to={to}>
                Openen
                <ChevronRight className="size-4" />
              </Link>
            </Button>
            {badge && (
              <Badge variant="secondary" className="tabular-nums">
                {badge}
              </Badge>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
