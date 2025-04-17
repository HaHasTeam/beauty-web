import { PlayCircle } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Default image to use when video loading fails
import DEFAULT_IMAGE from '@/assets/images/consultant-default.jpg'

interface VideoThumbnailProps {
  src: string
  className?: string
  showControls?: boolean
  alt?: string
  onClick?: () => void
}

/**
 * Component to display a video thumbnail with a play button overlay
 * Directly uses the video element as preview with a play button overlay
 */
const VideoThumbnail = ({
  src,
  className = '',
  showControls = false,
  alt = 'Video thumbnail',
  onClick
}: VideoThumbnailProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Memoize the src to avoid unnecessary re-renders
  const memoizedSrc = useMemo(() => src, [src])

  // Set up the video element
  useEffect(() => {
    const video = videoRef.current
    if (!video || !memoizedSrc) return
    
    setIsLoading(true)
    
    // Handle successful loading
    const handleLoaded = () => {
      setIsLoading(false)
      
      // Set video to first frame
      video.currentTime = 0.1
    }

    // Handle loading errors
    const handleError = () => {
      console.error('Error loading video for thumbnail:', memoizedSrc)
      setIsLoading(false)
    }

    video.addEventListener('loadeddata', handleLoaded, { once: true })
    video.addEventListener('error', handleError, { once: true })
    
    // Set up a timeout for videos that take too long to load
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        console.warn('Timeout reached while loading video')
      }
    }, 5000) // 5 second timeout

    return () => {
      video.removeEventListener('loadeddata', handleLoaded)
      video.removeEventListener('error', handleError)
      clearTimeout(timeout)
    }
  }, [memoizedSrc, isLoading])

  // Handle video mouse interaction
  const handleMouseOver = (e: React.MouseEvent<HTMLVideoElement>) => {
    if (showControls) return // Don't auto-play if showing controls
    
    const video = e.currentTarget
    if (video.readyState >= 2) {
      video.play().catch(() => {
        // Ignore autoplay errors
      })
    }
  }
  
  const handleMouseOut = (e: React.MouseEvent<HTMLVideoElement>) => {
    if (showControls) return // Don't auto-pause if showing controls
    
    const video = e.currentTarget
    video.pause()
    video.currentTime = 0.1
  }

  // Handle container click
  const handleContainerClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div 
      className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}
      onClick={handleContainerClick}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <PlayCircle className='text-white w-10 h-10 drop-shadow-md' />
        </div>
      )}

      {/* Video element as thumbnail */}
      <video
        ref={videoRef}
        src={memoizedSrc}
        className="w-full h-full object-cover"
        muted
        loop
        preload="metadata"
        playsInline
        controls={showControls}
        onLoadedMetadata={(e) => {
          // Set time to first frame
          e.currentTarget.currentTime = 0.1
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onError={(e) => {
          const target = e.currentTarget.parentElement
          if (target) {
            const img = document.createElement('img')
            img.src = DEFAULT_IMAGE
            img.alt = alt
            img.className = "w-full h-full object-cover"
            target.appendChild(img)
          }
        }}
      >
        {t('validation.videoBrowser', 'Your browser does not support video playback')}
      </video>

      {/* Play button overlay - only show if not using controls */}
      {!showControls && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-300 z-20">
          <div className="relative flex items-center justify-center group">
            {/* Large outer circle with blur effect */}
            <div className="absolute w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm shadow-lg transform group-hover:scale-110 transition-transform duration-300"></div>
            
            {/* Medium gradient circle */}
            <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary/90 to-primary shadow-inner transform group-hover:scale-110 transition-transform duration-300"></div>
            
            {/* Inner white circle with triangle */}
            <div className="absolute w-14 h-14 rounded-full bg-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              {/* Custom play triangle */}
              <div className="w-0 h-0 ml-1 
                border-t-[10px] border-t-transparent 
                border-l-[18px] border-l-white 
                border-b-[10px] border-b-transparent">
              </div>
            </div>
            
            {/* Pulse animation ring */}
            <div className="absolute w-24 h-24 rounded-full border-2 border-primary/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoThumbnail 