import { DownloadIcon, StarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface ExpertSectionProps {
  name: string
  title: string
  imageUrl: string
  certificateUrl?: string
}

export default function ExpertSection({ name, title, imageUrl, certificateUrl = '#' }: ExpertSectionProps) {
  const { t } = useTranslation()

  return (
    <Card className="mt-4 border border-border shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage src={imageUrl} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -bottom-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                <StarIcon className="h-3 w-3" />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t('beautyConsultation.yourExpert', 'Chuyên gia')}</div>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">{title}</div>
            </div>
          </div>

          {/* Expert Documents - link on the same row */}
          <a href={certificateUrl} className="text-sm text-primary flex items-center gap-1.5 hover:underline">
            <DownloadIcon className="h-3.5 w-3.5" />
            {t('beautyConsultation.downloadCertificates', 'Chứng chỉ')}
          </a>
        </div>
      </div>
    </Card>
  )
}
