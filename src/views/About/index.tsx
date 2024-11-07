import { Award, CreditCard, Heart, Layout, ShieldCheck, ShoppingBag, SmilePlus, Users } from 'lucide-react'

import AboutImage from '@/assets/images/about-image.jpg'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function About() {
  return (
    <div className="container my-8">
      <div className="w-[1200px] mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to Allure - Your Personal Beauty Consultant and Shopping Destination
        </h1>
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <p className="text-lg mb-4">
              At Allure, we believe that beauty is personal, and so should your skincare and makeup choices. We are more
              than just an ecommerce store. Allure is a comprehensive beauty consulting platform that combines beauty
              enthusiasts with certified beauty consultants to provide personalized advice, recommendations, and access
              to top-tier beauty products.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white">Explore Now</Button>
          </div>
          <div className="flex justify-end">
            <img
              src={AboutImage}
              alt="Woman applying lipstick"
              className="rounded-lg shadow-lg"
              width={300}
              height={400}
            />
          </div>
        </div>
        <div className="bg-background p-8 rounded-xl">
          <h2 className="text-3xl font-bold text-center mb-4">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  To revolutionize beauty by providing personalized expert-driven beauty consulting services that
                  empower individuals to embrace their unique beauty and feel confident in their skin.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Our mission is to bring the world of personalized beauty advice and premium products to your
                  fingertips, making expert beauty consulting and high-quality cosmetics accessible to everyone,
                  everywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">What We Offer</h2>
        <p className="text-center text-gray-600 mb-12">
          These are our key features to provide you with the best beauty experience. Our commitment is to make beauty
          accessible and personalized for all.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: <SmilePlus className="w-12 h-12 text-peach-400" />,
              title: 'Personalized Beauty Consultations',
              description:
                'Experience our unique beauty analysis where we assess your skin type, facial features, and personal style to create a tailored beauty plan. Our expert consultations deliver specific advice to help you achieve your desired look, enhancing your natural beauty.',
            },
            {
              icon: <Users className="w-12 h-12 text-peach-400" />,
              title: 'Expert Beauty Consultants',
              description:
                'Our platform connects you with certified beauty professionals from various specialties. These consultants are dedicated to helping you discover the best products and techniques for your unique beauty needs, ensuring you receive expert guidance every step of the way.',
            },
            {
              icon: <ShoppingBag className="w-12 h-12 text-peach-400" />,
              title: 'Curated Beauty Products',
              description:
                "Discover a handpicked selection of high-quality beauty products from trusted brands. Whether you're searching for the perfect skincare essentials or a show-stopping makeup look, we've got you covered with our carefully curated collection.",
            },
            {
              icon: <CreditCard className="w-12 h-12 text-peach-400" />,
              title: 'Seamless E-Commerce Experience',
              description:
                'Enjoy a hassle-free shopping experience with our user-friendly platform. From browsing products to secure checkout, we ensure a smooth and convenient process. Plus, benefit from fast shipping and excellent customer service to enhance your shopping experience.',
            },
          ].map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background p-8 rounded-xl mb-10">
          <h3 className="text-2xl font-bold text-center mb-8">Why choose us?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Heart className="w-8 h-8 text-peach-400" />,
                title: 'Personalized Beauty for Everyone',
                description: "We make beauty advice accessible and customized to each individual's specific needs.",
              },
              {
                icon: <Award className="w-8 h-8 text-peach-400" />,
                title: 'Exclusive, High-Quality Products',
                description: 'Our beauty shop features only the best and most effective products curated by experts.',
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-peach-400" />,
                title: 'Certified Experts You Can Trust',
                description:
                  'Our beauty consultants are highly trained professionals with the expertise to guide you effectively.',
              },
              {
                icon: <Layout className="w-8 h-8 text-peach-400" />,
                title: 'Comprehensive Services in One Place',
                description: 'From beauty consulting to shopping and support, find every beauty service you need here.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-16 ">
          <h3 className="text-2xl font-bold mb-4">Our Commitment to Quality & Inclusivity</h3>
          <p className="text-gray-600">
            We believe that beauty should be inclusive and accessible to everyone. Our platform is designed to serve a
            wide range of skin types, tones, and concerns. From personalized skincare routines to makeup tutorials that
            work for diverse features, we are committed to helping everyone feel beautiful and confident. Our
            consultants are trained in inclusive beauty practices, and our product selection reflects our commitment to
            diversity. When you shop with us, you can trust that you're getting high-quality products that align with
            our commitment to quality, ensuring that each item we offer meets the highest standards.
          </p>
        </div>

        <div className="text-center bg-background p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
          <p className="text-gray-600 mb-4">
            Have questions or need support? We're here to help! Reach out to our customer service team - we'd be happy
            to assist you.
          </p>
          <p className="font-semibold">Contact Us</p>
          <p className="text-peach-400">Email: support@allurebeauty.com</p>
        </div>
      </div>
    </div>
  )
}
