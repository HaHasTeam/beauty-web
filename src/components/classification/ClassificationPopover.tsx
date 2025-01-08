import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createCartItemApi, deleteCartItemApi, getCartByIdApi, getMyCartApi } from '@/network/apis/cart'
import { IClassification } from '@/types/classification'
import { checkCurrentProductClassificationActive } from '@/utils/product'

import Empty from '../empty/Empty'
import LoadingContentLayer from '../loading-icon/LoadingContentLayer'

interface ClassificationPopoverProps {
  classifications: IClassification[]
  productClassification: IClassification | null
  cartItemId: string
  cartItemQuantity?: number
  preventAction?: boolean
}
export default function ClassificationPopover({
  classifications,
  productClassification,
  cartItemId,
  cartItemQuantity,
  preventAction,
}: ClassificationPopoverProps) {
  const { t } = useTranslation()
  const [currentSelectClassification, setCurrentSelectClassification] = useState<IClassification | null>(
    productClassification,
  )
  const [chosenClassification, setChosenClassification] = useState<IClassification | null>(productClassification)
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  // const isProductClassificationActive = checkCurrentProductClassificationActive(productClassification, classifications)
  const titleShown = chosenClassification?.title || t('productDetail.selectClassification')
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()

  const { mutateAsync: deleteCartItemFn } = useMutation({
    mutationKey: [deleteCartItemApi.mutationKey, cartItemId as string],
    mutationFn: deleteCartItemApi.fn,
    onSuccess: () => {
      successToast({
        message: t('cart.updateClassificationSuccess'),
      })
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })
      queryClient.invalidateQueries({
        queryKey: [getCartByIdApi.queryKey, cartItemId as string],
      })
    },
  })

  const { mutateAsync: createCartItemFn } = useMutation({
    mutationKey: [createCartItemApi.mutationKey],
    mutationFn: createCartItemApi.fn,
    onSuccess: () => {
      handleDeleteCartItem()
    },
  })
  const handleClassificationUpdate = useCallback(
    async (updateClassification: IClassification | null) => {
      if (isProcessing) return
      setIsProcessing(true)

      try {
        await createCartItemFn({
          quantity: cartItemQuantity ?? 1,
          classification: updateClassification?.title ?? '',
          productClassification: updateClassification?.id ?? '',
        })
      } catch (error) {
        handleServerError({ error })
      } finally {
        setChosenClassification(currentSelectClassification)
        setIsProcessing(false)
      }
    },
    [cartItemQuantity, createCartItemFn, currentSelectClassification, handleServerError, isProcessing],
  )

  const handleDeleteCartItem = async () => {
    try {
      await deleteCartItemFn(cartItemId)
    } catch (error) {
      handleServerError({ error })
    }
  }
  const handleSelect = (option: IClassification) => {
    setCurrentSelectClassification(option)
  }

  const handleSave = () => {
    if (
      currentSelectClassification?.id !== productClassification?.id ||
      currentSelectClassification?.title !== productClassification?.title
    ) {
      handleClassificationUpdate(currentSelectClassification)
    }

    setIsOpen(false)
  }

  const handleCancel = () => {
    setCurrentSelectClassification(chosenClassification)
    setIsOpen(false)
  }
  return isProcessing ? (
    <LoadingContentLayer />
  ) : (
    <div className="w-full">
      <div className="w-full space-y-2">
        <div className="w-full flex items-center gap-2">
          <Label className="w-fit">
            <span className="text-muted-foreground lg:text-sm text-xs overflow-ellipsis">
              {t('productDetail.classification')}
            </span>
          </Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-fit h-7 overflow-ellipsis" disabled={preventAction}>
                <span className="line-clamp-2">{titleShown}</span>
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="end">
              <div className="p-4 border-b">
                <Label> {t('productDetail.classification')}</Label>
              </div>
              <div className="p-2 flex flex-wrap gap-1">
                {classifications && classifications?.length > 0 ? (
                  classifications?.map((option) => (
                    <Button
                      key={option?.id}
                      variant="outline"
                      disabled={!checkCurrentProductClassificationActive(option, classifications)}
                      className={`w-fit h-fit justify-start px-2 py-2 text-sm ${
                        currentSelectClassification?.id === option?.id ? 'bg-accent text-accent-foreground' : ''
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      <div className="w-10 h-10 rounded-md">
                        <img
                          alt="option"
                          src={option?.images[0]?.fileUrl}
                          className="w-full h-full object-contain rounded-md"
                        />
                      </div>
                      {option?.title}
                    </Button>
                  ))
                ) : (
                  <Empty title={t('empty.classification.title')} description={t('empty.classification.description')} />
                )}
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  {t('button.cancel')}
                </Button>
                <Button size="sm" onClick={handleSave}>
                  {t('button.save')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
