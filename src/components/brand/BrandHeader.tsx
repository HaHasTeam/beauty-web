import { MessageSquare, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { useChat } from '@/hooks/useChat'

import { Button } from '../ui/button'

interface BrandHeaderProps {
  brandName: string
  brandId: string
  brandLogo: string
}

const BrandHeader = ({ brandName, brandId, brandLogo }: BrandHeaderProps) => {
  const { startChat, isNavigating } = useChat()

  const handleClick = () => {
    startChat(brandId, brandName, brandLogo)
  }
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">{brandName}</h1>
      <div className="flex gap-2 w-full md:w-auto">
        <Button
          className="flex-1 md:flex-none bg-primary hover:bg-primary/80"
          size="sm"
          onClick={handleClick}
          disabled={isNavigating}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {isNavigating ? t('brand.creating') : t('brand.chatNow')}
        </Button>
        <Link
          to={configs.routes.brands + '/' + brandId}
          className="px-2 rounded-md flex items-center flex-1 md:flex-none border border-primary text-primary hover:text-primary hover:bg-primary/10 text-sm"
        >
          <Store className="w-4 h-4 mr-2" />
          {t('brand.viewShop')}
        </Link>
      </div>
    </div>
  )
}

export default BrandHeader
