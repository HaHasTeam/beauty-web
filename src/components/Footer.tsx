import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import configs from '@/config'
import { ProjectInformationEnum } from '@/types/enum'

import appGooglePlayDownload from '../assets/images/appGooglePlayDownload.png'
import appQRDownload from '../assets/images/appQRDownload.png'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <div className="w-full  bg-zinc-800 text-zinc-200">
      <div className="p-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-6">
          <div className="col-span-2">
            <h2 className="mb-2 text-xl font-semibold text-primary opacity-80">{ProjectInformationEnum.name}</h2>
            <p className="mb-4 text-sm text-gray-400">{t('footer.contactTitle')}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                <span>{ProjectInformationEnum.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                <span>{ProjectInformationEnum.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                <span>{ProjectInformationEnum.address}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-secondary opacity-80">HELP</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={configs.routes.contact}>Contact us</Link>
              </li>
              <li>
                <Link to={configs.routes.helpCenter}>FAQ</Link>
              </li>
              <li>
                <Link to={configs.routes.helpCenter}>Shipping & Returns</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-secondary opacity-80">MY ACCOUNT</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={configs.routes.accountAddress}>Addresses</Link>
              </li>
              <li>
                <Link to={configs.routes.accountOrder}>Order</Link>
              </li>
              <li>
                <Link to={configs.routes.accountWishlist}>Wishlist</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-secondary opacity-80">CUSTOMER CARE</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={configs.routes.about}>About us</Link>
              </li>
              <li>
                <Link to={configs.routes.blogs}>Blog</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-center align-middle">
            <div className="w-32 h-32 mb-2">
              <img src={appQRDownload} alt="QR Code" className="object-contain" />
            </div>
            <Link to={configs.externalLink.appDownloadUrl} className="bg-transparent hover:bg-transparent">
              <div className="w-32 h-4">
                <img src={appGooglePlayDownload} alt="Google Play" className="w-full object-contain" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-between align-middle mt-2 border-t border-zinc-700 px-6 py-4 text-gray-400 text-center text-sm">
        <p>{ProjectInformationEnum.copyRight}</p>
        <div className="mt-2 space-x-4">
          <Link to={configs.routes.privacyPolicy}>Privacy Policy</Link>
          <Link to={configs.routes.termsAndConditions}>Terms And Conditions</Link>
        </div>
      </div>
    </div>
  )
}
