import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type AdminStatCardProps = {
  title: string
  description: string
  isLoading: boolean
  children: React.ReactNode
}

export function AdminStatCard({
  title,
  description,
  isLoading,
  children,
}: AdminStatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-14" />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
