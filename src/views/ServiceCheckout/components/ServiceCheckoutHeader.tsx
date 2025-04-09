import { useTranslation } from 'react-i18next'

const ServiceCheckoutHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full bg-secondary/30 rounded-sm text-primary font-medium mb-4">
      <div className="w-full flex px-4 py-3 items-center lg:text-base md:text-sm sm:text-xs text-xs">
        <div className="flex items-center gap-2 w-[40%] md:w-[35%]">
          <label className="w-fit">{t('booking.serviceInfo', 'Thông tin dịch vụ')}</label>
        </div>
        <div className="w-[20%] md:w-[25%] text-center">{t('booking.bookingTime', 'Thời gian đặt lịch')}</div>
        <div className="w-[20%] text-center hidden md:block">{t('booking.consultant', 'Chuyên gia')}</div>
        <div className="w-[20%] md:w-[15%] text-center ml-auto">{t('booking.price', 'Giá dịch vụ')}</div>
      </div>
    </div>
  )
}

export default ServiceCheckoutHeader
