import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

// Helper function to handle different video URL formats
const getEmbedUrl = (url: string): string => {
  // Already an embed URL
  if (url.includes('embed')) {
    return url
  }
  
  // YouTube video
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // YouTube short URL
  if (url.includes('youtu.be')) {
    const videoId = url.split('/').pop()
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop()
    return `https://player.vimeo.com/video/${videoId}`
  }
  
  // If it's a direct video link, just return it
  return url
}

interface VideoDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  videoUrl: string
  title?: string
}

export default function VideoDialog({
  isOpen,
  onOpenChange,
  videoUrl,
  title = 'Video',
}: VideoDialogProps) {
  const { t } = useTranslation()
  const [embedUrl, setEmbedUrl] = useState<string>('')
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  
  // Process the video URL when it changes
  useEffect(() => {
    if (videoUrl) {
      setEmbedUrl(getEmbedUrl(videoUrl))
    }
  }, [videoUrl])
  
  // Reset loading state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsVideoLoading(true)
    }
  }, [isOpen])

  const handleVideoLoad = () => {
    setIsVideoLoading(false)
  }
  
  const isExternalVideo = embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com')

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] p-0 bg-black border-0">
        <div className="p-4 flex justify-between items-center">
          <DialogTitle className="text-lg text-white">{title}</DialogTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative aspect-video w-full">
          {isVideoLoading && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {isExternalVideo ? (
            // YouTube/Vimeo embed
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoad}
            ></iframe>
          ) : (
            // Direct video file
            <video
              src={embedUrl}
              className="w-full h-full"
              controls
              autoPlay
              onLoadedData={handleVideoLoad}
              onError={() => setIsVideoLoading(false)}
            >
              {t('validation.videoBrowser', 'Your browser does not support video playback')}
            </video>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
