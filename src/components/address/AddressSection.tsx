import { Edit2, MapPinCheckInside } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface AddressSectionProps {
  fullName: string
  phone: string
  address: string
  isDefault: boolean
}
export default function AddressSection({ fullName, phone, address, isDefault }: AddressSectionProps) {
  const { t } = useTranslation()
  return (
    <div className="w-full mx-auto shadow-sm bg-white rounded-md">
      <div className="p-4 space-y-3">
        {/* Delivery Section */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            <MapPinCheckInside className="w-5 h-5" />
            <h2 className="text-lg text-muted-foreground">{t('address.deliveryTo')}</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-500 h-auto p-0">
            <Edit2 className="w-4 h-4 mr-1" />
            {t('address.edit')}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="font-medium pr-2 border-r border-gray-300">{fullName}</div>
            <div className="font-medium">{phone}</div>
          </div>
          <div className="flex gap-2 text-muted-foreground">
            {isDefault && (
              <div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-sm rounded">{t('address.default')}</span>
              </div>
            )}
            <span>{address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
