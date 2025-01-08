import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'

import { IClassification } from '@/types/classification'
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

  const handleSelectClassification = (classification: IClassification) => {
    setChosenClassification(classification)
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
        <PriceSection
          currentPrice={discountedPrice}
          deal={product?.productDiscounts?.[0]?.discount ?? 0}
          price={chosenClassification ? (chosenClassification?.price ?? 0) : (cheapestClassification?.price ?? 0)}
        />
        {/* brand deals */}
        <div className="flex gap-2">
          <span className="text-gray-600">{t('productDetail.brandDeal')}</span>
          {product?.deal && product?.deal > 0 && <ProductTag tag="DealPercent" text={product?.deal * 100 + '%'} />}
        </div>
        {/* classification */}
        {hasCustomType ? (
          <div className="flex gap-2 items-center">
            <span className="text-gray-600">{t('productDetail.classification')}</span>
            <div className="flex flex-wrap items-start gap-4">
              {productClassifications?.map((classification) => (
                <Button
                  onClick={() => handleSelectClassification(classification)}
                  key={classification?.id}
                  variant="outline"
                  className={`w-fit h-fit justify-start px-2 py-2 text-sm ${
                    chosenClassification?.id === classification?.id ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-md">
                    <img
                      alt="option"
                      src={classification?.images[0]?.fileUrl}
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                  {classification?.title}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {/* detail */}
      <div className="w-full py-4 px-3 bg-white rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">{t('productDetail.detailTitle')}</h3>
        <ProductDetailInfoSection detail={product?.detail ?? ''} detailCategoryObject={product?.category?.detail} />
      </div>
      {/* description */}
      <div className="w-full py-4 px-3 bg-white rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">{t('productDetail.descriptionTitle')}</h3>
        <ReactQuill value={product?.description} readOnly={true} theme={'bubble'} />
      </div>
    </div>
  )
}

export default ProductDetailInformation
