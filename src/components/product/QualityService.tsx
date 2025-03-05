import { BadgeCheck, Download, Eye, Package, PackageCheck } from 'lucide-react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { TServerFile } from '@/types/file'
import { handleDownload } from '@/utils/certificate/handleDownload'

import { Table, TableBody, TableCell, TableRow } from '../ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface QualityService {
  certificateUrls: TServerFile[]
  productName: string
}
const QualityService = ({ certificateUrls, productName }: QualityService) => {
  const { t } = useTranslation()
  const renderCertificateActions = (certificateUrl: string, index: number) => (
    <div className="flex items-center gap-1">
      {certificateUrls.length > 0 && (
        <span>
          {t('createProduct.file')} #{index + 1}
        </span>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full hover:bg-gray-100 transition-colors"
            >
              <Eye size={16} className="text-gray-500 hover:text-gray-800" />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('productDetail.view')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Download
              size={16}
              className="text-gray-500 hover:text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() =>
                handleDownload(certificateUrl, `${productName}`, certificateUrls.length > 1 ? `${index + 1}` : '')
              }
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('createProduct.download')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )

  const safeServices = [
    ...(certificateUrls?.length > 0
      ? [
          {
            id: '1',
            icon: <BadgeCheck className="text-green-500" />,
            name: (
              <div className="flex items-center gap-4">
                <span>{t('productDetail.safeCertificate')}</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {certificateUrls.map((url, index) => (
                    <Fragment key={index}>
                      {index > 0 && <span className="text-gray-300">|</span>}
                      {renderCertificateActions(url.fileUrl, index)}
                    </Fragment>
                  ))}
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
