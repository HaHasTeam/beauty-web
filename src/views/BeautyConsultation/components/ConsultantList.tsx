import 'react-quill-new/dist/quill.bubble.css'
import './quill-styles.css'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Clock, Search, Star } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import configs from '@/config'
import { getConsultantsWithServicesApi } from '@/network/apis/user'
import { TGetConsultantsFilterRequestParams } from '@/network/apis/user/type'
import { IConsultantService } from '@/types/consultant-service'
import { ServiceTypeEnum } from '@/types/enum'
import { TUser } from '@/types/user'

interface ConsultantListProps {
  filter?: 'all' | 'standard' | 'premium'
  searchQuery?: string
}

// This matches the API response structure from getConsultantsWithServicesApi
interface ConsultantWithServices {
  consultant: TUser
  services: IConsultantService[]
}

export default function ConsultantList({ filter = 'all', searchQuery = '' }: ConsultantListProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // URL Query States
  const [page, setPage] = useQueryState('page', { defaultValue: '1' })
  const [search, setSearch] = useQueryState('search', { defaultValue: searchQuery })
  const [limit] = useQueryState('limit', { defaultValue: '6' })

  // Parse pagination parameters
  const currentPage = parseInt(page)
  const itemsPerPage = parseInt(limit)

  // Update search when searchQuery prop changes
  useEffect(() => {
    if (searchQuery !== search) {
      setSearch(searchQuery)
    }
  }, [searchQuery, search, setSearch])

  // Prepare API parameters based on filter
  const getConsultantParams = (): TGetConsultantsFilterRequestParams => {
    return {
      page: currentPage,
      limit: itemsPerPage,
      searchKey: search || undefined,
    }
  }

  // Fetch consultants with their services
  const {
    data: consultantsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [getConsultantsWithServicesApi.queryKey, getConsultantParams()],
    queryFn: getConsultantsWithServicesApi.fn,
  })

  // Filter consultants based on the selected service type (all, standard, premium)
  const filteredConsultants = consultantsData?.data?.items
    ? consultantsData.data.items.filter((item: ConsultantWithServices) => {
        if (filter === 'all') return true
        
        return item.services.some((service) =>
          filter === 'standard' 
            ? service.systemService.type === ServiceTypeEnum.STANDARD
            : service.systemService.type === ServiceTypeEnum.PREMIUM
        )
      })
    : []

  // Calculate pagination
  const totalPages = consultantsData?.data?.totalPages || 1

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers: number[] = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  // Format price for display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <Card key={index} className="overflow-hidden border shadow-sm">
            <CardHeader className="p-0">
              <Skeleton className="w-full h-52" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render error state
  if (isError) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-muted/40 flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium">
            {t('beautyConsultation.errorLoading', 'Đã xảy ra lỗi khi tải dữ liệu.')}
          </h3>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            {t('beautyConsultation.tryAgain', 'Thử lại')}
          </Button>
        </div>
      </div>
    )
  }

  // Render empty state
  if (filteredConsultants.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-muted/40 flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium">
            {t('beautyConsultation.noConsultants', 'Không tìm thấy chuyên gia phù hợp.')}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {t('beautyConsultation.tryDifferentSearch', 'Hãy thử tìm kiếm với từ khoá khác hoặc chọn loại dịch vụ khác.')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultants.map((item: ConsultantWithServices) => {
          const consultant = item.consultant
          const services = item.services
          
          // Get full name
          const fullName = consultant.firstName && consultant.lastName 
            ? `${consultant.firstName} ${consultant.lastName}`
            : consultant.username;
          
          // Filter services based on the selected tab
          const filteredServices = services.filter(
            (service) =>
              filter === 'all' || 
              (filter === 'standard' 
                ? service.systemService.type === ServiceTypeEnum.STANDARD 
                : service.systemService.type === ServiceTypeEnum.PREMIUM)
          )

          // Only show up to 2 services
          const displayedServices = filteredServices.slice(0, 2)
          const hasMoreServices = filteredServices.length > 2

          return (
            <Card
              key={consultant.id}
              className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Consultant Header */}
              <CardHeader className="p-0">
                <div className="relative h-52 overflow-hidden bg-muted/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                  {consultant.avatar ? (
                    <img src={consultant.avatar} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/30 to-secondary/30 flex items-center justify-center text-white">
                      <span className="text-4xl font-bold opacity-50">
                        {consultant.firstName 
                          ? consultant.firstName.charAt(0).toUpperCase() 
                          : consultant.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 p-4 z-20">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white">{fullName}</h3>
                      <div className="flex items-center text-white/90 text-sm bg-black/30 px-2 py-0.5 rounded-full">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>4.8</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mt-1.5">
                      {consultant.yoe ?? 1} {t('beautyConsultation.yearsExperience', 'năm kinh nghiệm')}
                      {consultant.majorTitle && ` • ${consultant.majorTitle}`}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Consultant Description */}
              <CardContent className="py-3 px-4 flex-grow">
                {consultant.description ? (
                  <div className="mb-2 quill-content-small">
                    {consultant.description.includes('<') ? (
                      <div className="line-clamp-4">
                        <ReactQuill 
                          value={consultant.description} 
                          readOnly={true} 
                          theme="bubble" 
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {consultant.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('beautyConsultation.noDescription', 'Không có mô tả.')}
                  </p>
                )}

                {/* Consultant Services - Compact design with limit */}
                <div className="mt-2 space-y-1.5">
                  {displayedServices.length > 0 ? (
                    displayedServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-1.5 rounded hover:bg-muted/20 border-b border-muted/30 last:border-0"
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <Badge
                              variant={service.systemService.type === ServiceTypeEnum.PREMIUM ? 'destructive' : 'secondary'}
                              className="text-[10px] h-5 px-1.5 whitespace-nowrap"
                            >
                              {service.systemService.type === ServiceTypeEnum.PREMIUM
                                ? t('beautyConsultation.premium', 'Cao cấp')
                                : t('beautyConsultation.standard', 'Tiêu chuẩn')}
                            </Badge>
                            <span className="text-sm font-medium text-primary ml-1">{formatPrice(service.price)}</span>
                            {service.systemService.type === ServiceTypeEnum.PREMIUM && (
                              <span className="text-muted-foreground flex items-center text-xs whitespace-nowrap ml-1">
                                <Clock className="h-3 w-3 mr-0.5" />
                                60 {t('beautyConsultation.min', 'phút')}
                              </span>
                            )}
                          </div>
                          <span className="text-base font-medium">{service.systemService.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-3 rounded-full text-sm hover:bg-primary hover:text-primary-foreground"
                          onClick={() => navigate(`${configs.routes.beautyConsultation}/${consultant.id}?service=${service.id}`)}
                        >
                          {t('beautyConsultation.book', 'Đặt')}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-muted-foreground text-sm">
                      {t('beautyConsultation.noServices', 'Không có dịch vụ hiện tại.')}
                    </div>
                  )}

                  {/* "View more" button if there are more than 2 services */}
                  {hasMoreServices && (
                    <div className="flex justify-center mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-sm w-full flex items-center justify-center"
                        onClick={() => navigate(`${configs.routes.beautyConsultation}/${consultant.id}`)}
                      >
                        {t('beautyConsultation.viewMore', 'Xem thêm')}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {getPageNumbers().map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNum);
                  }}
                  isActive={currentPage === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages 
                    ? 'pointer-events-none opacity-50' 
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
