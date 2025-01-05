import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { VoucherUnavailableReasonEnum } from '@/types/enum'

interface WarningProps {
  reason?: VoucherUnavailableReasonEnum
  minOrderValue?: number
}

const VoucherWarning: React.FC<WarningProps> = ({ reason, minOrderValue }) => {
  const { t } = useTranslation()
  const warningMessages: Record<VoucherUnavailableReasonEnum, string> = {
    [VoucherUnavailableReasonEnum.MINIMUM_ORDER_NOT_MET]: t('voucher.reason.minOrder', { amount: minOrderValue }),
    [VoucherUnavailableReasonEnum.OUT_OF_STOCK]: t('voucher.reason.soldOut'),
    [VoucherUnavailableReasonEnum.NOT_START_YET]: t('voucher.reason.notStart'),
    [VoucherUnavailableReasonEnum.NOT_APPLICABLE]: t('voucher.reason.notApplicable'),
  }
  const message = reason && warningMessages[reason]

  if (!message) return null

  return (
    <div className="flex items-start gap-2 text-sm text-red-500 bg-red-100 p-2 rounded">
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  )
}

export default VoucherWarning
