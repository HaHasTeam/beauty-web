import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Result from '@/components/result/Result'
import configs from '@/config'
import { ResultEnum } from '@/types/enum'

interface CheckoutResultAllProps {
  status: ResultEnum.SUCCESS | ResultEnum.FAILURE
  orderId: string
}

export default function CheckoutResultAll({ status, orderId }: CheckoutResultAllProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <Result
      status={status}
      title={status === ResultEnum.SUCCESS ? t('order.success') : t('order.failure')}
      description={status === ResultEnum.SUCCESS ? t('order.successDescription') : t('order.failureDescription')}
      leftButtonAction={
        status === ResultEnum.SUCCESS
          ? () => navigate(configs.routes.profileOrder + '/' + orderId)
          : () => navigate(configs.routes.home)
      }
      rightButtonAction={
        status === ResultEnum.SUCCESS
          ? () => navigate(configs.routes.home)
          : () => navigate(configs.routes.profileOrder + '/' + orderId)
      }
      leftButtonText={status === ResultEnum.SUCCESS ? t('order.viewOrder') : t('order.continueShopping')}
      rightButtonText={status === ResultEnum.SUCCESS ? t('order.continueShopping') : t('order.tryAgain')}
      color={status === ResultEnum.SUCCESS ? 'success' : 'failure'}
    />
  )
}
