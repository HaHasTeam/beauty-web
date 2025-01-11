import { Dispatch, SetStateAction, useState } from 'react'
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
  const [selectedLevel1, setSelectedLevel1] = useState<string | null>(null)
  const [selectedLevel2, setSelectedLevel2] = useState<string | null>(null)

  const handleSelectLevel1 = (level1: string) => {
    setSelectedLevel1(level1)
    if (level1 && selectedLevel2) {
      const selected = productClassifications?.find(
        (classification) => classification.title === `${level1}-${selectedLevel2}`,
      )
      setChosenClassification(selected || null)
    }
  }

  const handleSelectLevel2 = (level2: string) => {
    setSelectedLevel2(level2)
    if (selectedLevel1 && level2) {
      const selected = productClassifications?.find(
        (classification) => classification.title === `${selectedLevel1}-${level2}`,
      )
      setChosenClassification(selected || null)
    }
  }

  const classificationsLevel1 = Array.from(
    new Set(productClassifications?.map((classification) => classification.title.split('-')[0])),
  )
  // const classificationsLevel2 = selectedLevel1
  //   ? productClassifications
  //       ?.filter((classification) => classification.title.startsWith(selectedLevel1 + '-'))
  //       ?.map((classification) => classification.title.split('-')[1])
  //   : []

  // const classificationsLevel2 = Array.from(
  //   new Set(productClassifications?.map((classification) => classification.title.split('-')[1])),
  // )
  const classificationsLevel2 = productClassifications
    ?.filter((classification) => classification.title.includes(`-`))
    ?.map((classification) => classification.title.split('-')[1])
    ?.filter((level2, index, self) => self.indexOf(level2) === index)

  const isLevel2Enabled = (level2: string): boolean => {
    if (!selectedLevel1) return true
    return (
      productClassifications?.some((classification) => classification.title === `${selectedLevel1}-${level2}`) ?? false
    )
  }

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

  console.log(classificationsLevel2 && classificationsLevel2?.length > 0)
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
          minOrder={0}
          discountValue={0}
          discountType={DiscountTypeEnum.PERCENTAGE}
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

        {hasCustomType && (
          <div className="flex flex-col gap-4">
            {/* Level 1 Classification */}
            {classificationsLevel1 && classificationsLevel1?.length > 0 ? (
              <div className="flex gap-2 items-center">
                <span className="text-gray-600">{t('productDetail.classification1')}</span>
                <div className="flex flex-wrap items-start gap-4">
                  {classificationsLevel1?.map((level1) => {
                    const level1Classification = productClassifications?.find((classification) =>
                      classification.title.startsWith(`${level1}`),
                    )
                    return (
                      <Button
                        onClick={() => handleSelectLevel1(level1)}
                        key={level1}
                        variant="outline"
                        className={`w-fit h-fit justify-start px-2 py-2 text-sm ${
                          selectedLevel1 === level1 ? 'bg-accent text-accent-foreground' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-md">
                          <img
                            alt="option"
                            src={level1Classification?.images[0]?.fileUrl}
                            className="w-full h-full object-contain rounded-md"
                          />
                        </div>
                        {level1}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ) : null}
            {/* Level 2 Classification */}
            {classificationsLevel2 && classificationsLevel2?.length > 0 ? (
              <div className="flex gap-2 items-center">
                <span className="text-gray-600">{t('productDetail.classification2')}</span>
                <div className="flex flex-wrap items-start gap-4">
                  {classificationsLevel2?.map((level2) => (
                    <Button
                      onClick={() => isLevel2Enabled(level2) && handleSelectLevel2(level2)}
                      key={level2}
                      variant="outline"
                      className={`w-fit h-fit justify-start px-2 py-2 text-sm ${
                        selectedLevel2 === level2 ? 'bg-accent text-accent-foreground' : ''
                      }`}
                      disabled={!isLevel2Enabled(level2)}
                    >
                      {level2}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
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
