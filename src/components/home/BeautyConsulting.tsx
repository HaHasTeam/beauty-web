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
      <Card className="relative">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">{icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function BeautyConsulting() {
  const { t } = useTranslation()
  return (
    <section className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-primary">{t('home.consultantTitle')}</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <ConsultationCard
          title={t('home.standardConsultantTitle')}
          description={t('home.standardConsultantDescription')}
          icon={<Star className="w-6 h-6 text-orange-400" />}
          linkTo={configs.routes.consultationStandard}
        />
        <ConsultationCard
          title={t('home.premiumConsultantTitle')}
          description={t('home.premiumConsultantDescription')}
          icon={<ShoppingCart className="w-6 h-6 text-orange-400" />}
          linkTo={configs.routes.consultationPremium}
        />
      </div>
    </section>
  )
}
