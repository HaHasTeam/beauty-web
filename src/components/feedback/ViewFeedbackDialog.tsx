import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { IBrand } from '@/types/brand'
import { IClassification } from '@/types/classification'
import { IResponseFeedback } from '@/types/feedback'

import Button from '../button'
import BrandAnswer from '../reviews/BrandAnswer'
import CustomerReview from '../reviews/CustomerReview'

interface ViewFeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  feedback: IResponseFeedback
  productQuantity: number
  productClassification: IClassification | null
  authorName: string
  authorAvatar: string
  brand: IBrand | null
}

export const ViewFeedbackDialog: React.FC<ViewFeedbackDialogProps> = ({
  productClassification,
  productQuantity,
  isOpen,
  onClose,
  feedback,
  brand,
  authorAvatar,
  authorName,
}) => {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">{t('feedback.viewReview')}</DialogTitle>
        </DialogHeader>

        <CustomerReview
          authorName={authorName}
          authorAvatar={authorAvatar}
          updatedAt={feedback.updatedAt}
          classification={productClassification}
          numberOfItem={productQuantity}
          description={feedback.content}
          mediaFiles={feedback.mediaFiles}
          rating={feedback.rating}
        />
        <BrandAnswer brandName={brand?.name ?? ''} updatedAt={''} description={''} brandLogo={brand?.logo ?? ''} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('button.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
