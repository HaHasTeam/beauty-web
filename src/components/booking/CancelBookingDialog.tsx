import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cancelBookingApi, getBookingByIdApi } from '@/network/apis/booking/details'

import LoadingIcon from '../loading-icon'

interface CancelBookingDialogProps {
  open: boolean
  notRefund: boolean
  setOpen: (open: boolean) => void
  onOpenChange: (open: boolean) => void
  setIsTrigger: (isTrigger: boolean) => void
  bookingId: string
}

const CancelBookingDialog = ({
  open,
  setOpen,
  onOpenChange,
  setIsTrigger,
  bookingId,
  notRefund,
}: CancelBookingDialogProps) => {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const [reason, setReason] = useState<string>('')

  const { mutate: cancelBookingFn, isPending } = useMutation({
    mutationFn: cancelBookingApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('booking.cancelSuccess'),
      })
      setOpen(false)
      setIsTrigger(true)
      await Promise.all([queryClient.invalidateQueries({ queryKey: [getBookingByIdApi.queryKey] })])
    },
    onError: (error) => {
      handleServerError({
        error,
      })
    },
  })

  const handleCancelBooking = () => {
    if (reason.trim().length < 3) {
      return
    }

    cancelBookingFn({
      bookingId,
      reason,
      notRefund,
    })
  }

  useEffect(() => {
    if (!open) {
      setReason('')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('booking.cancelBookingTitle')}</DialogTitle>
          <DialogDescription>
            {t('booking.cancelBookingDescription')}
            <br />
            <span className="text-yellow-600 flex items-center gap-2">
              <CircleAlert className="w-10 h-10" />
              {'Nếu đơn hàng đã được tư vấn viên xác nhận và khách hàng tự hủy, hệ thống sẽ không hoàn tiền.'}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Textarea
            id="reason"
            placeholder={t('booking.cancelReasonPlaceholder')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
          {reason.trim().length < 3 && <p className="text-sm text-destructive">{t('booking.cancelReasonRequired')}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleCancelBooking} disabled={isPending || reason.trim().length < 3}>
            {isPending ? (
              <>
                <LoadingIcon color="primaryBackground" />
              </>
            ) : (
              t('booking.confirmCancel')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CancelBookingDialog
