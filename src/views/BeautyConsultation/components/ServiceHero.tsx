import { PlayCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import DEFAULT_IMAGE from '@/assets/images/consultant-default.jpg'
// Default image to use when an image fails to load

interface ServiceHeroProps {
  title: string
  mainImage: string
  additionalImages?: string[]
  onVideoPlay: () => void
}

export default function ServiceHero({ title, mainImage, additionalImages = [], onVideoPlay }: ServiceHeroProps) {
  const { t } = useTranslation()
  const allImages = [mainImage, ...additionalImages]
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  // Handle image loading errors
  const handleImageError = (index: number) => {
    setImageErrors((prev: Record<number, boolean>) => ({ ...prev, [index]: true }))
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
        <img
          src={imageErrors[activeImageIndex] ? DEFAULT_IMAGE : allImages[activeImageIndex]}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => handleImageError(activeImageIndex)}
        />
        {/* Video Play Button Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
          onClick={onVideoPlay}
        >
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform">
            <PlayCircleIcon className="h-12 w-12 text-white" />
          </div>
          <span className="absolute bottom-4 text-white font-medium bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm">
            {t('beautyConsultation.watchIntro', 'Xem giới thiệu')}
          </span>
        </div>
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((img, idx) => (
            <div
              key={idx}
              className={`rounded-lg overflow-hidden aspect-square bg-muted border-2 cursor-pointer ${activeImageIndex === idx ? 'border-primary' : 'border-transparent'}`}
              onClick={() => setActiveImageIndex(idx)}
            >
              <img
                src={imageErrors[idx] ? DEFAULT_IMAGE : img}
                alt={`${title} - ${t('beautyConsultation.image', 'Hình ảnh')} ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError(idx)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
