import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AlertMessage from '../alert/AlertMessage'
import { Button } from '../ui/button'
import { ReturnOrderDialog } from './ReturnOrderDialog'

const ReturnOrderSection = ({ orderId }: { orderId: string }) => {
  const { t } = useTranslation()
  const [openDialog, setOpenDialog] = useState(false)
  return (
    <div>
      <AlertMessage
        title={t('order.returnRequestApprovedTitle')}
        message={t('order.returnRequestApprovedMessage')}
        isShowIcon={false}
      />
      <Button onClick={() => setOpenDialog(true)}>{t('button.upload')}</Button>
      <ReturnOrderDialog open={openDialog} onOpenChange={setOpenDialog} orderId={orderId} setOpen={setOpenDialog} />
    </div>
  )
}

export default ReturnOrderSection
