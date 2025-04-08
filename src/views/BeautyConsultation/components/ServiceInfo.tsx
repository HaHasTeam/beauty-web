import {
  CalendarIcon,
  ClockIcon,
  FormInputIcon,
  MapPinIcon,
  MessageSquareIcon,
  StarIcon,
  VideoIcon
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { formatCurrency } from '../data/mockData'

interface ServiceInfoProps {
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: number;
  category: string;
  popular: boolean;
  type: "STANDARD" | "PREMIUM";
  onReadMore: () => void;
}

export default function ServiceInfo({
  title,
  description,
  price,
  rating, 
  reviewCount,
  duration,
  category,
  popular,
  type,
  onReadMore
}: ServiceInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border">
      {/* Header with badges and title */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Badge 
            variant={type === 'PREMIUM' ? 'destructive' : 'secondary'}
            className="uppercase"
          >
            {type === 'PREMIUM' ? (
              <div className="flex items-center gap-1">
                <VideoIcon className="h-3 w-3" />
                <span>{t('beautyConsultation.premium', 'Cao cấp')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <FormInputIcon className="h-3 w-3" />
                <span>{t('beautyConsultation.standard', 'Tiêu chuẩn')}</span>
              </div>
            )}
          </Badge>
          <Badge variant="outline">{category}</Badge>
          {popular && (
            <Badge variant="default" className="bg-primary/90">
              {t('beautyConsultation.popular', 'Phổ biến')}
            </Badge>
          )}
        </div>
        
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      {/* Price and Rating */}
      <div className="p-4 bg-muted/10 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          {formatCurrency(price)}
        </div>
        <div className="flex items-center">
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-base font-medium ml-1">{rating}</span>
          </div>
          <span className="text-sm text-muted-foreground ml-1">({reviewCount})</span>
        </div>
      </div>
      
      {/* Description with Read More link */}
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-start">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary ml-2 flex-shrink-0" 
            onClick={onReadMore}
          >
            <span className="text-xs">{t('beautyConsultation.readMore', 'Xem thêm')}</span>
          </Button>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ClockIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{t('beautyConsultation.duration', 'Thời gian')}</div>
            <div className="font-medium">{duration} {t('beautyConsultation.minutes', 'phút')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CalendarIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{t('beautyConsultation.scheduling', 'Lịch hẹn')}</div>
            <div className="font-medium">{t('beautyConsultation.flexibleScheduling', 'Linh hoạt')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPinIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{t('beautyConsultation.method', 'Phương thức')}</div>
            <div className="font-medium">{t('beautyConsultation.online', 'Trực tuyến')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MessageSquareIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{t('beautyConsultation.support', 'Hỗ trợ')}</div>
            <div className="font-medium">{t('beautyConsultation.followUpIncluded', 'Theo dõi sau')}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 