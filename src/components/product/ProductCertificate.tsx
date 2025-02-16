import { Download, Eye, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import docFile from '@/assets/images/docFile.png'
import pdfFile from '@/assets/images/pdfFile.png'

const ProductCertificate = ({ certificateUrl }: { certificateUrl: string }) => {
  const { t } = useTranslation()
  if (!certificateUrl) {
    return null
  }

  const filename = certificateUrl.split('/').pop() || 'certificate'
  const fileExtension = filename.split('.').pop()?.toLowerCase() || ''

  const isPDF = fileExtension === 'pdf'
  const isDoc = fileExtension === 'doc'
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)

  const handleDownload = async () => {
    try {
      const response = await fetch(certificateUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading certificate:', error)
    }
  }

  return (
    <div className="w-full py-4 px-3 bg-white rounded-lg">
      <h3 className="font-semibold mb-3 text-lg">{t('createProduct.certificate')}</h3>

      <div>
        {isImage ? (
          // Image preview
          <div className="space-y-3">
            <img src={certificateUrl} alt={t('createProduct.certificate')} className="max-w-full h-auto rounded-lg" />
            <button onClick={handleDownload} className="flex items-center gap-2 text-primary hover:text-primary/80">
              <Download size={20} />
              <span>{t('createProduct.downloadCertificate')}</span>
            </button>
          </div>
        ) : isPDF || isDoc ? (
          // PDF preview with option to view or download
          <div className="space-y-3">
            <div className="cursor-default border border-gray-300 p-2 bg-card flex items-center gap-3 rounded-lg">
              {isPDF ? (
                <img src={pdfFile} alt="pdf" className="w-10 h-10" />
              ) : (
                <img src={docFile} alt="doc" className="w-10 h-10" />
              )}

              <span className="flex-1 truncate cursor-default">{filename}</span>
            </div>

            <div className="flex gap-4">
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <Eye size={20} />
                <span>{t('createProduct.viewCertificate')}</span>
              </a>

              <button onClick={handleDownload} className="flex items-center gap-2 text-primary hover:text-primary/80">
                <Download size={20} />
                <span>{t('createProduct.download')}</span>
              </button>
            </div>
          </div>
        ) : (
          // Generic file download
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText size={24} className="text-gray-500" />
              <span className="flex-1 truncate">{filename}</span>
            </div>

            <button onClick={handleDownload} className="flex items-center gap-2 text-primary hover:text-primary/80">
              <Download size={20} />
              <span>{t('createProduct.downloadCertificate')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCertificate
