import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock1, Copy, ImageIcon, ShoppingCart, User } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import bannerImg from '@/assets/images/group-bg.webp'
import Button from '@/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getGroupBuyingByIdApi, ownerCoolDownEndTimeApi } from '@/network/apis/group-buying'
import useCartStore from '@/store/cart'
import { useStore } from '@/store/store'
import { IBranch } from '@/types/brand'
import { DiscountTypeEnum } from '@/types/enum'
import { TGroupBuying } from '@/types/group-buying'
import { formatCurrency, formatNumber } from '@/utils/number'
import Cart from '@/views/Cart'

type BannerProps = {
  brand: IBranch
  groupBuyingInfo: TGroupBuying
}
const COOLDOWNLIMIT = 5
const Banner = ({ brand, groupBuyingInfo }: BannerProps) => {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    term: t('time.ended'),
    duration: 0,
  })
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user,
    })),
  )

  const handleServerError = useHandleServerError()
  const coolDownable = useMemo(() => {
    if (user?.id) {
      const isOwner = groupBuyingInfo.creator.id === user?.id
      const isInProgress = timeLeft.term === t('time.endsIn')
      const isDurationOverLimit = timeLeft.duration > COOLDOWNLIMIT * 60 * 1000

      return isOwner && isInProgress && isDurationOverLimit
    }
    return false
  }, [user, groupBuyingInfo.creator.id, timeLeft.term, timeLeft.duration, t])

  const { cartItems } = useCartStore()

  const queryClient = useQueryClient()
  const { mutateAsync: coolDownFn, isPending: isCoolDowning } = useMutation({
    mutationKey: [ownerCoolDownEndTimeApi.mutationKey, groupBuyingInfo.id],
    mutationFn: ownerCoolDownEndTimeApi.fn,
  })
  const handleCoolDownEnTime = async () => {
    try {
      await coolDownFn(groupBuyingInfo.id)

      await queryClient.invalidateQueries({
        queryKey: [getGroupBuyingByIdApi.queryKey, String(groupBuyingInfo.id)],
      })
      console.log('invalidateQueries')
    } catch (error) {
      handleServerError({
        error,
      })
    }
  }

  const calculateTimeLeft = useCallback(() => {
    const endDate = new Date(groupBuyingInfo.endTime)
    let difference
    let term
    {
      difference = endDate.getTime() - new Date().getTime()
      term = t('time.endsIn')
    }

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        term,
        duration: difference,
      })
    }
  }, [groupBuyingInfo.endTime, t])

  const inProgress = useMemo(() => {
    const endtime = new Date(groupBuyingInfo.endTime)
    return endtime.getTime() > new Date().getTime()
  }, [groupBuyingInfo.endTime])

  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [calculateTimeLeft])
  const { successToast } = useToast()
  const tiers = groupBuyingInfo.groupProduct.criterias.map((criteria) => {
    const discountValue =
      criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
        ? criteria.voucher.discountValue * 100
        : criteria.voucher.discountValue

    return {
      id: criteria.id,
      count: criteria.threshold,
      discount:
        criteria.voucher.discountType === DiscountTypeEnum.PERCENTAGE
          ? formatNumber(discountValue, '%')
          : formatCurrency(discountValue),
    }
  })
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden h-fit shadow-md">
      {/* Main Banner */}
      <div className="relative h-96">
        <img src={bannerImg} alt="Store Banner" className="w-full h-full object-cover object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
          <div className="max-w-7xl mx-auto h-full flex flex-col justify-center px-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{groupBuyingInfo.groupProduct.name}</h1>
                <p className="text-xl text-gray-200 mb-8 max-w-xl">{groupBuyingInfo.groupProduct.description}</p>
                <div className="flex items-center gap-2"></div>
              </div>
              <div className="p-4 flex flex-col gap-4 rounded-3xl backdrop-blur-2xl border-2 shadow-md bg-gray-900 bg-opacity-70 h-[300px]">
                <div className="flex-1 overflow-auto scrollbar-hide">
                  <Timeline>
                    {tiers.map((tier, index) => (
                      <TimelineItem status={'done'} key={index}>
                        <TimelineHeading>
                          <span className="flex items-center font-bold text-xl">
                            {tier.count} <User size={14} strokeWidth={'4'} />- {`${tier.discount}`}
                          </span>
                        </TimelineHeading>
                        <TimelineDot status={'done'} />
                        {index + 1 < tiers.length && <TimelineLine className="max-h-4" />}
                        <TimelineContent className="text-sm text-white">
                          {t('groupBuy.item.tierDescription', {
                            count: tier.count,
                            discount: tier.discount,
                          })}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </div>
                {coolDownable && (
                  <Button
                    variant={'destructive'}
                    className="bg-red-600 hover:bg-red-700 w-full mt-auto"
                    onClick={handleCoolDownEnTime}
                    loading={isCoolDowning}
                  >
                    <Clock1 />
                    {t('btn.cooldown', {
                      value: COOLDOWNLIMIT,
                    })}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Event Bar */}
      <div className="bg-red-600 dark:bg-red-800 top-2">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 rounded-lg overflow-hidden">
                <AvatarImage src={brand.logo} className="w-full h-full object-cover rounded-md" />
                <AvatarFallback className="w-full h-full object-contain rounded-md">
                  <ImageIcon />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-bold text-lg">{brand.name}</h3>
                <p className="text-red-100">{brand.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <h1 className="text-white uppercase font-extrabold text-xl">{timeLeft.term} :</h1>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-w-16">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">{timeLeft.days}</span>
                  </div>
                  <span className="text-xs text-white mt-1">{t('time.day')}</span>
                </div>
                <div className="text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-w-16">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">{timeLeft.hours}</span>
                  </div>
                  <span className="text-xs text-white mt-1">{t('time.hour')}</span>
                </div>
                <div className="text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-w-16">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">{timeLeft.minutes}</span>
                  </div>
                  <span className="text-xs text-white mt-1">{t('time.minute')}</span>
                </div>
                <div className="text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 min-w-16">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">{timeLeft.seconds}</span>
                  </div>
                  <span className="text-xs text-white mt-1">{t('time.second')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger>
                    <Button variant="secondary" className="bg-white text-red-600 hover:bg-gray-100 w-full">
                      <ShoppingCart className="size-10" strokeWidth={'4'} />
                      {t('header.shoppingCart')} (
                      {cartItems[brand?.name]?.reduce((acc, item) => acc + item.quantity, 0) ?? 0})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl max-h-[80%] overflow-auto">
                    <DialogHeader>
                      <Cart isInGroupBuy isInPeriod={inProgress} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Button
                  variant={'outline'}
                  className="bg-white text-red-600 hover:bg-gray-100 w-fit"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    successToast({
                      message: t('toast.copied'),
                    })
                  }}
                >
                  <Copy className="size-10" strokeWidth={'4'} />
                  {t('btn.copyAndShare')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
