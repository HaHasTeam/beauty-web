import { Link } from 'react-router-dom'

import GroupBuyingImg from '@/assets/images/group-buying.jpg'
import PreOrdersImg from '@/assets/images/pre-orders.jpg'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type OfferCardProps = {
  title: string
  imgSrc: string
  linkTo: string
  buttonText: string
}

const OfferCard = ({ title, imgSrc, linkTo, buttonText }: OfferCardProps) => (
  <Link to={linkTo} className="group">
    <Card className="bg-peach-50 bg-card cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">{title}</h3>
        <img src={imgSrc} alt={`${title} illustration`} className="w-full h-40 object-contain" loading="lazy" />
        <Button variant="default" className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  </Link>
)

const BeautyOffers = () => (
  <section>
    <h2 className="text-2xl font-semibold mb-6">Exclusive Beauty Offers</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <OfferCard title="Pre-orders" imgSrc={PreOrdersImg} linkTo="/products/pre-orders" buttonText="Pre-Order Now" />
      <OfferCard
        title="Group-Buying Deals"
        imgSrc={GroupBuyingImg}
        linkTo="/products/group-buying"
        buttonText="Explore Group-Buy Deals"
      />
    </div>
  </section>
)

export default BeautyOffers
