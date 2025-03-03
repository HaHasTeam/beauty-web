import { useTranslation } from 'react-i18next'

import { IReplyFeedback } from '@/types/feedback'
import { UserRoleEnum } from '@/types/role'

import RoleTag from '../account/RoleTag'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface BrandAnswerProps {
  replies: IReplyFeedback[]
}
const BrandAnswer = ({ replies }: BrandAnswerProps) => {
  const { t } = useTranslation()
  return (
    <div className="pl-4 pr-2">
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => {
          const brandLogo = ''
          const brandName = ''
          const updatedAt = reply.updatedAt
          const description = reply.content
          const brand = {}
          return (
            <div className="p-2 bg-secondary/20 rounded-full">
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center">
                  {brandLogo && (
                    <Avatar>
                      <AvatarImage src={brandLogo} alt={brandName} />
                      <AvatarFallback>{brandName?.charAt(0) ?? 'A'}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="font-semibold text-sm">{brandName}</span>
                  {brand && <RoleTag role={UserRoleEnum.MANAGER} isBrand />}
                </div>
                <div className="border-l px-2 border-gray-500">
                  <span className="text-gray-500 text-sm">
                    {t('order.lastUpdated')}: {t('date.toLocaleDateString', { val: new Date(updatedAt) })}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">{description}</p>
            </div>
          )
        })}
    </div>
  )
}

export default BrandAnswer
