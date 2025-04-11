import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock1, Copy, Home, ShoppingCart, User } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import bannerImg from '@/assets/images/group-bg.webp'
import Button from '@/components/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  const navigate = useNavigate()
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

  const [showEndedAlert, setShowEndedAlert] = useState(false)

  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  useEffect(() => {
    if (!inProgress) {
      setShowEndedAlert(true)
    }
  }, [inProgress])

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
    <>
      <AlertDialog open={showEndedAlert} onOpenChange={setShowEndedAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('groupBuy.eventEndedTitle', 'Event Ended')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'groupBuy.eventEndedDescription',
                'This group buying event has ended. You can no longer participate in this event. Would you like to return to the home page to explore other events?',
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate('/')} className="bg-rose-500 hover:bg-rose-600 text-white">
              <Home className="mr-2 h-4 w-4" />
              {t('groupBuy.returnToHome', 'Return to Home')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-rose-50">
        {/* Main Banner */}
        <div className="relative h-[360px]">
          <img src={bannerImg} alt="Store Banner" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/30">
            <div className="h-full flex flex-col justify-center px-8">
              <div className="flex items-start gap-8">
                {/* Left Side - Event Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {groupBuyingInfo.groupProduct.name}
                  </h1>
                  <p className="text-base text-gray-200 mb-6 max-w-2xl leading-relaxed">
                    {groupBuyingInfo.groupProduct.description}
                  </p>

                  {/* Status Label */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500 text-white text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                    {inProgress ? t('groupBuy.status.inProgress') : t('groupBuy.status.ended')}
                  </span>
                </div>

                {/* Right Side - Discount Tiers */}
                <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 w-[280px] shadow-xl">
                  <h3 className="text-white font-bold mb-4 text-lg flex items-center">
                    <span className="w-2 h-6 bg-rose-500 rounded-sm mr-2"></span>
                    Mức giảm giá theo nhóm
                  </h3>

                  <div className="max-h-[200px] overflow-auto scrollbar-hide pr-2">
                    <Timeline>
                      {tiers.map((tier, index) => (
                        <TimelineItem status={'done'} key={index}>
                          <TimelineHeading>
                            <span className="flex items-center font-bold text-lg text-white gap-1">
                              <span className="bg-rose-500 rounded-lg px-2 py-0.5 flex items-center gap-1">
                                {tier.count} <User size={14} className="text-white" />
                              </span>
                              <span className="text-rose-400">-</span>
                              <span className="text-rose-300">{tier.discount}</span>
                            </span>
                          </TimelineHeading>
                          <TimelineDot status={'done'} className="bg-rose-500" />
                          {index + 1 < tiers.length && <TimelineLine className="max-h-4 bg-rose-500/30" />}
                          <TimelineContent className="text-sm text-gray-300 ml-1">
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
                      className="bg-rose-500 hover:bg-rose-600 w-full mt-4 shadow-md text-xs px-2 h-auto py-2 whitespace-normal"
                      onClick={handleCoolDownEnTime}
                      loading={isCoolDowning}
                    >
                      <Clock1 className="mr-1 flex-shrink-0" size={16} />
                      <span className="text-center">
                        {t('btn.cooldown', {
                          value: COOLDOWNLIMIT,
                        })}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Bar - Bottom Section */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-500">
          <div className="container mx-auto py-5 px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              {/* Brand Information */}
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md">
                  <AvatarImage src={brand.logo} className="w-full h-full object-cover" />
                  <AvatarFallback className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-600 text-white font-bold text-lg">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-bold text-lg">{brand.name}</h3>
                  <p className="text-rose-100 text-sm">{brand.description}</p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-4">
                <div className="text-white font-bold text-lg tracking-wide uppercase">{timeLeft.term}</div>
                <div className="flex items-center gap-2">
                  {/* Days */}
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-1.5 min-w-12 shadow-md">
                      <span className="text-xl font-bold text-rose-600">
                        {timeLeft.days.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs text-white mt-1 block">{t('time.day')}</span>
                  </div>
                  <span className="text-white text-2xl font-light -mt-5">:</span>
                  {/* Hours */}
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-1.5 min-w-12 shadow-md">
                      <span className="text-xl font-bold text-rose-600">
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs text-white mt-1 block">{t('time.hour')}</span>
                  </div>
                  <span className="text-white text-2xl font-light -mt-5">:</span>
                  {/* Minutes */}
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-1.5 min-w-12 shadow-md">
                      <span className="text-xl font-bold text-rose-600">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs text-white mt-1 block">{t('time.minute')}</span>
                  </div>
                  <span className="text-white text-2xl font-light -mt-5">:</span>
                  {/* Seconds */}
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-1.5 min-w-12 shadow-md">
                      <span className="text-xl font-bold text-rose-600">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs text-white mt-1 block">{t('time.second')}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="bg-white text-rose-600 hover:bg-gray-100 shadow-md px-3">
                        <ShoppingCart className="size-5 mr-2" />
                        {t('header.shoppingCart')}
                        <span className="ml-1 bg-rose-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                          {cartItems[brand?.name]?.reduce((acc, item) => acc + item.quantity, 0) ?? 0}
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-7xl max-h-[80%] overflow-auto">
                      <DialogHeader>
                        <Cart isInGroupBuy isInPeriod={inProgress} />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-white/30 shadow-md"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      successToast({
                        message: t('toast.copied'),
                      })
                    }}
                  >
                    <Copy className="size-4 mr-2" />
                    {t('btn.copyAndShare')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Banner
