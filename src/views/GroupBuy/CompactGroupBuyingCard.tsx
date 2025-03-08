'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BoxIcon, Hand, ImageIcon, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import routes from '@/config/routes'
import { getGroupProductByBrandIdApi } from '@/network/apis/group-product'
import { IBranch } from '@/types/brand'
import { DiscountTypeEnum } from '@/types/enum'
import { GroupProductStatusEnum } from '@/types/group-product'
import { formatNumber } from '@/utils/number'
import { minifyString } from '@/utils/string'

type CompactGroupBuyingCardProps = {
  brand: IBranch
}
export default function CompactGroupBuyingCard({ brand }: CompactGroupBuyingCardProps) {
  const { t } = useTranslation()
  const { data: groupProducts } = useQuery({
    queryKey: [getGroupProductByBrandIdApi.queryKey, brand.id as string],
    queryFn: getGroupProductByBrandIdApi.fn,
  })

  const parsedGroupProducts = useMemo(() => {
    return groupProducts?.data.filter((group) => group.status === GroupProductStatusEnum.ACTIVE).slice(0, 9)
  }, [groupProducts])

  const firstGroupProduct = parsedGroupProducts?.[0]
  const otherGroupProducts = parsedGroupProducts?.slice(1)

  return (
    <Card className="w-full mx-auto p-4 space-y-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12 rounded-lg overflow-hidden">
          <AvatarImage src={brand.logo} className="w-full h-full object-cover rounded-md" />
          <AvatarFallback className="w-full h-full object-cover rounded-md">
            <ImageIcon />
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">{brand.name}</h2>
            <Badge variant="secondary" className="text-xs text-nowrap">
              {t('brand.verifiedTag')}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{brand.description}</p>
        </div>
      </div>

      {/* Featured Event */}
      <div className="bg-muted/50 p-3 rounded-lg space-y-3">
        <div className="flex items-center gap-2 flex-col">
          <span className="text-sm font-medium">{firstGroupProduct?.name}</span>
          <p className="text-xs text-muted-foreground">{minifyString(firstGroupProduct?.description ?? '')}</p>
        </div>

        <ul className="space-y-2">
          <li className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4" />{' '}
            <span className="text-xs font-light">
              {t('groupBuy.item.maxDiscount', {
                discount: formatNumber(
                  firstGroupProduct?.criterias
                    ? firstGroupProduct?.criterias[firstGroupProduct?.criterias.length - 1].voucher.discountValue
                    : 0,
                  firstGroupProduct?.criterias[firstGroupProduct?.criterias.length - 1].voucher.discountType ===
                    DiscountTypeEnum.PERCENTAGE
                    ? '%'
                    : 'đ',
                ),
              })}
            </span>
          </li>
          <li className="flex items-center gap-1 text-sm">
            <BoxIcon className="w-4 h-4" />
            <span className="text-xs font-light">
              {t('groupBuy.item.productAmount', {
                amount: formatNumber(firstGroupProduct?.products.length ?? 0),
              })}
            </span>
          </li>
          <li className="flex items-center gap-1 text-sm">
            <Hand className="w-4 h-4" />
            <span className="text-xs font-light">
              {t('groupBuy.item.limitAmount', {
                amount: formatNumber(firstGroupProduct?.maxBuyAmountEachPerson ?? 0),
              })}
            </span>
          </li>
        </ul>

        <Button size="sm" className="w-full text-sm">
          {t('groupBuy.createBtn')}
        </Button>
      </div>

      {/* Other Events Summary */}
      <div className="text-sm">
        <Link
          to={routes.groupBuyByBrand.replace(':brandId', brand.id as string)}
          className="flex items-center justify-between mb-2"
        >
          <p className="text-muted-foreground ">
            {t('groupBuy.otherEvent', {
              amount: formatNumber(groupProducts?.data.length ? groupProducts?.data.length - 1 : 0),
            })}
          </p>
          <p className="flex items-center text-xs underline cursor-pointer">
            {t('groupBuy.viewAll')} <ArrowRight className="w-4 h-4" />
          </p>
        </Link>
        <div className="flex gap-2 flex-wrap">
          {otherGroupProducts?.map((groupProduct) => (
            <div
              key={groupProduct.id}
              className="inline-flex items-center gap-0.5 border rounded-md shadow-sm px-0.5 border-primary bg-primary/30"
            >
              <Avatar className="size-6 rounded-lg overflow-hidden p-1">
                <AvatarImage
                  src={groupProduct.products ? groupProduct.products[0].images[0]?.fileUrl : ''}
                  className="w-full h-full object-cover rounded-md"
                />
                <AvatarFallback className="w-full h-full object-cover rounded-md">
                  <ImageIcon className="text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-xs font-semibold text-nowrap">{minifyString(groupProduct.name, 8)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
