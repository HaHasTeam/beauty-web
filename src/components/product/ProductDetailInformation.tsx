import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IClassification, IClassificationKey, IClassificationSelection } from '@/types/classification'
import { DiscountTypeEnum, OrderEnum, ProductDiscountEnum } from '@/types/enum'
import { IProduct } from '@/types/product'
import { calculateDiscountPrice } from '@/utils/price'

import { Button } from '../ui/button'
import PriceSection from './PriceSection'
import ProductDetailInfoSection from './ProductDetailInfoSection'
import ProductStar from './ProductStar'
import ProductTag from './ProductTag'
import SpecialEvent from './SpecialEvent'

interface ProductDetailInformationProps {
  product: IProduct
  scrollToReviews: () => void
  cheapestClassification: IClassification | null
  productClassifications?: IClassification[] | null
  event: OrderEnum
  chosenClassification: IClassification | null
  setChosenClassification: Dispatch<SetStateAction<IClassification | null>>
  hasCustomType: boolean
}

const ProductDetailInformation = ({
  product,
  scrollToReviews,
  productClassifications,
  cheapestClassification,
  event,
  chosenClassification,
  setChosenClassification,
  hasCustomType,
}: ProductDetailInformationProps) => {
  const { t } = useTranslation()
  const [selectedValues, setSelectedValues] = useState<IClassificationSelection>({
    color: null,
    size: null,
    other: null,
  })

  const getAllOptions = (key: IClassificationKey): string[] => {
    return [
      ...new Set(
        productClassifications
          ?.map((classification) => classification[key])
          .filter((value): value is string => value !== null),
      ),
    ]
  }

  const getAvailableOptions = (key: IClassificationKey, selections: IClassificationSelection) => {
    return [
      ...new Set(
        productClassifications
          ?.filter((classification) => {
            return Object.entries(selections).every(
              ([k, v]) => !v || k === key || classification[k as IClassificationKey] === v,
            )
          })
          .map((classification) => classification[key]),
      ),
    ]
  }

  const allOptions = {
    color: getAllOptions('color'),
    size: getAllOptions('size'),
    other: getAllOptions('other'),
  }

  const availableOptions = {
    color: getAvailableOptions('color', selectedValues),
    size: getAvailableOptions('size', selectedValues),
    other: getAvailableOptions('other', selectedValues),
  }
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
        const matchingClassification = productClassifications?.find((classification) =>
          Object.entries(updatedValues).every(([k, v]) => classification[k as IClassificationKey] === v),
        )

        if (matchingClassification) {
          setChosenClassification(matchingClassification)
        }
      } else {
        setChosenClassification(null)
      }

      return updatedValues
    })
  }

  const renderOptions = (key: IClassificationKey, options: string[]) => {
    if (!options.length) return null

    const showImage = key === 'color' ? allOptions.color.length > 0 : key === 'other' && allOptions.color.length === 0

    return (
      <div className="flex gap-2 items-center">
        <span className="text-gray-600">{t(`productDetail.${key.charAt(0).toUpperCase() + key.slice(1)}`)}</span>
        <div className="flex flex-wrap items-start gap-4">
          {options.map((option) => {
            const classification = productClassifications?.find((c) => c[key] === option)

            return (
              <Button
                onClick={() => handleSelection(key, option)}
                key={option}
                variant="outline"
                className={`w-fit h-fit justify-start px-2 py-2 text-sm ${
                  selectedValues[key] === option ? 'bg-accent text-accent-foreground' : ''
                }`}
                disabled={!availableOptions[key].includes(option)}
              >
                {showImage && classification?.images?.[0]?.fileUrl && (
                  <div className="w-10 h-10 rounded-md">
                    <img
                      alt={option}
                      src={classification.images[0].fileUrl}
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
  const chosenPrice = chosenClassification ? chosenClassification?.price : (cheapestClassification?.price ?? 0)

  const discountedPrice =
    (product?.productDiscounts ?? [])?.length > 0 &&
    (product?.productDiscounts ?? [])[0]?.status === ProductDiscountEnum.ACTIVE
      ? calculateDiscountPrice(chosenPrice, product?.productDiscounts?.[0]?.discount, DiscountTypeEnum.PERCENTAGE)
      : chosenClassification
        ? (chosenClassification?.price ?? 0)
        : (cheapestClassification?.price ?? 0)

  return (
    <div className="w-full flex flex-col gap-4">
      {/* name and tag */}
      <div className="w-full bg-white rounded-lg flex flex-col gap-3 py-4 px-3">
        <div className="flex gap-2">
          {product?.tag && <ProductTag tag={product?.tag} text={product?.tag} />}
          <span className="line-clamp-2 font-semibold text-lg">{product?.name}</span>
        </div>

        {/* rating */}
        <div className="flex gap-2 align-middle items-center">
          <div className="flex gap-2 align-middle items-center hover:cursor-pointer" onClick={scrollToReviews}>
            <span className="font-semibold">{product?.rating}</span>
            <ProductStar rating={product?.rating ?? 0} ratingAmount={product?.ratingAmount} />
          </div>
          <div className="border-l border-gray-300 px-2">
            <span className="text-gray-500 text-sm">
              {t('productCard.soldInPastMonth', { amount: product?.soldInPastMonth ?? 0 })}
            </span>
          </div>
        </div>

        {/* special flash sale, group buying or pre-order event */}
        {event === OrderEnum.FLASH_SALE ? (
          <SpecialEvent time={product?.productDiscounts?.[0]?.endTime ?? ''} title={event} />
        ) : event === OrderEnum.PRE_ORDER ? (
          <SpecialEvent time={product?.preOrderProducts?.[0]?.endTime ?? ''} title={event} />
        ) : null}

        {product?.productDiscounts?.[0]?.status === ProductDiscountEnum.WAITING ? (
          <div>{t('flashSale.waiting', { val: new Date(product?.productDiscounts?.[0]?.startTime) })}</div>
        ) : null}

        {/* price */}
        {(product?.productClassifications ?? [])?.length === 0 ? (
          <></>
        ) : (
          <PriceSection
            currentPrice={discountedPrice}
            deal={product?.productDiscounts?.[0]?.discount ?? 0}
            price={chosenClassification ? (chosenClassification?.price ?? 0) : (cheapestClassification?.price ?? 0)}
            minOrder={0}
            discountValue={0}
            discountType={DiscountTypeEnum.PERCENTAGE}
          />
        )}

        {/* brand deals */}
        <div className="flex gap-2">
          <span className="text-gray-600">{t('productDetail.brandDeal')}</span>
          {product?.deal && product?.deal > 0 && <ProductTag tag="DealPercent" text={product?.deal * 100 + '%'} />}
        </div>

        {/* classification */}
        {hasCustomType && allOptions.color.length > 0 && renderOptions('color', allOptions.color)}
        {hasCustomType && allOptions.size.length > 0 && renderOptions('size', allOptions.size)}
        {hasCustomType && allOptions.other.length > 0 && renderOptions('other', allOptions.other)}
      </div>
      {/* detail */}
      <div className="w-full py-4 px-3 bg-white rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">{t('productDetail.detailTitle')}</h3>
        <ProductDetailInfoSection detail={product?.detail ?? ''} detailCategoryObject={product?.category?.detail} />
      </div>
    </div>
  )
}

export default ProductDetailInformation
