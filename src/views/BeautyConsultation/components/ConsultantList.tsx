import { ChevronRight, Clock, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import configs from '@/config'

import { consultantInfo } from '../data/consultantInfo'

interface ConsultantListProps {
  filter?: 'all' | 'standard' | 'premium'
}

export default function ConsultantList({ filter = 'all' }: ConsultantListProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleServiceClick = (serviceId: string) => {
    navigate(`${configs.routes.beautyConsultation}/${serviceId}`)
  }

  const navigateToExpertProfile = (consultantId: string) => {
    // For now, navigate to the first service of the consultant
    const consultant = consultantInfo.find((c) => c.id === consultantId)
    if (consultant && consultant.services.length > 0) {
      handleServiceClick(consultant.services[0].id)
    }
  }

  // Format currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Filter consultants based on selected tab
  const filteredConsultants = consultantInfo.filter((consultant) => {
    if (filter === 'all') return true
    return consultant.services.some((service) =>
      filter === 'standard' ? service.type === 'STANDARD' : service.type === 'PREMIUM',
    )
  })

  if (filteredConsultants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('beautyConsultation.noConsultants', 'Không tìm thấy chuyên gia phù hợp.')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultants.map((consultant) => {
          // Filter services based on the selected tab
          const filteredServices = consultant.services.filter(
            (service) =>
              filter === 'all' || (filter === 'standard' ? service.type === 'STANDARD' : service.type === 'PREMIUM'),
          )

          // Only show up to 2 services
          const displayedServices = filteredServices.slice(0, 2)
          const hasMoreServices = filteredServices.length > 2

          return (
            <Card
              key={consultant.id}
              className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Consultant Header */}
              <CardHeader className="p-0">
                <div className="relative h-40 overflow-hidden bg-muted/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                  <img src={consultant.imageUrl} alt={consultant.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 p-4 z-20">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white">{consultant.name}</h3>
                      <div className="flex items-center text-white/90 text-sm bg-black/30 px-2 py-0.5 rounded-full">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{consultant.rating}</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mt-1.5">
                      {consultant.experience} {t('beautyConsultation.yearsExperience', 'năm kinh nghiệm')} •{' '}
                      {consultant.expertise[0]}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Consultant Description */}
              <CardContent className="py-3 px-4 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{consultant.description}</p>

                {/* Consultant Services - Compact design with limit */}
                <div className="mt-2 space-y-1.5">
                  {displayedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-muted/20 border-b border-muted/30 last:border-0"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <Badge
                            variant={service.type === 'PREMIUM' ? 'destructive' : 'secondary'}
                            className="text-[10px] h-5 px-1.5 whitespace-nowrap"
                          >
                            {service.type === 'PREMIUM'
                              ? t('beautyConsultation.premium', 'Cao cấp')
                              : t('beautyConsultation.standard', 'Tiêu chuẩn')}
                          </Badge>
                          <span className="text-sm font-medium text-primary ml-1">{formatPrice(service.price)}</span>
                          {service.type === 'PREMIUM' && (
                            <span className="text-muted-foreground flex items-center text-xs whitespace-nowrap ml-1">
                              <Clock className="h-3 w-3 mr-0.5" />
                              60 {t('beautyConsultation.min', 'phút')}
                            </span>
                          )}
                        </div>
                        <span className="text-base font-medium">{service.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 rounded-full text-sm hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleServiceClick(service.id)}
                      >
                        {t('beautyConsultation.book', 'Đặt')}
                      </Button>
                    </div>
                  ))}

                  {/* "View more" button if there are more than 2 services */}
                  {hasMoreServices && (
                    <div className="flex justify-center mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-sm w-full flex items-center justify-center"
                        onClick={() => navigateToExpertProfile(consultant.id)}
                      >
                        {t('beautyConsultation.viewMore', 'Xem thêm')}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
