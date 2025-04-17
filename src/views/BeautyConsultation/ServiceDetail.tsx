import 'react-quill-new/dist/quill.bubble.css'
import './components/quill-styles.css'

import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeftIcon,
  CalendarIcon,
  FileIcon,
  FileTextIcon,
  FormInputIcon,
  ImageIcon,
  Star,
  VideoIcon,
  XIcon,
} from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import DEFAULT_IMAGE from '@/assets/images/consultant-default.jpg'
import Empty from '@/components/empty/Empty'
import ReviewFilter from '@/components/filter/ReviewFilter'
import ReviewOverall from '@/components/reviews/ReviewOverall'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import configs from '@/config'
import { cn } from '@/lib/utils'
import { getConsultantFeedbackApi } from '@/network/apis/feedback'
import { getConsultantActiveByIdWithFullActiveService, getConsultantsWithServicesApi } from '@/network/apis/user'
import { IConsultantService } from '@/types/consultant-service'
import { ServiceTypeEnum } from '@/types/enum'
import { IFeedbackGeneral } from '@/types/feedback'
import { TUser } from '@/types/user'

import ActionButton from './components/ActionButton'
import ServiceCTA from './components/ServiceCTA'
import VideoDialog from './components/VideoDialog'
import VideoThumbnail from './components/VideoThumbnail'

export default function ServiceDetail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedServiceId, setSelectedServiceId] = useQueryState('service')
  const [service, setService] = useState<IConsultantService | null>(null)
  const [loading, setLoading] = useState(true)
  const [videoOpen, setVideoOpen] = useState(false)
  const [consultantVideoOpen, setConsultantVideoOpen] = useState(false)
  const [consultant, setConsultant] = useState<TUser | null>(null)
  const [consultantServices, setConsultantServices] = useState<IConsultantService[]>([])
  const [activeTab, setActiveTab] = useState<string>('services')
  const [showAllCertificates, setShowAllCertificates] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [activeConsultantImage, setActiveConsultantImage] = useState<{ url: string; type: 'image' | 'video' } | null>(
    null,
  )
  const consultantId = useParams().consultantId
  const [searchParams] = useSearchParams()
  const serviceId = searchParams.get('service')

  // Refs for scrolling into view
  const selectedCardRef = useRef<HTMLDivElement>(null)
  const serviceDetailRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  // Query consultant data with services
  const {
    data: consultantWithServices,
    isLoading: isConsultantWithServicesLoading,
    isError: isConsultantWithServicesError,
  } = useQuery({
    queryKey: [getConsultantActiveByIdWithFullActiveService.queryKey, consultantId as string],
    queryFn: getConsultantActiveByIdWithFullActiveService.fn,
  })

  // Query consultant feedback data for overall review statistics
  const { data: consultantFeedbackData, isLoading: isFeedbackLoading } = useQuery({
    queryKey: [getConsultantFeedbackApi.queryKey, consultantId || ''],
    queryFn: getConsultantFeedbackApi.fn,
    enabled: !!consultantId && activeTab === 'reviews',
  })

  // Query other available consultants and their services
  const { data: relatedConsultantsData } = useQuery({
    queryKey: [getConsultantsWithServicesApi.queryKey, { limit: 4 }],
    queryFn: getConsultantsWithServicesApi.fn,
    select: (data) => {
      return data.data.items.filter((item) => item.consultant.id !== consultantId)
    },
    enabled: !!consultantId,
  })

  // Helper functions to adapt between TUser and ConsultantInfo properties
  const getConsultantName = (user: TUser): string => {
    return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username
  }

  const getConsultantTitle = (user: TUser): string => {
    return user.majorTitle || t('beautyConsultation.beautyConsultant', 'Chuyên gia Trang điểm')
  }

  const getConsultantExperience = (user: TUser): number | null => {
    return user.yoe || null
  }

  const getConsultantReviewCount = (): number | null => {
    // In a real implementation, this would come from the API
    // For now we'll return null to indicate we don't have the data
    return null
  }

  const getConsultantAddress = (user: TUser): string | null => {
    // First check for default address
    const defaultAddress = user.addresses?.find((addr) => addr.isDefault)

    // Then fall back to first address
    const firstAddress = user.addresses?.[0]

    if (defaultAddress) {
      return defaultAddress.fullAddress || defaultAddress.province || defaultAddress.detailAddress || null
    } else if (firstAddress) {
      return firstAddress.fullAddress || firstAddress.province || firstAddress.detailAddress || null
    }

    return null
  }

  const getConsultantDescription = (user: TUser): string => {
    return user.description || t('beautyConsultation.noDescription', 'Không có mô tả.')
  }

  // Get certificates from the consultant's certificates array
  const getConsultantCertificates = (user: TUser) => {
    if (!user.certificates || user.certificates.length === 0) {
      return []
    }

    return user.certificates.map((cert, index) => {
      // Parse name and year from certificate name (format: name_year)
      const certName = cert.name || ''
      const [name, yearStr] = certName.split('_')
      const year = yearStr ? parseInt(yearStr) : new Date().getFullYear()

      return {
        id: cert.id || `cert-${index}`,
        name: name || certName,
        issuer: t('beautyConsultation.certIssuer', 'Tổ chức chứng nhận'),
        year: year,
        imageUrl: cert.fileUrl || DEFAULT_IMAGE,
      }
    })
  }

  // Extract consultant media (videos and thumbnails)
  const getConsultantMedia = (user: TUser) => {
    const media: { id: string; url: string; thumbnailUrl: string; title: string; type: 'image' | 'video' }[] = []

    // Add video introduction if available
    if (user.introduceVideo) {
      // Get thumbnail for video - use avatar as fallback
      const videoThumbnail =
        user.thumbnailImageList?.find((img) => img.name?.includes('video_thumb'))?.fileUrl ||
        user.avatar ||
        DEFAULT_IMAGE

      media.push({
        id: 'video-intro',
        url: user.introduceVideo,
        thumbnailUrl: videoThumbnail,
        title: t('beautyConsultation.introVideo', 'Giới thiệu'),
        type: 'video',
      })
    }

    // Add thumbnail images if available
    if (user.thumbnailImageList && user.thumbnailImageList.length > 0) {
      user.thumbnailImageList.forEach((item, index) => {
        // Determine if it's a video or image based on file extension or MIME type
        const fileUrl = item.fileUrl || ''
        const isVideo =
          fileUrl.toLowerCase().endsWith('.mp4') ||
          fileUrl.toLowerCase().endsWith('.mov') ||
          fileUrl.toLowerCase().includes('youtube') ||
          fileUrl.toLowerCase().includes('vimeo')

        // For videos, we need a thumbnail URL (which may be the same item or a different one)
        let thumbnailUrl = fileUrl

        // If it's a video, try to find a matching thumbnail
        if (isVideo && user.thumbnailImageList) {
          // Try to find a matching thumbnail in the list
          const thumbnailImage = user.thumbnailImageList.find(
            (t) =>
              t.name?.includes(`thumb_${item.id || ''}`) || (item.name && t.name?.includes(item.name.split('.')[0])),
          )

          if (thumbnailImage && thumbnailImage.fileUrl) {
            thumbnailUrl = thumbnailImage.fileUrl
          } else {
            // Fallback to avatar or default image
            thumbnailUrl = user.avatar || DEFAULT_IMAGE
          }
        }

        media.push({
          id: item.id || `thumbnail-${index}`,
          url: fileUrl,
          thumbnailUrl: thumbnailUrl,
          title: item.name || t('beautyConsultation.portfolioItem', 'Tác phẩm'),
          type: isVideo ? 'video' : 'image',
        })
      })
    }

    // If no media, add avatar as fallback
    if (media.length === 0 && user.avatar) {
      media.push({
        id: 'avatar',
        url: user.avatar,
        thumbnailUrl: user.avatar,
        title: getConsultantName(user),
        type: 'image',
      })
    }

    return media
  }

  // Helper function to get consultant rating
  const getConsultantRating = (): { rating: number; count: number } => {
    // Mock data for now - will be replaced with actual API data
    return { rating: 0, count: 0 }
  }

  // Helper function to convert feedback data to IFeedbackGeneral format
  const convertToFeedbackGeneral = (): IFeedbackGeneral => {
    if (!consultantFeedbackData?.data || consultantFeedbackData.data.length === 0) {
      return {
        averageRating: 0,
        totalCount: 0,
        rating1Count: 0,
        rating2Count: 0,
        rating3Count: 0,
        rating4Count: 0,
        rating5Count: 0,
      }
    }

    const feedbacks = consultantFeedbackData.data
    const totalCount = feedbacks.length

    // Count ratings
    const rating1Count = feedbacks.filter((f) => f.rating === 1).length
    const rating2Count = feedbacks.filter((f) => f.rating === 2).length
    const rating3Count = feedbacks.filter((f) => f.rating === 3).length
    const rating4Count = feedbacks.filter((f) => f.rating === 4).length
    const rating5Count = feedbacks.filter((f) => f.rating === 5).length

    // Calculate average
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0)
    const averageRating = totalCount > 0 ? Number((sum / totalCount).toFixed(1)) : 0

    return {
      averageRating,
      totalCount,
      rating1Count,
      rating2Count,
      rating3Count,
      rating4Count,
      rating5Count,
    }
  }

  // Add states to track if descriptions are expanded
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isServiceDescriptionExpanded, setIsServiceDescriptionExpanded] = useState(false)
  const [isShortDescriptionExpanded, setIsShortDescriptionExpanded] = useState(false)

  // Toggle description expansion
  const toggleDescriptionExpand = () => {
    setIsDescriptionExpanded((prev) => !prev)
  }

  // State để lưu trữ URL video hiện tại
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    // Reset states when service changes
    setVideoOpen(false)
    setConsultantVideoOpen(false)
    setIsServiceDescriptionExpanded(false)
    setIsShortDescriptionExpanded(false)
    setCurrentVideoUrl(null)

    // Initialize selected service from URL or current service ID
    if (!selectedServiceId) {
      setSelectedServiceId(serviceId || null)
    }

    setActiveTab('services')
    setShowAllCertificates(false)
    setEnlargedImage(null)

    if (consultantWithServices) {
      const consultantData = consultantWithServices.data.consultant
      const services = consultantWithServices.data.services

      // Find the current service within consultant services
      const foundService = services.find((s) => s.id === serviceId)

      if (foundService) {
        setService(foundService)
        setConsultant(consultantData)
        setConsultantServices(services)

        // Set active consultant media - prioritize video intro if available
        if (consultantData.introduceVideo) {
          // Store the video URL (the thumbnail will be found through getConsultantMedia)
          setActiveConsultantImage({
            url: consultantData.introduceVideo,
            type: 'video',
          })
        } else if (consultantData.thumbnailImageList && consultantData.thumbnailImageList.length > 0) {
          // Use first thumbnail
          const firstItem = consultantData.thumbnailImageList[0]
          const fileUrl = firstItem.fileUrl || ''
          const isVideo =
            fileUrl.toLowerCase().endsWith('.mp4') ||
            fileUrl.toLowerCase().endsWith('.mov') ||
            fileUrl.toLowerCase().includes('youtube') ||
            fileUrl.toLowerCase().includes('vimeo')

          setActiveConsultantImage({
            url: fileUrl,
            type: isVideo ? 'video' : 'image',
          })
        } else if (consultantData.avatar) {
          // Fallback to avatar
          setActiveConsultantImage({
            url: consultantData.avatar,
            type: 'image',
          })
        }
      }

      setLoading(false)
    } else if (isConsultantWithServicesError) {
      setLoading(false)
    } else {
      setLoading(isConsultantWithServicesLoading)
    }
  }, [
    serviceId,
    setSelectedServiceId,
    selectedServiceId,
    consultantWithServices,
    isConsultantWithServicesLoading,
    isConsultantWithServicesError,
  ])

  // Scroll selected service card and tabs into view when selection changes
  useEffect(() => {
    if (selectedServiceId) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        // Scroll the selected service card into view
        if (selectedCardRef.current) {
          selectedCardRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          })
        }

        // Then scroll service detail into view with a slight delay
        setTimeout(() => {
          if (serviceDetailRef.current) {
            // Use scrollIntoView with 'nearest' to minimize viewport changes
            serviceDetailRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest',
            })
          }
        }, 100)
      }, 50)
    }
  }, [selectedServiceId])

  // Handle back navigation
  const handleBack = () => {
    navigate(configs.routes.beautyConsultation)
  }

  // Handle video play for consultant intro
  const handleConsultantVideoPlay = () => {
    setConsultantVideoOpen(true)
  }

  // Handle service click in consultant services
  const handleServiceClick = (id: string) => {
    if (id === serviceId) {
      // If clicking the current service, just update the query param
      setSelectedServiceId(id)
      return
    }
    // Navigate to the new service while preserving the selected service state
    navigate(`${configs.routes.beautyConsultation}/${consultantId}?service=${id}`)
    setSelectedServiceId(id)
  }

  // Toggle showing all certificates
  const toggleCertificates = () => {
    setShowAllCertificates((prev) => !prev)
  }

  // Get certificates to display
  const getCertificatesToDisplay = () => {
    if (!consultant) return []
    const certificates = getConsultantCertificates(consultant)
    return showAllCertificates ? certificates : certificates.slice(0, 2)
  }

  // Handle thumbnail click
  const handleThumbnailClick = (url: string, type: 'image' | 'video') => {
    setActiveConsultantImage({ url, type })

    // Auto-play video if it's a video type
    if (type === 'video') {
      handleConsultantVideoPlay()
    }
  }

  // Close enlarged image
  const closeEnlargedImage = () => {
    setEnlargedImage(null)
  }

  // Get selected service details from consultant
  const getSelectedService = () => {
    if (!consultant || !selectedServiceId) return null

    const consultantService = consultantServices.find((s) => s.id === selectedServiceId)
    return consultantService || null
  }

  // Format price for display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Mock video URL based on service type
  const getVideoUrl = () => {
    // Nếu có currentVideoUrl, sử dụng nó
    if (currentVideoUrl) {
      return currentVideoUrl
    }

    // Fallback sang video mặc định dựa trên loại dịch vụ
    return service?.systemService.type === ServiceTypeEnum.PREMIUM
      ? 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      : 'https://www.youtube.com/embed/KYz2wyBy3kc'
  }

  // Get consultant intro video URL (mock)
  const getConsultantVideoUrl = () => {
    return consultant?.introduceVideo || 'https://www.youtube.com/embed/jfKfPfyJRdk'
  }

  // Get the service duration based on type
  const getServiceDuration = (service: IConsultantService): number | null => {
    return service.systemService.type === ServiceTypeEnum.PREMIUM ? 60 : null
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto lg:px- md:px-3 sm:px-4 px-2 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {t('beautyConsultation.loading', 'Đang tải thông tin dịch vụ...')}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!service || !consultant) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto lg:px-28 md:px-3 sm:px-4 px-2 py-8">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                {t('beautyConsultation.serviceNotFound', 'Không tìm thấy dịch vụ')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('beautyConsultation.serviceNotFoundDesc', 'Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.')}
              </p>
              <Button onClick={handleBack}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                {t('beautyConsultation.backToServices', 'Quay lại danh sách dịch vụ')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedService = getSelectedService() || service
  console.log(selectedService, 'SDf')

  // If we have certificates, prepare them for display
  const consultantCertificates = getCertificatesToDisplay()
  console.log(consultantServices[0].images[0].fileUrl, 'SDAf')

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto lg:px-28 md:px-3 sm:px-4 px-2 py-8">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-4" onClick={handleBack}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {t('beautyConsultation.backToServices', 'Quay lại')}
        </Button>

        <div className="animate-fadeIn space-y-12">
          {/* Consultant Section - 1:1 ratio with 16:9 image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Consultant Image Section - 1/2 width */}
            <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden h-fit">
              {/* Main Consultant Image/Video with Video Trigger - 16:9 aspect ratio */}
              <div
                className="relative group cursor-pointer overflow-hidden"
                onClick={() => {
                  if (activeConsultantImage?.type === 'video') {
                    handleConsultantVideoPlay()
                  } else if (activeConsultantImage?.url) {
                    setEnlargedImage(activeConsultantImage.url)
                  }
                }}
              >
                <div className="aspect-video relative">
                  {activeConsultantImage?.type === 'video' ? (
                    <VideoThumbnail
                      src={activeConsultantImage.url}
                      alt={getConsultantName(consultant)}
                      className="w-full h-full"
                      onClick={handleConsultantVideoPlay}
                    />
                  ) : (
                    <>
                      <img
                        src={activeConsultantImage?.url || consultant?.avatar || DEFAULT_IMAGE}
                        alt={getConsultantName(consultant)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = DEFAULT_IMAGE
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col items-center gap-1">
                          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                            <ImageIcon className="h-8 w-8 text-white" />
                          </div>
                          <Badge className="bg-primary/90 text-xs">
                            {t('beautyConsultation.viewLarger', 'Xem lớn hơn')}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Portfolio Thumbnails Carousel - Compact with 16:9 aspect ratio */}
              <div className="p-1 border-t border-border">
                <Carousel
                  opts={{
                    align: 'start',
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="ml-1">
                    {consultant &&
                      getConsultantMedia(consultant).map((mediaItem) => (
                        <CarouselItem key={mediaItem.id} className="basis-1/4 pl-1">
                          <div
                            className={`aspect-video cursor-pointer relative overflow-hidden rounded-md`}
                            onClick={() => handleThumbnailClick(mediaItem.url, mediaItem.type)}
                          >
                            {mediaItem.type === 'video' ? (
                              <VideoThumbnail
                                src={mediaItem.url}
                                alt={mediaItem.title}
                                className={cn(
                                  activeConsultantImage?.url === mediaItem.url
                                    ? 'border-2 border-primary p-1 rounded-lg opacity-50'
                                    : '',
                                )}
                                onClick={() => handleThumbnailClick(mediaItem.url, mediaItem.type)}
                              />
                            ) : (
                              <img
                                src={mediaItem.thumbnailUrl}
                                alt={mediaItem.title}
                                className={cn(
                                  'w-full h-full object-cover transition-transform duration-300 hover:scale-110',
                                  activeConsultantImage?.url === mediaItem.url
                                    ? 'border-2 border-primary p-1 rounded-lg opacity-50'
                                    : '',
                                )}
                              />
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  {getConsultantMedia(consultant).length > 4 && (
                    <>
                      <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5" />
                      <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5" />
                    </>
                  )}
                </Carousel>
              </div>
            </div>

            {/* Consultant Information Section - 1/2 width */}
            <div className="bg-gradient-to-br from-white via-white to-muted/10 border border-border rounded-lg shadow-sm overflow-hidden h-fit">
              {/* Consultant Header - Modern Card Style */}
              <div className="relative">
                {/* Header Background with Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-70" />

                <div className="relative p-4 flex items-center gap-3">
                  {/* Avatar with Ring Effect */}
                  <div className="h-16 w-16 rounded-full border-2 border-primary p-0.5 overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br from-primary/20 to-white">
                    <img
                      src={consultant.avatar || DEFAULT_IMAGE}
                      alt={getConsultantName(consultant)}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = DEFAULT_IMAGE
                      }}
                    />
                  </div>

                  {/* Consultant Main Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-foreground line-clamp-1">{getConsultantName(consultant)}</h1>
                    <p className="text-sm text-muted-foreground line-clamp-1">{getConsultantTitle(consultant)}</p>

                    {/* Stats as Pills */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {getConsultantExperience(consultant) && (
                        <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center">
                          <span className="inline-block mr-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
                          {getConsultantExperience(consultant)} {t('beautyConsultation.yearsExp', 'Năm KN')}
                        </div>
                      )}

                      <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center">
                        <span className="inline-block mr-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
                        <Star className="h-3 w-3 mr-0.5 text-yellow-400 fill-yellow-400" />
                        <span className="mr-0.5">
                          {getConsultantRating().rating > 0 ? getConsultantRating().rating.toFixed(1) : 0}
                        </span>
                        <span>({getConsultantRating().count})</span>
                      </div>

                      {getConsultantAddress(consultant) && (
                        <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center">
                          <span className="inline-block mr-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
                          {getConsultantAddress(consultant)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultant Content - Clean Tabbed Layout */}
              <div className="p-3">
                {/* Certificates Section - Modern List */}
                <div className="mb-3 bg-white rounded-md border border-muted/70 shadow-sm">
                  <div className="flex items-center justify-between p-3 border-b border-muted/50">
                    <h3 className="text-sm font-medium text-foreground flex items-center">
                      <span className="w-1 h-4 bg-primary rounded-sm mr-2"></span>
                      {t('beautyConsultation.certificates', 'Chứng chỉ & Giải thưởng')}
                    </h3>
                    {consultantCertificates.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs font-normal hover:bg-primary/5 hover:text-primary"
                        onClick={toggleCertificates}
                      >
                        {showAllCertificates
                          ? t('beautyConsultation.showLess', 'Thu gọn')
                          : t('beautyConsultation.showMore', `Xem tất cả (${consultantCertificates.length})`)}
                      </Button>
                    )}
                  </div>

                  <div className="divide-y divide-muted/20">
                    <TooltipProvider>
                      {consultantCertificates.length > 0 ? (
                        consultantCertificates.map((cert) => (
                          <Tooltip key={cert.id}>
                            <TooltipTrigger asChild>
                              <div
                                className="hover:bg-muted/5 transition-colors cursor-pointer p-2.5 flex items-center group"
                                onClick={() => {
                                  // Create download link for certificate
                                  const link = document.createElement('a')
                                  link.href = cert.imageUrl
                                  link.download = cert.name || 'certificate.jpg'
                                  link.target = '_blank'
                                  document.body.appendChild(link)
                                  link.click()
                                  document.body.removeChild(link)
                                }}
                              >
                                <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center mr-2.5 text-primary/70 text-xs font-medium group-hover:bg-primary/20 transition-colors">
                                  {cert.year.toString().substring(2)}
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors block leading-tight">
                                    {cert.name}
                                  </span>
                                  <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-muted-foreground/80 transition-colors">
                                    {cert.year}
                                  </p>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <FileIcon className="h-3.5 w-3.5 text-primary" />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="max-w-xs bg-white/95 backdrop-blur-sm shadow-lg border-border"
                            >
                              <div className="space-y-2 p-1">
                                <div className="font-medium text-foreground">{cert.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {t('beautyConsultation.yearObtained', 'Năm nhận')}: {cert.year}
                                </div>
                                <div className="h-24 w-full overflow-hidden rounded-md mt-2 bg-muted/10 flex items-center justify-center border border-border/40">
                                  {cert.imageUrl.toLowerCase().endsWith('.jpg') ||
                                  cert.imageUrl.toLowerCase().endsWith('.jpeg') ||
                                  cert.imageUrl.toLowerCase().endsWith('.png') ||
                                  cert.imageUrl.toLowerCase().endsWith('.gif') ||
                                  cert.imageUrl.toLowerCase().endsWith('.webp') ? (
                                    <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                                  ) : cert.imageUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div className="flex flex-col items-center">
                                      <FileTextIcon className="h-8 w-8 text-rose-500" />
                                      <span className="text-xs mt-1 font-medium">PDF</span>
                                    </div>
                                  ) : cert.imageUrl.toLowerCase().endsWith('.doc') ||
                                    cert.imageUrl.toLowerCase().endsWith('.docx') ? (
                                    <div className="flex flex-col items-center">
                                      <FileTextIcon className="h-8 w-8 text-blue-500" />
                                      <span className="text-xs mt-1 font-medium">DOC</span>
                                    </div>
                                  ) : cert.imageUrl.toLowerCase().endsWith('.ppt') ||
                                    cert.imageUrl.toLowerCase().endsWith('.pptx') ? (
                                    <div className="flex flex-col items-center">
                                      <FileTextIcon className="h-8 w-8 text-orange-500" />
                                      <span className="text-xs mt-1 font-medium">PPT</span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center">
                                      <FileIcon className="h-8 w-8 text-primary" />
                                      <span className="text-xs mt-1 font-medium">
                                        {t('beautyConsultation.document', 'Tài liệu')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-center text-primary font-medium">
                                  {t('beautyConsultation.clickToDownload', 'Nhấp để tải xuống')} ↓
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))
                      ) : (
                        <div className="p-3 text-center text-sm text-muted-foreground">
                          {t('beautyConsultation.noCertificates', 'Không có chứng chỉ')}
                        </div>
                      )}
                    </TooltipProvider>
                  </div>
                </div>

                {/* Description Section - Card with Quote Style */}
                <div className="bg-white rounded-md border-muted/70 overflow-hidden">
                  <div className="p-3 relative">
                    {/* Quote Icon */}
                    <div className="absolute top-1 left-1 text-primary/50 font-serif text-4xl -mt-2 -ml-1">"</div>
                    <div className="absolute bottom-1 right-1 text-primary/50 font-serif text-4xl -mb-3 -mr-1">"</div>

                    {/* Description with styled first letter */}
                    <div className="text-sm leading-relaxed text-muted-foreground relative z-10">
                      {consultant.description && consultant.description.includes('<') ? (
                        <div className={cn('quill-content-small', isDescriptionExpanded && 'expanded')}>
                          <div className={isDescriptionExpanded ? '' : 'max-h-[150px] overflow-hidden'}>
                            <ReactQuill value={consultant.description} readOnly={true} theme="bubble" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <p
                            className={
                              isDescriptionExpanded
                                ? 'whitespace-pre-line'
                                : 'max-h-[150px] overflow-hidden whitespace-pre-line'
                            }
                          >
                            <span className="text-primary text-lg font-medium">
                              {getConsultantDescription(consultant).charAt(0)}
                            </span>
                            {getConsultantDescription(consultant).substring(1)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* See more/less button outside the container */}
                  {(getConsultantDescription(consultant).length > 200 ||
                    (consultant.description &&
                      consultant.description.includes('<') &&
                      consultant.description.length > 200)) && (
                    <div className="flex justify-center border-t border-muted/20 bg-muted/5 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleDescriptionExpand}
                        className="text-xs h-7 px-4 hover:bg-primary/10"
                      >
                        {isDescriptionExpanded
                          ? t('beautyConsultation.showLess', 'Thu gọn')
                          : t('beautyConsultation.showMore', 'Xem thêm')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Tabs - Line style */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" ref={tabsRef}>
            <div className="border-b border-border mb-6">
              <TabsList className="bg-transparent h-10">
                <TabsTrigger
                  value="services"
                  className="text-sm data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-4"
                >
                  {t('beautyConsultation.services', 'Dịch vụ')}
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-sm data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent h-10 px-4"
                >
                  {t('beautyConsultation.consultantReviews', 'Đánh giá chuyên gia')}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Services Tab Content */}
            <TabsContent value="services" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Service List from Consultant */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    {consultantServices.map((consultantService) => (
                      <Card
                        key={consultantService.id}
                        ref={consultantService.id === selectedServiceId ? selectedCardRef : null}
                        className={`overflow-hidden cursor-pointer ${consultantService.id === selectedServiceId ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleServiceClick(consultantService.id)}
                      >
                        <div className="flex h-24">
                          {/* Service image */}
                          <div className="relative w-24 h-full flex-shrink-0 overflow-hidden">
                            {consultantService.images && consultantService.images.length > 0 ? (
                              <img
                                src={consultantService.images[0].fileUrl || DEFAULT_IMAGE}
                                alt={consultantService.systemService.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = DEFAULT_IMAGE
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>

                          {/* Service info */}
                          <div className="flex-1 p-3 flex flex-col justify-between">
                            <div>
                              <div className="mb-1">
                                <Badge
                                  variant={
                                    consultantService.systemService.type === ServiceTypeEnum.PREMIUM
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                  className="text-[10px]"
                                >
                                  {consultantService.systemService.type === ServiceTypeEnum.PREMIUM
                                    ? t('beautyConsultation.premiumShort', 'Premium')
                                    : t('beautyConsultation.standardShort', 'Standard')}
                                </Badge>
                              </div>
                              <h3 className="text-sm font-medium line-clamp-1">
                                {consultantService.systemService.name}
                              </h3>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="font-bold text-sm">{formatPrice(consultantService.price)}</div>
                              {getServiceDuration(consultantService) && (
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  {getServiceDuration(consultantService)} {t('beautyConsultation.min', 'phút')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Right: Selected Service Details */}
                <div ref={serviceDetailRef} className="lg:col-span-8 space-y-6">
                  {/* Selected Service Hero - Image and Info in vertical layout */}
                  <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
                    <div className="flex flex-col">
                      {/* Service Images Carousel */}
                      <div className="w-full">
                        <Carousel
                          opts={{
                            align: 'start',
                            loop: true,
                          }}
                          className="w-full"
                        >
                          <CarouselContent>
                            {selectedService.images && selectedService.images.length > 0 ? (
                              selectedService.images.map((image, index) => {
                                // Kiểm tra nếu là file video
                                const fileUrl = image.fileUrl || ''
                                const isVideo =
                                  fileUrl.toLowerCase().endsWith('.mp4') ||
                                  fileUrl.toLowerCase().endsWith('.mov') ||
                                  fileUrl.toLowerCase().includes('youtube') ||
                                  fileUrl.toLowerCase().includes('vimeo')
                                console.log(fileUrl, isVideo)

                                return (
                                  <CarouselItem key={index}>
                                    <div className="relative aspect-video overflow-hidden">
                                      {isVideo ? (
                                        <VideoThumbnail
                                          src={fileUrl}
                                          alt={`${selectedService.systemService.name} - ${index + 1}`}
                                          className="w-full h-full"
                                          onClick={() => {
                                            setCurrentVideoUrl(fileUrl)
                                            setVideoOpen(true)
                                          }}
                                        />
                                      ) : (
                                        <img
                                          src={image.fileUrl || DEFAULT_IMAGE}
                                          alt={`${selectedService.systemService.name} - ${index + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = DEFAULT_IMAGE
                                          }}
                                        />
                                      )}
                                      {(index === 0 &&
                                        selectedService.systemService.type === ServiceTypeEnum.PREMIUM) ||
                                      isVideo ? null : (
                                        <div
                                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
                                          onClick={() => setEnlargedImage(image.fileUrl || DEFAULT_IMAGE)}
                                        >
                                          <div className="relative flex items-center justify-center group">
                                            {/* Hiệu ứng xem ảnh phóng to */}
                                            <div className="absolute w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                                            <div className="absolute w-12 h-12 rounded-full bg-white/20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                              <ImageIcon className="h-6 w-6 text-white" />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </CarouselItem>
                                )
                              })
                            ) : (
                              <CarouselItem>
                                <div className="relative aspect-video bg-muted flex items-center justify-center">
                                  <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                                </div>
                              </CarouselItem>
                            )}
                          </CarouselContent>
                          {selectedService.images && selectedService.images.length > 1 && (
                            <>
                              <CarouselPrevious className="left-2" />
                              <CarouselNext className="right-2" />
                            </>
                          )}
                        </Carousel>
                      </div>

                      {/* Service Info Card */}
                      <div className="p-5 border-t border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant={
                              selectedService.systemService.type === ServiceTypeEnum.PREMIUM
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="uppercase"
                          >
                            {selectedService.systemService.type === ServiceTypeEnum.PREMIUM ? (
                              <div className="flex items-center gap-1">
                                <VideoIcon className="h-3 w-3" />
                                <span>{t('beautyConsultation.premium', 'Cao cấp')}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <FormInputIcon className="h-3 w-3" />
                                <span>{t('beautyConsultation.standard', 'Tiêu chuẩn')}</span>
                              </div>
                            )}
                          </Badge>
                          <Badge variant="outline">{selectedService.systemService.category?.name || 'Beauty'}</Badge>
                        </div>

                        <h1 className="text-xl font-bold mb-2">{selectedService.systemService.name}</h1>
                        <div className="relative mb-1">
                          <div
                            className={cn(
                              'prose prose-sm max-w-none overflow-hidden',
                              !isShortDescriptionExpanded && 'max-h-[80px]',
                            )}
                          >
                            {selectedService.systemService.description?.includes('<') ? (
                              <div className="pt-2">
                                <ReactQuill
                                  value={selectedService.systemService.description}
                                  readOnly={true}
                                  theme="bubble"
                                />
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground pt-2">
                                {selectedService.systemService.description}
                              </p>
                            )}
                            {!isShortDescriptionExpanded &&
                              selectedService.systemService.description &&
                              typeof selectedService.systemService.description === 'string' &&
                              selectedService.systemService.description.length > 80 && (
                                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                              )}
                          </div>
                        </div>

                        {selectedService.systemService.description &&
                          selectedService.systemService.description.length > 150 && (
                            <div className="flex justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsShortDescriptionExpanded((prev) => !prev)}
                                className="text-xs h-6 px-3 mb-3 hover:bg-primary/5 border-primary/30"
                              >
                                {isShortDescriptionExpanded
                                  ? t('beautyConsultation.showLess', 'Thu gọn')
                                  : t('beautyConsultation.showMore', 'Xem thêm')}
                              </Button>
                            </div>
                          )}

                        <div className="flex justify-between items-center my-4">
                          <div className="text-xl font-bold text-primary">{formatPrice(selectedService.price)}</div>
                          {getServiceDuration(selectedService) && (
                            <div className="flex items-center text-muted-foreground">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {getServiceDuration(selectedService)} {t('beautyConsultation.minutes', 'phút')}
                            </div>
                          )}
                        </div>

                        <ActionButton
                          onBookNow={() =>
                            navigate(configs.routes.serviceCheckout.replace(':serviceId', selectedService.id))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Description */}
                  <Card className="border border-border shadow-sm overflow-hidden bg-white">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-lg">
                        {t('beautyConsultation.aboutService', 'Về dịch vụ này')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={cn(
                          'prose max-w-none',
                          !isServiceDescriptionExpanded && 'max-h-[200px] overflow-hidden relative',
                        )}
                      >
                        {selectedService.description?.includes('<') ? (
                          <div className="pt-1">
                            <ReactQuill value={selectedService.description} readOnly={true} theme="bubble" />
                          </div>
                        ) : selectedService.description ? (
                          <p className="text-muted-foreground text-sm whitespace-pre-line pt-1">
                            {selectedService.description}
                          </p>
                        ) : (
                          <p className="text-muted-foreground text-sm whitespace-pre-line pt-1">
                            {t('beautyConsultation.noDescription', 'Không có mô tả.')}
                          </p>
                        )}
                        {!isServiceDescriptionExpanded &&
                          selectedService.description &&
                          typeof selectedService.description === 'string' &&
                          selectedService.description.length > 100 && (
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                          )}
                      </div>

                      {/* Toggle expand button */}
                      {selectedService.description && selectedService.description.length > 200 && (
                        <div className="flex justify-center mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsServiceDescriptionExpanded((prev) => !prev)}
                            className="text-xs h-7 px-4 hover:bg-primary/10 border-primary/30"
                          >
                            {isServiceDescriptionExpanded
                              ? t('beautyConsultation.showLess', 'Thu gọn')
                              : t('beautyConsultation.showMore', 'Xem thêm')}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab Content */}
            <TabsContent value="reviews" className="mt-0">
              <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-4">
                    {t('beautyConsultation.consultantReviews', 'Đánh giá về chuyên gia')}{' '}
                    {getConsultantName(consultant)}
                  </h2>

                  {isFeedbackLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Review Overview Component */}
                      <div className="lg:w-1/3 bg-muted/5 rounded-lg p-4">
                        <ReviewOverall reviewGeneral={convertToFeedbackGeneral()} />
                      </div>

                      {/* Review Filter and List */}
                      <div className="lg:w-2/3">
                        <ReviewFilter productId="" consultantId={consultant?.id || ''} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Services Section - Moved outside the tabs as separate section */}
          <div className="pt-6 border-t border-border">
            <h2 className="text-lg font-medium mb-4">{t('beautyConsultation.relatedServices', 'Dịch vụ tương tự')}</h2>

            {/* Kiểm tra nếu không có dịch vụ tương tự */}
            {consultantServices.filter((s) => s.id !== selectedService.id).length === 0 &&
            !relatedConsultantsData?.length ? (
              <Empty
                title={t('beautyConsultation.noRelatedServices', 'Không có dịch vụ tương tự')}
                description={t(
                  'beautyConsultation.tryOtherServices',
                  'Bạn có thể tìm kiếm các dịch vụ khác từ chuyên gia',
                )}
                icon=""
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Hiển thị dịch vụ từ consultant hiện tại */}
                {consultantServices
                  .filter((s) => s.id !== selectedService.id)
                  .slice(0, 1)
                  .map((relatedService) => (
                    <Card
                      key={relatedService.id}
                      className="overflow-hidden flex flex-col transition-all hover:shadow-md group cursor-pointer"
                      onClick={() => handleServiceClick(relatedService.id)}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <div className="relative aspect-video overflow-hidden">
                          {relatedService.systemService.type === ServiceTypeEnum.PREMIUM ? (
                            <VideoThumbnail
                              src={getVideoUrl()}
                              alt={relatedService.systemService.name}
                              className="w-full h-full"
                            />
                          ) : relatedService.images && relatedService.images.length > 0 ? (
                            (() => {
                              const image = relatedService.images[0]
                              const fileUrl = image.fileUrl || ''
                              const isVideo =
                                fileUrl.toLowerCase().endsWith('.mp4') ||
                                fileUrl.toLowerCase().endsWith('.mov') ||
                                fileUrl.toLowerCase().includes('youtube') ||
                                fileUrl.toLowerCase().includes('vimeo')

                              return isVideo ? (
                                <VideoThumbnail
                                  src={fileUrl}
                                  alt={relatedService.systemService.name}
                                  className="w-full h-full"
                                />
                              ) : (
                                <img
                                  src={fileUrl || DEFAULT_IMAGE}
                                  alt={relatedService.systemService.name}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = DEFAULT_IMAGE
                                  }}
                                />
                              )
                            })()
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            relatedService.systemService.type === ServiceTypeEnum.PREMIUM ? 'destructive' : 'secondary'
                          }
                          className="absolute bottom-2 right-2"
                        >
                          {relatedService.systemService.type === ServiceTypeEnum.PREMIUM
                            ? t('beautyConsultation.premiumShort', 'Premium')
                            : t('beautyConsultation.standardShort', 'Standard')}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{relatedService.systemService.name}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-primary">{formatPrice(relatedService.price)}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {getServiceDuration(relatedService)} {t('beautyConsultation.min', 'phút')}
                          </div>
                        </div>

                        {/* Consultant information */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={consultant.avatar || DEFAULT_IMAGE}
                              alt={getConsultantName(consultant)}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = DEFAULT_IMAGE
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium line-clamp-1">{getConsultantName(consultant)}</p>
                            <div className="flex items-center text-[10px] text-muted-foreground">
                              <span>
                                {getConsultantExperience(consultant)} {t('beautyConsultation.yearsExp', 'Năm KN')}
                              </span>
                              <span className="mx-1">•</span>
                              <span>
                                {getConsultantReviewCount()} {t('beautyConsultation.reviewsShort', 'Đánh giá')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {/* Hiển thị dịch vụ từ các consultant khác */}
                {relatedConsultantsData?.slice(0, 2).flatMap((item) =>
                  item.services.slice(0, 1).map((relatedService) => (
                    <Card
                      key={`${item.consultant.id}-${relatedService.id}`}
                      className="overflow-hidden flex flex-col transition-all hover:shadow-md group cursor-pointer"
                      onClick={() =>
                        navigate(
                          `${configs.routes.beautyConsultation}/${item.consultant.id}?service=${relatedService.id}`,
                        )
                      }
                    >
                      <div className="relative h-40 overflow-hidden">
                        <div className="relative aspect-video overflow-hidden">
                          {relatedService.systemService.type === ServiceTypeEnum.PREMIUM ? (
                            <VideoThumbnail
                              src={getVideoUrl()}
                              alt={relatedService.systemService.name}
                              className="w-full h-full"
                            />
                          ) : relatedService.images && relatedService.images.length > 0 ? (
                            (() => {
                              const image = relatedService.images[0]
                              const fileUrl = image.fileUrl || ''
                              const isVideo =
                                fileUrl.toLowerCase().endsWith('.mp4') ||
                                fileUrl.toLowerCase().endsWith('.mov') ||
                                fileUrl.toLowerCase().includes('youtube') ||
                                fileUrl.toLowerCase().includes('vimeo')

                              return isVideo ? (
                                <VideoThumbnail
                                  src={fileUrl}
                                  alt={relatedService.systemService.name}
                                  className="w-full h-full"
                                />
                              ) : (
                                <img
                                  src={fileUrl || DEFAULT_IMAGE}
                                  alt={relatedService.systemService.name}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = DEFAULT_IMAGE
                                  }}
                                />
                              )
                            })()
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={
                            relatedService.systemService.type === ServiceTypeEnum.PREMIUM ? 'destructive' : 'secondary'
                          }
                          className="absolute bottom-2 right-2"
                        >
                          {relatedService.systemService.type === ServiceTypeEnum.PREMIUM
                            ? t('beautyConsultation.premiumShort', 'Premium')
                            : t('beautyConsultation.standardShort', 'Standard')}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{relatedService.systemService.name}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-primary">{formatPrice(relatedService.price)}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {getServiceDuration(relatedService)} {t('beautyConsultation.min', 'phút')}
                          </div>
                        </div>

                        {/* Other consultant information */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={item.consultant.avatar || DEFAULT_IMAGE}
                              alt={getConsultantName(item.consultant)}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = DEFAULT_IMAGE
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium line-clamp-1">{getConsultantName(item.consultant)}</p>
                            <div className="flex items-center text-[10px] text-muted-foreground">
                              <span>
                                {item.consultant.yoe || 0} {t('beautyConsultation.yearsExp', 'Năm KN')}
                              </span>
                              <span className="mx-1">•</span>
                              <span>0 {t('beautyConsultation.reviewsShort', 'Đánh giá')}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )),
                )}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <ServiceCTA
            onBookNow={() => navigate(configs.routes.serviceCheckout.replace(':serviceId', service.id))}
            onExploreMore={handleBack}
          />
        </div>

        {/* Service Video Dialog */}
        <VideoDialog
          isOpen={videoOpen}
          onOpenChange={setVideoOpen}
          videoUrl={getVideoUrl()}
          title={selectedService.systemService.name}
        />

        {/* Consultant Video Dialog */}
        <VideoDialog
          isOpen={consultantVideoOpen}
          onOpenChange={setConsultantVideoOpen}
          videoUrl={getConsultantVideoUrl()}
          title={`${t('beautyConsultation.introVideo', 'Giới thiệu về')} ${getConsultantName(consultant)}`}
        />

        {/* Enlarged Portfolio Image Viewer */}
        {enlargedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeEnlargedImage}
          >
            <div className="relative max-w-3xl max-h-[80vh] w-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 z-10"
                onClick={closeEnlargedImage}
              >
                <XIcon className="h-5 w-5" />
              </Button>
              <img
                src={enlargedImage}
                alt={t('beautyConsultation.portfolioItem', 'Tác phẩm')}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
