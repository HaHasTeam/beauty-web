import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

// Default image to use when an image fails to load
const DEFAULT_IMAGE = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found'

interface ServiceCTAProps {
  onBookNow: () => void
  onExploreMore: () => void
}

export default function ServiceCTA({ onBookNow, onExploreMore }: ServiceCTAProps) {
  const { t } = useTranslation()

  return (
    <section className="mb-0">
      <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl overflow-hidden border border-border">
        <div className="grid md:grid-cols-5 items-center">
          <div className="md:col-span-3 p-5 md:p-6 text-center md:text-left">
            <h2 className="text-xl font-bold mb-2">
              {t('beautyConsultation.readyToBook', 'Sẵn sàng thay đổi thói quen làm đẹp của bạn?')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl md:pr-6">
              {t(
                'beautyConsultation.ctaMessage',
                'Đặt lịch tư vấn ngay hôm nay và thực hiện bước đầu tiên để có một vẻ ngoài tự tin và đẹp hơn.',
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button size="lg" className="px-6 bg-primary hover:bg-primary/90" onClick={onBookNow}>
                {t('beautyConsultation.bookNow', 'Đặt lịch ngay')}
              </Button>
              <Button size="lg" variant="outline" onClick={onExploreMore}>
                {t('beautyConsultation.exploreMore', 'Khám phá thêm dịch vụ')}
              </Button>
            </div>
          </div>
          <div className="hidden md:block md:col-span-2 h-full">
            <div className="relative h-full aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1487412947147-5cdc1cca4ac2?q=80&w=1974"
                alt="Beauty Consultation"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = DEFAULT_IMAGE
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
