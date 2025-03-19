import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AlertMessage from '../alert/AlertMessage'
import { ReturnOrderDialog } from './ReturnOrderDialog'

const ReturnOrderSection = ({
  orderId,
  pendingCustomerShippingReturnTime,
}: {
  orderId: string
  pendingCustomerShippingReturnTime: number
}) => {
  const { t } = useTranslation()
  const [openDialog, setOpenDialog] = useState(false)
  return (
    <div>
      <AlertMessage
        title={t('order.returnRequestApprovedTitle')}
        message={t('order.returnRequestApprovedMessage', { count: pendingCustomerShippingReturnTime })}
        isShowIcon={false}
        color="success"
        buttonText="upload"
        onClick={() => setOpenDialog(true)}
        buttonClassName="bg-green-500 hover:bg-green-600"
      />
      <ReturnOrderDialog open={openDialog} onOpenChange={setOpenDialog} orderId={orderId} setOpen={setOpenDialog} />
    </div>
  )
}

export default ReturnOrderSection
