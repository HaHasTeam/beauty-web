import { ChevronRight, ShoppingCart, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import configs from '@/config'

interface ConsultationCardProps {
  title: string
  description: string
  icon: JSX.Element
  linkTo: string
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ title, description, icon, linkTo }) => {
  return (
    <Link to={linkTo} className="group">
      <Card className="relative h-full">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-lg shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-2 text-base lg:text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
            </div>
            <ChevronRight className="hidden sm:block w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function BeautyConsulting() {
  const { t } = useTranslation()
  return (
    <section className="container mx-auto px-4">
      <h1 className="text-xl lg:text-2xl font-semibold mb-6 text-primary">{t('home.consultantTitle')}</h1>

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
        <ConsultationCard
          title={t('home.standardConsultantTitle')}
          description={t('home.standardConsultantDescription')}
          icon={<Star className="w-6 h-6 text-orange-400" />}
          linkTo={configs.routes.beautyConsultation}
        />
        <ConsultationCard
          title={t('home.premiumConsultantTitle')}
          description={t('home.premiumConsultantDescription')}
          icon={<ShoppingCart className="w-6 h-6 text-orange-400" />}
          linkTo={configs.routes.beautyConsultation}
        />
      </div>
    </section>
  )
}
