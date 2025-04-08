import { Dialog, DialogContent } from '@/components/ui/dialog'

interface VideoDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  videoUrl: string
  title: string
}

export default function VideoDialog({ isOpen, onOpenChange, videoUrl, title }: VideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="aspect-video w-full">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            title={`${title} Introduction`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}
