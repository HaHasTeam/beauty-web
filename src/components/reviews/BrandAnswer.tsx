import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import { useStore } from '@/store/store'
import { IBrand } from '@/types/brand'
import { RoleEnum } from '@/types/enum'
import { IReplyFeedback, IResponseFeedback } from '@/types/feedback'

import RoleTag from '../account/RoleTag'
import { ReplyFeedbackForm } from '../feedback/ReplyFeedbackForm'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { UserRoleEnum } from '@/types/role'

interface BrandAnswerProps {
  replies: IReplyFeedback[]
  feedback: IResponseFeedback
  isOpen: boolean
  showRep: boolean
  setShowRep: Dispatch<SetStateAction<boolean>>
  replyFormRef: React.RefObject<HTMLDivElement>
  onReplyClick: () => void
  brand: IBrand | null
}
const BrandAnswer = ({
  replies,
  feedback,
  isOpen,
  showRep,
  setShowRep,
  replyFormRef,
  onReplyClick,
  brand,
}: BrandAnswerProps) => {
  const { t } = useTranslation()

  const { user } = useStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )
  const [showAllReplies, setShowAllReplies] = useState(false)

  if (!replies || replies.length === 0) {
    return null
  }

  const displayedReplies = showAllReplies || replies.length <= 2 ? replies : replies.slice(0, 2)

  const toggleReplies = () => {
    setShowAllReplies(!showAllReplies)
  }
  console.log(brand)

  return (
    <div className="pl-6 pr-2">
      <div>
        {displayedReplies.map((reply) => {
          const updatedAt = reply.updatedAt
          const description = reply.content
          const account = reply.account
          return (
            <>
              <div className="rounded-md">
                <div className="flex gap-2 items-start">
                  {brand && (account.role.role === UserRoleEnum.MANAGER || account.role.role === UserRoleEnum.STAFF) ? (
                    <Avatar>
                      <AvatarImage src={brand.logo} alt={brand.name} />
                      <AvatarFallback>{brand.name?.charAt(0) ?? 'A'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarImage src={account.avatar} alt={account.firstName} />
                      <AvatarFallback>{account.firstName?.charAt(0) ?? 'A'}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1">
                    <div className="flex gap-2 items-center">
                      {brand &&
                      (account.role.role === UserRoleEnum.MANAGER || account.role.role === UserRoleEnum.STAFF) ? (
                        <span className="font-semibold text-sm">{brand.name}</span>
                      ) : (
                        (account.firstName || account.lastName) && (
                          <span className="font-semibold text-sm">
                            {[account?.lastName, account?.firstName].join(' ')}
                          </span>
                        )
                      )}
                      {brand &&
                        (account.role.role === UserRoleEnum.MANAGER || account.role.role === UserRoleEnum.STAFF) && (
                          <RoleTag role={'BRAND'} size="small" />
                        )}
                    </div>
                    {brand &&
                      (user?.role === RoleEnum.ADMIN ||
                        user?.role === RoleEnum.OPERATOR ||
                        user?.role === RoleEnum.MANAGER ||
                        user?.role === RoleEnum.STAFF) &&
                      (account.role.role === UserRoleEnum.MANAGER || account.role.role === UserRoleEnum.STAFF) && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-xs text-muted-foreground">
                            {[account?.lastName, account?.firstName].join(' ')}
                          </span>
                          <RoleTag role={account?.role?.role} size="small" />
                        </div>
                      )}
                    <p className="mt-2 text-sm text-gray-700">{description}</p>
                  </div>
                </div>
              </div>
              <div className="ml-12 flex items-center gap-2">
                <span className="text-muted-foreground font-medium text-xs">
                  {t('date.toLocaleDateTimeString', { val: new Date(updatedAt) })}
                </span>
                {(user?.brands?.find((b) => b.id === brand?.id) || user?.role === RoleEnum.CUSTOMER) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-0 outline-0 text-muted-foreground hover:bg-transparent hover:text-muted-foreground/80"
                    onClick={onReplyClick}
                  >
                    {t('feedback.reply')}
                  </Button>
                )}
              </div>
            </>
          )
        })}
      </div>
      {replies.length > 2 && (
        <div className="ml-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleReplies}
            className="p-0 text-muted-foreground hover:bg-transparent hover:text-muted-foreground/80 hover:underline"
          >
            {showAllReplies ? t('button.showLess') : t('button.showMore', { count: replies.length - 2 })}
          </Button>
        </div>
      )}
      {showRep && <ReplyFeedbackForm ref={replyFormRef} isOpen={isOpen} feedback={feedback} setShowRep={setShowRep} />}
    </div>
  )
}

export default BrandAnswer
