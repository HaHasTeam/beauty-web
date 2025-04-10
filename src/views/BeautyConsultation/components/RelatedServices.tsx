import { FormInputIcon, StarIcon, VideoIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { consultationServices, formatCurrency } from '../data/mockData'
import { ConsultationService } from '../data/types'

// Default image to use when an image fails to load
const DEFAULT_IMAGE = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found'

interface RelatedServicesProps {
  currentServiceId: string
  category: string
  services: ConsultationService[]
  onServiceClick: (id: string) => void
  onViewAll: () => void
}

export default function RelatedServices({ currentServiceId, onServiceClick, onViewAll }: RelatedServicesProps) {
  const { t } = useTranslation()

  // Force display at least 2 services (excluding current) for testing purposes
  const relatedServices = consultationServices.filter((s) => s.id !== currentServiceId).slice(0, 2)

  return (
    <section className="mb-8 border border-primary/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">{t('beautyConsultation.relatedServices', 'Dịch vụ tương tự')}</h2>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-primary">
          {t('beautyConsultation.viewAll', 'Xem tất cả')} →
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedServices.map((service) => (
          <Card
            key={service.id}
            className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md group cursor-pointer border-border"
            onClick={() => onServiceClick(service.id)}
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = DEFAULT_IMAGE
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant={service.type === 'PREMIUM' ? 'destructive' : 'secondary'} className="shadow-sm">
                  {service.type === 'PREMIUM' ? (
                    <div className="flex items-center gap-1">
                      <VideoIcon className="h-3 w-3" />
                      <span>{t('beautyConsultation.premiumShort', 'Cao cấp')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <FormInputIcon className="h-3 w-3" />
                      <span>{t('beautyConsultation.standardShort', 'Tiêu chuẩn')}</span>
                    </div>
                  )}
                </Badge>
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col bg-white">
              <h3 className="font-medium mb-1 line-clamp-1">{service.title}</h3>
              <div className="text-sm text-muted-foreground line-clamp-2 mb-auto">{service.description}</div>
              <div className="mt-2 flex justify-between items-center pt-2 border-t border-border">
                <div className="font-bold text-primary">{formatCurrency(service.price)}</div>
                <div className="flex items-center text-sm bg-yellow-50 px-2 py-0.5 rounded-full">
                  <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  {service.rating}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
