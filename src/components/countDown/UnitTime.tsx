import { Card, CardContent } from '../ui/card'

export const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <Card className="w-[calc(25%-8px)] xs:w-12 sm:w-14">
    <CardContent className="p-1 text-center">
      <div className="text-sm xs:text-base sm:text-lg font-bold">{String(value).padStart(2, '0')}</div>
      <div className="text-[8px] sm:text-[10px] text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
)
