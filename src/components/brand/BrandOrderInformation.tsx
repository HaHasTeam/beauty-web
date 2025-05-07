import { MessageSquare, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { useChat } from '@/hooks/useChat'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

interface BrandOrderInformationProps {
  brandName: string
  brandId: string
  brandLogo: string
}

const BrandOrderInformation = ({ brandName, brandId, brandLogo }: BrandOrderInformationProps) => {
  const { t } = useTranslation()
  const { startChat, isNavigating } = useChat()

  const handleClick = () => {
    startChat(brandId, brandName, brandLogo)
  }
  return (
    <div className="space-y-2 bg-white shadow-sm w-full p-4 rounded-lg">
      <div className="flex sm:flex-row flex-col gap-2 sm:items-center">
        <div className="flex gap-2 items-center">
          <div className="flex items-center">
            {brandLogo && (
              <Avatar>
                <AvatarImage src={brandLogo} alt={brandName} />
                <AvatarFallback>{brandName.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
              </Avatar>
            )}
          </div>
          <Link to={configs.routes.brands + '/' + brandId} className="text-xl font-bold">
            {brandName}
          </Link>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            className="sm:gap-2 gap-1 flex-1 md:flex-none bg-primary hover:bg-primary/80 px-2 sm:px-3"
            size="sm"
            onClick={handleClick}
            disabled={isNavigating}
          >
            <MessageSquare className="w-4 h-4 sm:mr-2 mr-1" />
            {isNavigating ? t('brand.creating') : t('brand.chatNow')}
          </Button>
          <Link to={configs.routes.brands + '/' + brandId}>
            <div className="h-8 font-medium sm:gap-2 gap-1 px-2 rounded-md flex items-center flex-1 md:flex-none border border-primary text-primary hover:text-primary hover:bg-primary/10 text-xs">
              <Store className="w-4 h-4 sm:mr-2 mr-1" />
              {t('brand.viewShop')}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BrandOrderInformation
