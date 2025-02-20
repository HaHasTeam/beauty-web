import { Card, CardContent } from '../ui/card'

export const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <Card className="w-20">
    <CardContent className="p-2 text-center">
      <div className="text-2xl font-bold">{String(value).padStart(2, '0')}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
)
