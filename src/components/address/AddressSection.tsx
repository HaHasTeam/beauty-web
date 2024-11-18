import { Edit2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AddressSectionProps {
  fullName: string
  phone: string
  address: string
  type: string
}
export default function AddressSection({ fullName, phone, address, type }: AddressSectionProps) {
  const { t } = useTranslation()
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 space-y-6">
        {/* Delivery Section */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg text-muted-foreground">{t('address.deliveryTo')}</h2>
          <Button variant="ghost" size="sm" className="text-blue-500 h-auto p-0">
            <Edit2 className="w-4 h-4 mr-1" />
            {t('address.edit')}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="font-medium">{fullName}</div>
            <div className="text-muted-foreground">{phone}</div>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-sm rounded">{type}</span>
            <span>{address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
