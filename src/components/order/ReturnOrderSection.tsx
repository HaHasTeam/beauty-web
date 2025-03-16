import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AlertMessage from '../alert/AlertMessage'
import { ReturnOrderDialog } from './ReturnOrderDialog'

const ReturnOrderSection = ({ orderId }: { orderId: string }) => {
  const { t } = useTranslation()
  const [openDialog, setOpenDialog] = useState(false)
  const PENDING_CUSTOMER_SHIP_RETURN_DAYS = 2
  return (
    <div>
      <AlertMessage
        title={t('order.returnRequestApprovedTitle')}
        message={t('order.returnRequestApprovedMessage', { count: PENDING_CUSTOMER_SHIP_RETURN_DAYS })}
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
