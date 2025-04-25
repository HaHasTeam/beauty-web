import { useQuery } from '@tanstack/react-query' // Import useQuery
// Import new icons
import { FormInputIcon, VideoIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom' // Import useNavigate

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar' // Import Avatar components
import configs from '@/config'
// Import API and types
import { getConsultantsWithServicesApi } from '@/network/apis/user' // Correct API import path
// Import IConsultantService if needed for the response type
import { IConsultantService } from '@/types/consultant-service'
import { TServerResponseWithPaging } from '@/types/request' // For response structure
import { TUser } from '@/types/user' // For consultant data

import { Button } from '../ui/button' // Assuming button path
import { Skeleton } from '../ui/skeleton' // For loading state

// No props needed for this static banner currently
// type Props = {}

// Helper function to check for common image extensions
const isImageUrl = (url?: string): boolean => {
  if (!url) return false
  try {
    // Extract pathname, convert to lowercase, ignore query params/hash
    const pathname = new URL(url).pathname.toLowerCase()
    return (
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.avif')
      // Add other image extensions if needed
    )
  } catch (e) {
    // Invalid URL
    console.error('Invalid URL for image check:', url, e)
    return false
  }
}

const ConsultantServiceBanner = (/*props: Props*/) => {
  // Removed unused props
  const { t } = useTranslation()
  const navigate = useNavigate() // Initialize navigate

  // Define params for the API call
  const queryParams = { page: 1, limit: 3 }

  // Fetch first few consultants for preview and total count
  const { data: consultantPreviewData, isLoading } = useQuery<
    // Correct API Response Type
    TServerResponseWithPaging<{ consultant: TUser; services: IConsultantService[] }[]>,
    Error,
    // Updated select type
    { items: { consultant: TUser; serviceImage?: string }[]; totalItems: number }
  >({
    queryKey: [getConsultantsWithServicesApi.queryKey, queryParams], // Use defined params in key
    queryFn: () => getConsultantsWithServicesApi.raw(queryParams), // Use .raw to pass only params
    select: (data) => ({
      // Map to get consultant and first service image URL
      items:
        data?.data?.items?.map((item) => ({
          consultant: item.consultant,
          // Get URL of the first image of the first service, if available
          serviceImage: item.services?.[0]?.images?.[0]?.fileUrl,
        })) ?? [],
      // Use .total for count
      totalItems: data?.data?.total ?? 0,
    }),
    staleTime: 5 * 60 * 1000,
  })

  const handleNavigate = () => {
    // Use path from configs
    navigate(configs.routes.beautyConsultation)
  }

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[420px] rounded-xl overflow-hidden group flex items-end bg-slate-100">
      {/* Background Image (Optional - could be removed if service images are prominent) */}
      <img
        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080" // Example relevant image
        alt={t('consultantServiceBanner.alt', 'Makeup brushes and products')}
        className="absolute inset-0 w-full h-full object-cover opacity-30 md:opacity-100 transition-opacity duration-500"
      />

      {/* Gradient Overlay - Ensure readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent z-10"></div>

      {/* Content Wrapper (Flex) */}
      <div className="relative z-20 w-full p-6 md:p-10 lg:p-12 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        {/* Left Side: Text Content & CTA */}
        <div className="w-full md:w-1/2 lg:w-3/5 space-y-4 md:space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight shadow-sm">
            {t('consultantServiceBanner.title', 'Tư Vấn Chuyên Sâu Cùng Chuyên Gia')}
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-md">
            {t(
              'consultantServiceBanner.description',
              'Nâng cấp quy trình làm đẹp của bạn với sự hướng dẫn từ các chuyên gia trang điểm hàng đầu.',
            )}
          </p>

          {/* Service Type Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FormInputIcon className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70 font-medium">
                {t('consultantServiceBanner.standard', 'Tư vấn cơ bản')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <VideoIcon className="h-4 w-4 text-white/70" />
              <span className="text-xs text-white/70 font-medium">
                {t('consultantServiceBanner.premium', 'Tư vấn chuyên sâu 1:1')}
              </span>
            </div>
          </div>

          {/* Consultant Preview & CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap"
              onClick={handleNavigate}
            >
              {t('consultantServiceBanner.cta', 'Tư vấn ngay')}
            </Button>

            {/* Avatar Preview & Count */}
            <div className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-9 w-9 rounded-full -ml-4" />
                  <Skeleton className="h-9 w-9 rounded-full -ml-4" />
                  <Skeleton className="h-4 w-24 rounded" />
                </>
              ) : consultantPreviewData && consultantPreviewData.items.length > 0 ? (
                <>
                  <div className="flex -space-x-3 overflow-hidden">
                    {consultantPreviewData.items.map(({ consultant }) => (
                      <Avatar
                        key={consultant.id}
                        className="h-9 w-9 border-2 border-background/80 group-hover:border-primary/50 transition-colors"
                      >
                        <AvatarImage src={consultant.avatar || ''} alt={consultant.username || 'Consultant'} />
                        <AvatarFallback className="text-xs">
                          {consultant.username?.charAt(0)?.toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white/80">
                    {t('consultantServiceBanner.available', '{{count}} chuyên gia sẵn sàng', {
                      count: consultantPreviewData.totalItems,
                    })}
                  </span>
                </>
              ) : (
                <span className="text-xs font-medium text-white/80">
                  {t('consultantServiceBanner.noConsultants', 'Hiện chưa có chuyên gia')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Service Images (Hidden on smaller screens) */}
        <div className="hidden md:flex w-1/2 lg:w-2/5 justify-end">
          <div className="relative flex justify-center items-center w-[280px] h-[280px] lg:w-[320px] lg:h-[320px]">
            {/* Placeholder for image arrangement - simple stack for now */}
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : (
              consultantPreviewData?.items.map((item, index) =>
                // Check if serviceImage exists AND is likely an image URL
                item.serviceImage && isImageUrl(item.serviceImage) ? (
                  <img
                    key={item.consultant.id + '-img'} // Added -img for potential key conflict
                    src={item.serviceImage}
                    alt={`Service provided by ${item.consultant.username}`}
                    className={`absolute w-3/5 h-3/5 rounded-lg object-cover shadow-lg border-2 border-white/50 transition-all duration-300 ease-in-out ${
                      index === 0
                        ? 'z-30 transform scale-100 rotate-[-6deg] translate-x-[-15%] translate-y-[-5%]'
                        : index === 1
                          ? 'z-20 transform scale-90 rotate-[4deg] translate-x-[20%] translate-y-[10%]'
                          : 'z-10 transform scale-80 rotate-[-10deg] translate-x-[5%] translate-y-[25%]'
                    } group-hover:rotate-0 group-hover:scale-100`}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }} // Hide on error
                  />
                ) : null, // Don't render if no image or not an image URL
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConsultantServiceBanner
