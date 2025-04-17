import { XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TFile } from '@/types/file'

interface CertificateDialogProps {
  isOpen: boolean
  onClose: () => void
  certificate: TFile
}

export default function CertificateDialog({ isOpen, onClose, certificate }: CertificateDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] p-0 bg-black border-0">
        <div className="p-4 flex justify-between items-center">
          <DialogTitle className="text-lg text-white">
            {certificate.name || t('beautyConsultation.certificate', 'Chứng chỉ')}
          </DialogTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-full flex items-center justify-center p-4">
          <img 
            src={certificate.fileUrl} 
            alt={certificate.name || t('beautyConsultation.certificate', 'Chứng chỉ')}
            className="max-w-full max-h-[70vh] object-contain" 
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 