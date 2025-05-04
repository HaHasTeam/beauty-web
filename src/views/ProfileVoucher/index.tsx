'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { AlertCircle, Clock, Copy, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/useToast'
import { getMyVouchersApi } from '@/network/apis/voucher'
import { VoucherUsedStatusEnum } from '@/types/enum'
import { TVoucher } from '@/types/voucher'

function ProfileVoucher() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useQuery({
    queryKey: [getMyVouchersApi.queryKey],
    queryFn: getMyVouchersApi.fn,
  })

  const { successToast } = useToast()

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    successToast({
      message: t('profileVoucher.notifications.copied'),
      description: t('profileVoucher.notifications.copiedDescription', { code }),
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case VoucherUsedStatusEnum.AVAILABLE:
        return <Badge className="bg-green-500">{t('profileVoucher.status.available')}</Badge>
      case VoucherUsedStatusEnum.UNAVAILABLE:
        return <Badge variant="destructive">{t('profileVoucher.status.unavailable')}</Badge>
      case VoucherUsedStatusEnum.UNCLAIMED:
        return <Badge variant="outline">{t('profileVoucher.status.unclaimed')}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDiscountValue = (voucher: TVoucher) => {
    if (voucher.discountType === 'PERCENTAGE') {
      return t('profileVoucher.discount.percentage', { value: voucher.discountValue })
    } else {
      return t('profileVoucher.discount.fixed', { value: voucher.discountValue.toFixed(2) })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">{t('profileVoucher.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('profileVoucher.error.title')}</h2>
          <p className="text-muted-foreground mb-4">{t('profileVoucher.error.description')}</p>
          <Button onClick={() => window.location.reload()}>{t('profileVoucher.buttons.tryAgain')}</Button>
        </div>
      </div>
    )
  }

  const vouchers = data?.data || []

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t('profileVoucher.title')}</h1>

      {vouchers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Tag className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('profileVoucher.emptyState.title')}</h2>
          <p className="text-muted-foreground">{t('profileVoucher.emptyState.description')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vouchers.map((voucher) => (
            <Card
              key={voucher.id}
              className={`w-full ${voucher.status === VoucherUsedStatusEnum.UNAVAILABLE ? 'opacity-70' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{voucher.name}</CardTitle>
                  {getStatusBadge(voucher.status)}
                </div>
                <CardDescription>{voucher.description || formatDiscountValue(voucher)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md flex justify-between items-center mb-4">
                  <code className="font-mono font-semibold">{voucher.code}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(voucher.code)}
                    disabled={voucher.status !== VoucherUsedStatusEnum.AVAILABLE}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">{t('profileVoucher.buttons.copy')}</span>
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>
                      {voucher.discountType === 'PERCENTAGE'
                        ? t('profileVoucher.discount.percentage', { value: voucher.discountValue })
                        : t('profileVoucher.discount.fixed', { value: voucher.discountValue.toFixed(2) })}
                    </span>
                  </div>

                  {voucher.minOrderValue > 0 && (
                    <div className="text-muted-foreground">
                      {t('profileVoucher.minOrder', { value: voucher.minOrderValue.toFixed(2) })}
                    </div>
                  )}

                  {voucher.maxDiscount > 0 && voucher.discountType === 'PERCENTAGE' && (
                    <div className="text-muted-foreground">
                      {t('profileVoucher.maxDiscount', { value: voucher.maxDiscount.toFixed(2) })}
                    </div>
                  )}

                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      {t('profileVoucher.validity', {
                        startDate: format(new Date(voucher.startTime), 'MMM d, yyyy'),
                        endDate: format(new Date(voucher.endTime), 'MMM d, yyyy'),
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={voucher.status === VoucherUsedStatusEnum.AVAILABLE ? 'default' : 'outline'}
                  disabled={voucher.status !== VoucherUsedStatusEnum.AVAILABLE}
                >
                  {voucher.status === VoucherUsedStatusEnum.AVAILABLE
                    ? t('profileVoucher.buttons.useVoucher')
                    : t('profileVoucher.buttons.unavailable')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileVoucher
