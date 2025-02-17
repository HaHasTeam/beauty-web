import { BadgeCheck, Download, Eye, Package, PackageCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { handleDownload } from '@/utils/certificate/handleDownload'

import { Table, TableBody, TableCell, TableRow } from '../ui/table'

interface QualityService {
  certificateUrl: string
  productName: string
}
const QualityService = ({ certificateUrl, productName }: QualityService) => {
  const { t } = useTranslation()

  const safeServices = [
    ...(certificateUrl?.length > 0
      ? [
          {
            id: '1',
            icon: <BadgeCheck className="text-green-500" />,
            name: (
              <div className="flex items-center gap-2">
                <span>{t('productDetail.safeCertificate')}</span>
                <div className="flex gap-2">
                  <a
                    href={certificateUrl ?? ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800"
                  >
                    <Eye size={18} />
                  </a>

                  <button
                    onClick={() => handleDownload(certificateUrl ?? '', productName)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ),
          },
        ]
      : []),
    { id: '2', icon: <PackageCheck className="text-green-500" />, name: t('productDetail.official') },
    { id: '3', icon: <Package className="text-green-500" />, name: t('productDetail.verified') },
  ]

  return (
    <div className="w-full bg-white rounded-lg flex flex-col gap-3 py-4 px-3">
      <h3 className="font-semibold text-lg">{t('productDetail.qualityService')}</h3>
      <Table>
        <TableBody>
          {safeServices?.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium w-[20px]">{service.icon}</TableCell>
              <TableCell>{service.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default QualityService
