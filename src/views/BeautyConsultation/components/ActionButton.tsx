import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface ActionButtonProps {
  onBookNow: () => void;
}

export default function ActionButton({ onBookNow }: ActionButtonProps) {
  const { t } = useTranslation();

  return (
    <Button 
      size="lg" 
      className="w-full bg-primary hover:bg-primary/90"
      onClick={onBookNow}
    >
      {t('beautyConsultation.bookNow', 'Đặt lịch ngay')}
    </Button>
  )
} 