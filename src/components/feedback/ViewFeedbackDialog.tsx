import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import { replyFeedbackApi } from '@/network/apis/feedback'
import { getOrderByIdApi } from '@/network/apis/order'
import { getProductApi } from '@/network/apis/product'
import { getReplyFeedbackSchema } from '@/schemas/feedback.schema'
import { useStore } from '@/store/store'
import { IBrand } from '@/types/brand'
import { IClassification } from '@/types/classification'
import { RoleEnum, ServiceTypeEnum } from '@/types/enum'
import { IResponseFeedback } from '@/types/feedback'

import Button from '../button'
import BrandAnswer from '../reviews/BrandAnswer'
import CustomerReview from '../reviews/CustomerReview'
import { ScrollArea } from '../ui/scroll-area'

interface ViewFeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  feedback: IResponseFeedback
  productQuantity?: number
  productClassification?: IClassification | null
  brand: IBrand | null
  accountAvatar: string
  accountName: string
  orderDetailId?: string
  bookingId?: string
  systemServiceName?: string
  systemServiceType?: ServiceTypeEnum | null
}

export const ViewFeedbackDialog: React.FC<ViewFeedbackDialogProps> = ({
  productClassification,
  productQuantity,
  systemServiceType,
  systemServiceName,
  isOpen,
  onClose,
  feedback,
  accountAvatar,
  accountName,
  orderDetailId,
  bookingId,
  brand,
}) => {
  const { t } = useTranslation()
  const [showRep, setShowRep] = useState(false)
  const { successToast } = useToast()
  const queryClient = useQueryClient()
  const ReplyFeedbackSchema = getReplyFeedbackSchema()
  const replyFormRef = useRef<HTMLDivElement>(null)
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )

  const defaultValues = {
    content: '',
  }

  const form = useForm<z.infer<typeof ReplyFeedbackSchema>>({
    resolver: zodResolver(ReplyFeedbackSchema),
    defaultValues,
  })

  useMutation({
    mutationKey: [replyFeedbackApi.mutationKey],
    mutationFn: replyFeedbackApi.fn,
    onSuccess: () => {
      successToast({
        message: t('feedback.successRepTitle'),
        description: t('feedback.successRepDescription'),
      })
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getProductApi.queryKey],
      })
      handleReset()
    },
  })

  const handleReset = () => {
    form.reset()
    setShowRep(false)
  }

  const handleReplyClick = () => {
    setShowRep(true)
    setTimeout(() => {
      replyFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  useEffect(() => {
    if (!isOpen) {
      setShowRep(false)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-2xl sm:max-w-lg">
        <ScrollArea className="max-h-96">
          <div className="space-y-3">
            <DialogHeader>
              <DialogTitle className="text-primary">{t('feedback.viewReview')}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            {/* Feedback Order */}
            {(user?.role === RoleEnum.ADMIN ||
              user?.role === RoleEnum.OPERATOR ||
              user?.role === RoleEnum.MANAGER ||
              user?.role === RoleEnum.STAFF) && (
              <div className="flex items-center justify-between text-sm text-gray-500 mr-2">
                <div>
                  <span className="font-medium">{t('feedback.ID')}:</span> {feedback.id.substring(0, 8).toUpperCase()}
                </div>
                {orderDetailId && (
                  <div>
                    <span className="font-medium"> {t('feedback.order')}:</span>{' '}
                    {orderDetailId.substring(0, 8).toUpperCase()}
                  </div>
                )}
              </div>
            )}
            {/* Feedback Booking */}
            {(user?.role === RoleEnum.ADMIN ||
              user?.role === RoleEnum.OPERATOR ||
              user?.role === RoleEnum.CONSULTANT) && (
              <div className="flex items-center justify-between text-sm text-gray-500 mr-2">
                <div>
                  <span className="font-medium">{t('feedback.ID')}:</span> {feedback.id.substring(0, 8).toUpperCase()}
                </div>
                {bookingId && (
                  <div>
                    <span className="font-medium"> {t('feedback.booking')}:</span>{' '}
                    {bookingId.substring(0, 8).toUpperCase()}
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <CustomerReview
                authorName={accountName}
                authorAvatar={accountAvatar}
                updatedAt={feedback.updatedAt}
                classification={productClassification}
                numberOfItem={productQuantity}
                systemServiceName={systemServiceName}
                systemServiceType={systemServiceType}
                description={feedback.content}
                mediaFiles={feedback.mediaFiles}
                rating={feedback.rating}
                onReplyClick={handleReplyClick}
                brand={brand}
              />
              <BrandAnswer
                showRep={showRep}
                replies={feedback.replies}
                feedback={feedback}
                isOpen={isOpen}
                setShowRep={setShowRep}
                replyFormRef={replyFormRef}
                onReplyClick={handleReplyClick}
                brand={brand}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="mr-2 border border-primary text-primary hover:text-primary hover:bg-primary/10"
                type="button"
                onClick={onClose}
              >
                {t('button.close')}
              </Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
