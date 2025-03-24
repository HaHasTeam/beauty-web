import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createCartItemApi, deleteCartItemApi, getCartByIdApi, getMyCartApi } from '@/network/apis/cart'
import { IClassification, IClassificationKey, IClassificationSelection } from '@/types/classification'
import { StatusEnum } from '@/types/enum'
import { checkCurrentProductClassificationActive } from '@/utils/product'

import Empty from '../empty/Empty'
import ImageWithFallback from '../ImageFallback'
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
  const [selectedValues, setSelectedValues] = useState<IClassificationSelection>({
    color: productClassification?.color || null,
    size: productClassification?.size || null,
    other: productClassification?.other || null,
  })

  // const isProductClassificationActive = checkCurrentProductClassificationActive(productClassification, classifications)
  const titleShown =
    [
      chosenClassification?.color && `${chosenClassification.color}`,
      chosenClassification?.size && `${chosenClassification.size}`,
      chosenClassification?.other && `${chosenClassification.other}`,
    ]
      .filter(Boolean)
      .join(', ') || t('productDetail.selectClassification')
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
  // const handleSelect = (option: IClassification) => {
  //   setCurrentSelectClassification(option)
  // }

  const getAvailableOptions = (key: IClassificationKey, selections: IClassificationSelection) => {
    return [
      ...new Set(
        classifications
          ?.filter((classification) => {
            return Object.entries(selections).every(
              ([k, v]) => !v || k === key || classification[k as IClassificationKey] === v,
            )
          })
          .map((classification) => classification[key]),
      ),
    ]
  }
  const allOptions = useMemo(() => {
    const getAllOptions = (key: IClassificationKey): string[] => {
      return [
        ...new Set(
          classifications
            ?.map((classification) => classification[key])
            .filter((value): value is string => value !== null),
        ),
      ]
    }
    return {
      color: getAllOptions('color'),
      size: getAllOptions('size'),
      other: getAllOptions('other'),
    }
  }, [classifications])
  const getFirstAttributeKey = useCallback(() => {
    const keys: IClassificationKey[] = ['color', 'size', 'other']
    for (const key of keys) {
      if (allOptions[key]?.length > 0) {
        return key
      }
    }
    return null
  }, [allOptions])

  const availableOptions = {
    color: getAvailableOptions('color', selectedValues),
    size: getAvailableOptions('size', selectedValues),
    other: getAvailableOptions('other', selectedValues),
  }

  const firstAttributeKey = getFirstAttributeKey()
  const handleSelection = (key: IClassificationKey, value: string) => {
    setSelectedValues((prev) => {
      const updatedValues = {
        ...prev,
        [key]: prev[key] === value ? null : value,
      }

      const classificationKeys = Object.keys(allOptions).filter((k) => allOptions[k as IClassificationKey].length > 0)

      const isComplete = classificationKeys.every((k) => updatedValues[k as IClassificationKey] !== null)

      console.log(isComplete)
      if (isComplete) {
        const matchingClassification = classifications?.find((classification) =>
          Object.entries(updatedValues).every(([k, v]) => !v || classification[k as IClassificationKey] === v),
        )

        if (matchingClassification) {
          setCurrentSelectClassification(matchingClassification)
        }
      } else {
        setCurrentSelectClassification(null)
      }

      return updatedValues
    })
  }

  const renderOptions = (key: IClassificationKey, options: string[]) => {
    if (!options.length) return null

    const showImage = key === firstAttributeKey
    return (
      <div className="flex gap-3 items-center w-full">
        <div className="text-gray-600 w-1/5">{t(`productDetail.${key.charAt(0).toUpperCase() + key.slice(1)}`)}</div>
        <div className="w-4/5 flex flex-wrap items-start gap-2">
          {options.map((option) => {
            const matchingClassifications = classifications.filter((c) => c[key] === option)

            const isPartOfCurrentClassification = currentSelectClassification
              ? currentSelectClassification[key] === option
              : false

            const isSelectedValue = selectedValues[key] === option

            const matchingClassification = matchingClassifications.find((c) =>
              Object.entries(selectedValues)
                .filter(([k]) => k !== key)
                .every(([k, v]) => !v || c[k as IClassificationKey] === v),
            )

            const isActive = matchingClassification
              ? checkCurrentProductClassificationActive(matchingClassification, classifications)
              : false

            return (
              // <Button
              //   onClick={() => handleSelection(key, option)}
              //   key={option}
              //   variant="outline"
              //   className={`w-fit h-fit justify-start px-2 py-2 text-sm ${
              //     selectedValues[key] === option ? 'bg-accent text-accent-foreground' : ''
              //   } ${currentSelectClassification?.id === classification?.id ? 'bg-accent text-accent-foreground' : ''}`}
              //   disabled={
              //     !availableOptions[key].includes(option) ||
              //     (classification && !checkCurrentProductClassificationActive(classification, classifications))
              //   }
              // >
              //   {showImage &&
              //     classification?.images?.filter((img) => img.status === StatusEnum.ACTIVE)?.[0]?.fileUrl && (
              //       <div className="w-10 h-10 rounded-md">
              //         <ImageWithFallback
              //           alt={option}
              //           src={classification.images?.filter((img) => img.status === StatusEnum.ACTIVE)?.[0].fileUrl}
              //           fallback={fallBackImage}
              //           className="w-full h-full object-cover rounded-md"
              //         />
              //       </div>
              //     )}
              //   {option}
              // </Button>
              <Button
                onClick={() => handleSelection(key, option)}
                key={option}
                variant="outline"
                className={`w-fit h-fit justify-start px-2 py-2 text-sm ${
                  isSelectedValue ? 'bg-accent text-accent-foreground' : ''
                } ${isPartOfCurrentClassification ? 'bg-accent text-accent-foreground' : ''}`}
                disabled={!availableOptions[key].includes(option) || !isActive}
              >
                {showImage &&
                  matchingClassification?.images?.filter((img) => img.status === StatusEnum.ACTIVE)?.[0]?.fileUrl && (
                    <div className="w-10 h-10 rounded-md">
                      <ImageWithFallback
                        alt={option}
                        src={
                          matchingClassification.images?.filter((img) => img.status === StatusEnum.ACTIVE)?.[0].fileUrl
                        }
                        fallback={fallBackImage}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                {option}
              </Button>
            )
          })}
        </div>
      </div>
    )
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
    setSelectedValues({
      color: chosenClassification?.color || null,
      size: chosenClassification?.size || null,
      other: chosenClassification?.other || null,
    })
    setIsOpen(false)
  }
  console.log(classifications, classifications.length > 0)
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
              <Button
                variant="outline"
                size="sm"
                className="max-w-fit sm:w-fit sm:h-7 h-6 overflow-ellipsis"
                disabled={preventAction}
              >
                <span className="line-clamp-2">{titleShown}</span>
                <ChevronDown className="sm:w-4 sm:h-4 h-2 w-2 ml-1 sm:ml-2 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="md:w-[360px] sm:w-[200px] w-[200px] p-0" align="end">
              <div className="p-4 border-b">
                <Label> {t('productDetail.classification')}</Label>
              </div>
              <div className="p-2 flex flex-wrap gap-1">
                {classifications && classifications?.length > 0 ? (
                  // classifications?.map((option) => (
                  //   <Button
                  //     key={option?.id}
                  //     variant="outline"
                  //     disabled={!checkCurrentProductClassificationActive(option, classifications)}
                  //     className={`w-fit h-fit justify-start px-2 py-2 text-sm ${
                  //       currentSelectClassification?.id === option?.id ? 'bg-accent text-accent-foreground' : ''
                  //     }`}
                  //     onClick={() => handleSelect(option)}
                  //   >
                  //     <div className="w-10 h-10 rounded-md">
                  //       <img
                  //         alt="option"
                  //         src={option?.images[0]?.fileUrl}
                  //         className="w-full h-full object-contain rounded-md"
                  //       />
                  //     </div>
                  //     {option?.title}
                  //   </Button>
                  // ))
                  <>
                    {allOptions.color.length > 0 && renderOptions('color', allOptions.color)}
                    {allOptions.size.length > 0 && renderOptions('size', allOptions.size)}
                    {allOptions.other.length > 0 && renderOptions('other', allOptions.other)}
                  </>
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
