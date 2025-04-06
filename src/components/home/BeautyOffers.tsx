import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import GroupBuyingImg from '@/assets/images/group-buying.jpg'
import PreOrdersImg from '@/assets/images/pre-orders.jpg'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import ImageWithFallback from '../ImageFallback'

type OfferCardProps = {
  title: string
  imgSrc: string
  linkTo: string
  buttonText: string
}

const OfferCard = ({ title, imgSrc, linkTo, buttonText }: OfferCardProps) => (
  <Link to={linkTo} className="group">
    <Card className="bg-card cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">{title}</h3>
        <ImageWithFallback
          src={imgSrc}
          alt={`${title} illustration`}
          className="w-full h-40 object-contain"
          loading="lazy"
          fallback={fallBackImage}
        />
        <Button variant="default" className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  </Link>
)

const BeautyOffers = () => {
  const { t } = useTranslation()
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-primary">{t('home.exclusiveBeautyOffersTitle')}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <OfferCard
          title={t('home.preOderCardTitle')}
          imgSrc={PreOrdersImg}
          linkTo="/products/pre-orders"
          buttonText={t('button.preOderAction')}
        />
        <OfferCard
          title={t('home.groupBuyingDealsCardTitle')}
          imgSrc={GroupBuyingImg}
          linkTo="/products/group-buying"
          buttonText={t('button.groupBuyingAction')}
        />
      </div>
    </section>
  )
}

export default BeautyOffers
