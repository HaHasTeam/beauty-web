import { ArrowLeftIcon, CalendarIcon, FormInputIcon, ImageIcon, PlayCircleIcon, VideoIcon, XIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import DEFAULT_IMAGE from '@/assets/images/consultant-default.jpg'
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

import ActionButton from './components/ActionButton'
import ServiceCTA from './components/ServiceCTA'
import VideoDialog from './components/VideoDialog'
import { consultantInfo } from './data/consultantInfo'
import { consultationServices, formatCurrency, mockReviewData } from './data/mockData'
import { serviceDetailAdditions } from './data/serviceDetailData'
import { ConsultantInfo, ConsultationService, DetailData } from './data/types'
// Sample consultant certificates (in a real app, this would come from the API/database)
const SAMPLE_CERTIFICATES = [
  {
    id: 'cert1',
    name: 'Chứng chỉ trang điểm chuyên nghiệp',
    issuer: 'Học viện Làm đẹp Quốc tế',
    year: 2020,
    imageUrl: 'https://images.unsplash.com/photo-1584069793933-a152d4b3b168?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'cert2',
    name: 'Giải thưởng Nghệ sĩ trang điểm của năm',
    issuer: 'Hiệp hội Làm đẹp Việt Nam',
    year: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1607600588000-bb444b8e215b?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'cert3',
    name: 'Chứng nhận kỹ thuật trang điểm cô dâu',
    issuer: 'Học viện Trang điểm Sài Gòn',
    year: 2021,
    imageUrl: 'https://images.unsplash.com/photo-1610299738866-b8c301ff1898?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'cert4',
    name: 'Chứng nhận đào tạo màu sắc và kỹ thuật nâng cao',
    issuer: 'Đại học Mỹ thuật TP.HCM',
    year: 2019,
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=200&auto=format&fit=crop',
  },
]

// Sample portfolio images (in a real app, this would come from the API/database)
const SAMPLE_PORTFOLIO = [
  {
    id: 'portfolio1',
    title: 'Trang điểm cô dâu',
    imageUrl: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'portfolio2',
    title: 'Trang điểm sự kiện',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'portfolio3',
    title: 'Làm đẹp tự nhiên',
    imageUrl: 'https://images.unsplash.com/photo-1512257639384-2dab4d1b2e2a?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'portfolio4',
    title: 'Phong cách thời trang',
    imageUrl: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'portfolio5',
    title: 'Trang điểm dạ hội',
    imageUrl: 'https://images.unsplash.com/photo-1526045478516-99145907023c?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'portfolio6',
    title: 'Phong cách nghệ thuật',
    imageUrl: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=200&auto=format&fit=crop',
  },
]

export default function ServiceDetail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { serviceId } = useParams()
  const [selectedServiceId, setSelectedServiceId] = useQueryState('service')
  const [service, setService] = useState<ConsultationService | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailData, setDetailData] = useState<DetailData | null>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const [consultantVideoOpen, setConsultantVideoOpen] = useState(false)
  const [consultant, setConsultant] = useState<ConsultantInfo | null>(null)
  const [activeTab, setActiveTab] = useState<string>('services')
  const [showAllCertificates, setShowAllCertificates] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [activeConsultantImage, setActiveConsultantImage] = useState<string | null>(null)

  // Refs for scrolling into view
  const selectedCardRef = useRef<HTMLDivElement>(null)
  const serviceDetailRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset states when service changes
    setVideoOpen(false)
    setConsultantVideoOpen(false)

    // Initialize selected service from URL or current service ID
    if (!selectedServiceId) {
      setSelectedServiceId(serviceId || null)
    }

    setActiveTab('services')
    setShowAllCertificates(false)
    setEnlargedImage(null)
    setActiveConsultantImage(null)

    // Simulate API call to fetch service details
    setTimeout(() => {
      const foundService = consultationServices.find((s) => s.id === serviceId)
      if (foundService) {
        setService(foundService)
        setDetailData(serviceDetailAdditions[serviceId as keyof typeof serviceDetailAdditions])

        // Find the consultant who offers this service
        const foundConsultant = consultantInfo.find((c) => c.services.some((s) => s.id === serviceId))
        if (foundConsultant) {
          setConsultant(foundConsultant)
          setActiveConsultantImage(foundConsultant.imageUrl)
        }
      }
      setLoading(false)
    }, 300)
  }, [serviceId, setSelectedServiceId, selectedServiceId])

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

  // Handle video play for service
  const handleVideoPlay = () => {
    setVideoOpen(true)
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
    navigate(`${configs.routes.beautyConsultation}/${id}`)
    setSelectedServiceId(id)
  }

  // Toggle showing all certificates
  const toggleCertificates = () => {
    setShowAllCertificates((prev) => !prev)
  }

  // Get certificates to display
  const getCertificatesToDisplay = () => {
    return showAllCertificates ? SAMPLE_CERTIFICATES : SAMPLE_CERTIFICATES.slice(0, 2)
  }

  // Handle thumbnail click to replace main image
  const handleThumbnailClick = (imageUrl: string) => {
    setActiveConsultantImage(imageUrl)
  }

  // Close enlarged image
  const closeEnlargedImage = () => {
    setEnlargedImage(null)
  }

  // Get selected service details from consultant
  const getSelectedService = () => {
    if (!consultant || !selectedServiceId) return null

    const consultantService = consultant.services.find((s) => s.id === selectedServiceId)
    if (!consultantService) return null

    const fullService = consultationServices.find((s) => s.id === selectedServiceId)
    return fullService || null
  }

  // Mock video URL based on service type
  const getVideoUrl = () => {
    return service?.type === 'PREMIUM'
      ? 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      : 'https://www.youtube.com/embed/KYz2wyBy3kc'
  }

  // Get consultant intro video URL (mock)
  const getConsultantVideoUrl = () => {
    return 'https://www.youtube.com/embed/jfKfPfyJRdk'
  }

  // Get all services offered by consultant
  const getConsultantServices = () => {
    if (!consultant || !service) return []

    return consultant.services
      .map((s) => {
        const fullService = consultationServices.find((cs) => cs.id === s.id)
        return fullService
      })
      .filter(Boolean) as ConsultationService[]
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto lg:px-28 md:px-3 sm:px-4 px-2 py-8">
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
  const serviceImages = [selectedService.imageUrl, ...(detailData?.additionalImages || [])]

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
              {/* Main Consultant Image with Video Trigger - 16:9 aspect ratio */}
              <div
                className="relative group cursor-pointer overflow-hidden"
                onClick={
                  activeConsultantImage === consultant.imageUrl
                    ? handleConsultantVideoPlay
                    : () => setEnlargedImage(activeConsultantImage)
                }
              >
                <div className="aspect-video relative">
                  <img
                    src={activeConsultantImage || consultant.imageUrl}
                    alt={consultant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = DEFAULT_IMAGE
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-1">
                      {activeConsultantImage === consultant.imageUrl ? (
                        <>
                          <PlayCircleIcon className="h-12 w-12 text-white" />
                          <Badge className="bg-primary/90 text-xs">
                            {t('beautyConsultation.watchIntro', 'Xem giới thiệu')}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                            <ImageIcon className="h-8 w-8 text-white" />
                          </div>
                          <Badge className="bg-primary/90 text-xs">
                            {t('beautyConsultation.viewLarger', 'Xem lớn hơn')}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
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
                    <CarouselItem className="basis-1/4 pl-1">
                      <div
                        className={`aspect-video cursor-pointer relative overflow-hidden rounded-md`}
                        onClick={() => handleThumbnailClick(consultant.imageUrl)}
                      >
                        <img
                          src={consultant.imageUrl}
                          alt={consultant.name}
                          className={cn(
                            'w-full h-full object-cover transition-transform duration-300 hover:scale-110',
                            consultant.imageUrl === activeConsultantImage
                              ? 'border-2  border-primary p-1 rounded-lg opacity-50'
                              : '',
                          )}
                        />
                      </div>
                    </CarouselItem>
                    {SAMPLE_PORTFOLIO.map((item) => (
                      <CarouselItem key={item.id} className="basis-1/4 pl-1">
                        <div
                          className={`aspect-video cursor-pointer relative overflow-hidden rounded-md`}
                          onClick={() => handleThumbnailClick(item.imageUrl)}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className={cn(
                              'w-full h-full object-cover transition-transform duration-300 hover:scale-110',
                              item.imageUrl === activeConsultantImage
                                ? 'border-2 border-primary p-1 rounded-lg opacity-50'
                                : '',
                            )}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5" />
                  <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5" />
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
                      src={consultant.imageUrl}
                      alt={consultant.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = DEFAULT_IMAGE
                      }}
                    />
                  </div>

                  {/* Consultant Main Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-foreground line-clamp-1">{consultant.name}</h1>
                    <p className="text-sm text-muted-foreground line-clamp-1">{consultant.title}</p>

                    {/* Stats as Pills */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center">
                        <span className="inline-block mr-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {consultant.experience} {t('beautyConsultation.yearsExp', 'Năm KN')}
                      </div>
                      <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center">
                        <span className="inline-block mr-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {consultant.reviewCount} {t('beautyConsultation.reviewsShort', 'Đánh giá')}
                      </div>
                      <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center">
                        <span className="inline-block mr-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {consultant.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultant Content - Clean Tabbed Layout */}
              <div className="p-3">
                {/* Description Section - Card with Quote Style */}
                <div className="mb-3 bg-white rounded-md border-muted/70 overflow-hidden">
                  <div className="p-3 relative">
                    {/* Quote Icon */}
                    <div className="absolute top-1 left-1 text-primary/50 font-serif text-4xl -mt-2 -ml-1">"</div>
                    <div className="absolute bottom-1 right-1 text-primary/50 font-serif text-4xl -mb-3 -mr-1">"</div>

                    {/* Description with styled first letter */}
                    <p className="text-sm leading-relaxed text-muted-foreground relative z-10">
                      <span className="text-primary text-lg font-medium">{consultant.description.charAt(0)}</span>
                      {consultant.description.substring(1)}
                    </p>
                  </div>
                </div>

                {/* Certificates Section - Modern List */}
                <div className="bg-white rounded-md border border-muted/70 shadow-sm">
                  <div className="flex items-center justify-between p-3 border-b border-muted/50">
                    <h3 className="text-sm font-medium text-foreground flex items-center">
                      <span className="w-1 h-4 bg-primary rounded-sm mr-2"></span>
                      {t('beautyConsultation.certificates', 'Chứng chỉ & Giải thưởng')}
                    </h3>
                    {SAMPLE_CERTIFICATES.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs font-normal hover:bg-primary/5 hover:text-primary"
                        onClick={toggleCertificates}
                      >
                        {showAllCertificates
                          ? t('beautyConsultation.showLess', 'Thu gọn')
                          : t('beautyConsultation.showMore', `Xem tất cả (${SAMPLE_CERTIFICATES.length})`)}
                      </Button>
                    )}
                  </div>

                  <div className="divide-y divide-muted/20">
                    <TooltipProvider>
                      {getCertificatesToDisplay().map((cert) => (
                        <Tooltip key={cert.id}>
                          <TooltipTrigger asChild>
                            <div className="hover:bg-muted/5 transition-colors cursor-help p-2.5 flex items-center">
                              <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center mr-2.5 text-primary/70 text-xs font-medium">
                                {cert.year.toString().substring(2)}
                              </div>
                              <div className="flex-1">
                                <a
                                  href="#"
                                  className="text-sm font-medium text-foreground hover:text-primary transition-colors block leading-tight"
                                >
                                  {cert.name}
                                </a>
                                <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-2">
                              <div className="font-medium">{cert.name}</div>
                              <div className="text-xs">{cert.issuer}</div>
                              <div className="text-xs">
                                {t('beautyConsultation.yearObtained', 'Năm nhận')}: {cert.year}
                              </div>
                              <div className="h-24 w-full overflow-hidden rounded-md mt-2">
                                <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
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
                    {getConsultantServices().map((consultantService) => (
                      <Card
                        key={consultantService.id}
                        ref={consultantService.id === selectedServiceId ? selectedCardRef : null}
                        className={`overflow-hidden cursor-pointer ${consultantService.id === selectedServiceId ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleServiceClick(consultantService.id)}
                      >
                        <div className="flex h-24">
                          {/* Service image */}
                          <div className="relative w-24 h-full flex-shrink-0 overflow-hidden">
                            <img
                              src={consultantService.imageUrl}
                              alt={consultantService.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = DEFAULT_IMAGE
                              }}
                            />
                          </div>

                          {/* Service info */}
                          <div className="flex-1 p-3 flex flex-col justify-between">
                            <div>
                              <div className="mb-1">
                                <Badge
                                  variant={consultantService.type === 'PREMIUM' ? 'destructive' : 'secondary'}
                                  className="text-[10px]"
                                >
                                  {consultantService.type === 'PREMIUM'
                                    ? t('beautyConsultation.premiumShort', 'Premium')
                                    : t('beautyConsultation.standardShort', 'Standard')}
                                </Badge>
                              </div>
                              <h3 className="text-sm font-medium line-clamp-1">{consultantService.title}</h3>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="font-bold text-sm">{formatCurrency(consultantService.price)}</div>
                              {consultantService.type === 'PREMIUM' && (
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  {consultantService.duration} {t('beautyConsultation.min', 'phút')}
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
                            {serviceImages.map((image, index) => (
                              <CarouselItem key={index}>
                                <div className="relative aspect-video overflow-hidden">
                                  <img
                                    src={image}
                                    alt={`${selectedService.title} - ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = DEFAULT_IMAGE
                                    }}
                                  />
                                  {index === 0 && (
                                    <div
                                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
                                      onClick={handleVideoPlay}
                                    >
                                      <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <PlayCircleIcon className="h-12 w-12 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-2" />
                          <CarouselNext className="right-2" />
                        </Carousel>
                      </div>

                      {/* Service Info Card */}
                      <div className="p-5 border-t border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant={selectedService.type === 'PREMIUM' ? 'destructive' : 'secondary'}
                            className="uppercase"
                          >
                            {selectedService.type === 'PREMIUM' ? (
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
                          <Badge variant="outline">{selectedService.category}</Badge>
                          {selectedService.popular && (
                            <Badge variant="default" className="bg-primary/90">
                              {t('beautyConsultation.popular', 'Phổ biến')}
                            </Badge>
                          )}
                        </div>

                        <h1 className="text-xl font-bold mb-2">{selectedService.title}</h1>
                        <p className="text-sm text-muted-foreground mb-4">{selectedService.description}</p>

                        <div className="flex justify-between items-center mb-4">
                          <div className="text-xl font-bold text-primary">{formatCurrency(selectedService.price)}</div>
                          <div className="flex items-center text-muted-foreground">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {selectedService.duration} {t('beautyConsultation.minutes', 'phút')}
                          </div>
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
                  <Card className="border border-border shadow-sm overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t('beautyConsultation.aboutService', 'Về dịch vụ này')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {detailData?.longDescription ? (
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-line text-sm">{detailData.longDescription}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">{selectedService.description}</p>
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
                    {t('beautyConsultation.consultantReviews', 'Đánh giá về chuyên gia')} {consultant.name}
                  </h2>

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Review Overview Component */}
                    <div className="lg:w-1/3 bg-muted/5 rounded-lg p-4">
                      <ReviewOverall reviewGeneral={mockReviewData} />
                    </div>

                    {/* Review Filter and List */}
                    <div className="lg:w-2/3">
                      <ReviewFilter productId={consultant.id} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Services Section - Moved outside the tabs as separate section */}
          <div className="pt-6 border-t border-border">
            <h2 className="text-lg font-medium mb-4">{t('beautyConsultation.relatedServices', 'Dịch vụ tương tự')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {consultationServices
                .filter((s) => s.id !== selectedService.id && s.category === selectedService.category)
                .slice(0, 3)
                .map((relatedService) => {
                  // Find the consultant for this service
                  const serviceConsultant = consultantInfo.find((c) =>
                    c.services.some((s) => s.id === relatedService.id),
                  )

                  return (
                    <Card
                      key={relatedService.id}
                      className="overflow-hidden flex flex-col transition-all hover:shadow-md group cursor-pointer"
                      onClick={() => handleServiceClick(relatedService.id)}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={relatedService.imageUrl}
                          alt={relatedService.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = DEFAULT_IMAGE
                          }}
                        />
                        <Badge
                          variant={relatedService.type === 'PREMIUM' ? 'destructive' : 'secondary'}
                          className="absolute bottom-2 right-2"
                        >
                          {relatedService.type === 'PREMIUM'
                            ? t('beautyConsultation.premiumShort', 'Premium')
                            : t('beautyConsultation.standardShort', 'Standard')}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{relatedService.title}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-bold text-primary">{formatCurrency(relatedService.price)}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {relatedService.duration} {t('beautyConsultation.min', 'phút')}
                          </div>
                        </div>

                        {/* Consultant information */}
                        {serviceConsultant && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={serviceConsultant.imageUrl}
                                alt={serviceConsultant.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = DEFAULT_IMAGE
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium line-clamp-1">{serviceConsultant.name}</p>
                              <div className="flex items-center text-[10px] text-muted-foreground">
                                <span>
                                  {serviceConsultant.experience} {t('beautyConsultation.yearsExp', 'Năm KN')}
                                </span>
                                <span className="mx-1">•</span>
                                <span>
                                  {serviceConsultant.reviewCount} {t('beautyConsultation.reviewsShort', 'Đánh giá')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
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
          title={selectedService.title}
        />

        {/* Consultant Video Dialog */}
        <VideoDialog
          isOpen={consultantVideoOpen}
          onOpenChange={setConsultantVideoOpen}
          videoUrl={getConsultantVideoUrl()}
          title={`${t('beautyConsultation.introVideo', 'Giới thiệu về')} ${consultant.name}`}
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
