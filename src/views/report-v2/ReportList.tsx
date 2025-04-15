import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Flag, ListPlusIcon, Search, X } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import Empty from '@/components/empty/Empty'
import ImageWithFallback from '@/components/ImageFallback'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getFilteredReports } from '@/network/apis/report'
import { TGetFilteredReportRequestParams } from '@/network/apis/report/type'
import { IReport, ReportStatusEnum, ReportTypeEnum } from '@/types/report'

import Modal from './report-table-ui/Modal'

// Separate SearchReports component
const SearchReports = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {
    onSearch(searchValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex w-full items-center gap-3">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('report.searchPlaceholder', 'Search reports...')}
          className="w-full rounded-md border-border/50 pl-9 py-2 h-10 text-base focus-visible:ring-1 focus-visible:ring-primary/30 bg-white"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-primary text-white h-10 px-5 rounded-md text-sm font-normal hover:bg-primary/90 transition-colors whitespace-nowrap"
      >
        {t('common.search', 'Tìm kiếm')}
      </button>
    </div>
  )
}

// Image preview dialog component
const ImagePreviewDialog = ({
  isOpen,
  onClose,
  imageUrl,
}: {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
}) => {
  const { t } = useTranslation()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/60" />
      <DialogContent className="sm:max-w-2xl border-none bg-transparent shadow-none p-0 max-h-[90vh] overflow-auto">
        <div className="relative w-full rounded overflow-hidden bg-black/80 flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors z-10"
            aria-label={t('common.close', 'Close')}
          >
            <X className="h-5 w-5" />
          </button>
          <ImageWithFallback
            src={imageUrl}
            fallback={fallBackImage}
            alt={t('report.imagePreview', 'Image Preview')}
            className="max-h-[85vh] max-w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ReportItem component with improved UI using ShadCN components
const ReportItem = ({ report }: { report: IReport }) => {
  const { t } = useTranslation()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Handle card click
  const getStatusStyle = (status: ReportStatusEnum) => {
    switch (status) {
      case ReportStatusEnum.PENDING:
        return 'bg-amber-200 text-amber-900 border-amber-300'
      case ReportStatusEnum.IN_PROCESSING:
        return 'bg-blue-200 text-blue-900 border-blue-300'
      case ReportStatusEnum.DONE:
        return 'bg-emerald-200 text-emerald-900 border-emerald-300'
      case ReportStatusEnum.CANCELLED:
        return 'bg-rose-200 text-rose-900 border-rose-300'
      default:
        return 'bg-gray-200 text-gray-900 border-gray-300'
    }
  }

  const getTypeColor = (type: ReportTypeEnum) => {
    switch (type) {
      case ReportTypeEnum.ORDER:
        return 'bg-orange-100 border-orange-300 text-orange-800'
      case ReportTypeEnum.TRANSACTION:
        return 'bg-purple-100 border-purple-300 text-purple-800'
      case ReportTypeEnum.BOOKING:
        return 'bg-blue-100 border-blue-300 text-blue-800'
      case ReportTypeEnum.SYSTEM_FEATURE:
        return 'bg-teal-100 border-teal-300 text-teal-800'
      case ReportTypeEnum.OTHER:
        return 'bg-gray-100 border-gray-300 text-gray-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getStatusTranslation = (status: ReportStatusEnum) => {
    return t(`report.status.${status.toLowerCase()}`, status)
  }

  const getTypeTranslation = (type: ReportTypeEnum) => {
    return t(`report.type.${type.toLowerCase()}`, type)
  }

  // Get timeline status for the report
  const getTimelineStatus = (status: ReportStatusEnum) => {
    switch (status) {
      case ReportStatusEnum.PENDING:
        return 'current'
      case ReportStatusEnum.IN_PROCESSING:
        return 'current'
      case ReportStatusEnum.DONE:
        return 'done'
      case ReportStatusEnum.CANCELLED:
        return 'error'
      default:
        return 'default'
    }
  }

  // Open image preview
  const openImagePreview = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation() // Prevent card click
    setPreviewImage(imageUrl)
  }

  // Close image preview
  const closeImagePreview = () => {
    setPreviewImage(null)
  }

  // Render file gallery (images)
  const renderFileGallery = () => {
    if (!report.files || report.files.length === 0) return null

    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {report.files.map((file, index) => (
          <div key={file.id || index} className="relative aspect-square">
            <div onClick={(e) => openImagePreview(e, file.fileUrl)} className="w-full h-full cursor-pointer">
              <ImageWithFallback
                src={file.fileUrl}
                fallback={fallBackImage}
                alt={file.name || `${t('report.attachment', 'Attachment')} ${index + 1}`}
                className="w-full h-full object-cover rounded hover:opacity-90 transition-opacity"
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <>
      <Card className="overflow-hidden bg-white border border-border rounded-md cursor-pointer">
        <CardHeader className="border-b border-border/10 px-3 py-2 space-y-0 bg-white">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="cursor-default">
                    <Badge
                      variant="outline"
                      className="text-xs font-medium bg-primary/5 border-primary/20 rounded-md px-2 py-0.5 whitespace-nowrap"
                    >
                      #{report.id.substring(0, 8)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{report.id}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge
                variant="outline"
                className={`${getTypeColor(report.type)} border px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap`}
              >
                {getTypeTranslation(report.type)}
              </Badge>
            </div>
            <div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(report.status)} whitespace-nowrap`}
              >
                {getStatusTranslation(report.status)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 grid sm:grid-cols-5 gap-3">
          {/* Left column: Files and reason + related IDs */}
          <div className="sm:col-span-3">
            <div className="py-1">
              {/* Reason */}
              <div className="mb-3">
                <h4 className="text-xs uppercase tracking-wide text-primary mb-1.5 font-medium">
                  {t('report.reason', 'Reason')}
                </h4>
                <p className="text-base text-foreground/90">{report.reason}</p>
              </div>

              {/* Files */}
              {report.files && report.files.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs uppercase tracking-wide text-primary mb-1.5 font-medium">
                    {t('report.files', 'Files')}
                  </h4>
                  {renderFileGallery()}
                </div>
              )}

              {/* Related entities */}
              {(report.order || report.booking || report.transaction) && (
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-primary mb-1.5 font-medium">
                    {t('report.relatedEntities', 'Related items')}
                  </h4>
                  <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                    {report.order && (
                      <div className="flex items-center text-sm text-foreground bg-muted/20 px-2 py-0.5 rounded-md border border-border/50">
                        <span className="font-medium mr-1 text-xs">{t('report.relatedOrder', 'Order')}:</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 rounded-md ml-1 text-xs px-1.5 py-0"
                              >
                                #{report.order.id.substring(0, 8)}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{report.order.id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    {report.booking && (
                      <div className="flex items-center text-sm text-foreground bg-muted/20 px-2 py-0.5 rounded-md border border-border/50">
                        <span className="font-medium mr-1 text-xs">{t('report.relatedBooking', 'Booking')}:</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 rounded-md ml-1 text-xs px-1.5 py-0"
                              >
                                #{report.booking.id.substring(0, 8)}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{report.booking.id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    {report.transaction && (
                      <div className="flex items-center text-sm text-foreground bg-muted/20 px-2 py-0.5 rounded-md border border-border/50">
                        <span className="font-medium mr-1 text-xs">
                          {t('report.relatedTransaction', 'Transaction')}:
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 rounded-md ml-1 text-xs px-1.5 py-0"
                              >
                                #{report.transaction.id.substring(0, 8)}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{report.transaction.id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Timeline, response, status updates */}
          <div className="sm:col-span-2">
            <div className="py-1">
              {/* Reporter info */}
              <div className="mb-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center text-primary text-xs border border-primary/10">
                  {report.reporter?.firstName?.charAt(0) || '?'}
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-primary mb-0.5 font-medium">
                    {t('report.reportedBy', 'From')}
                  </h4>
                  <span className="text-sm text-foreground/90">
                    {report.reporter?.firstName || ''} {report.reporter?.lastName || ''}
                  </span>
                </div>
              </div>

              {/* Status timeline */}
              <div className="mb-3">
                <h4 className="text-xs uppercase tracking-wide text-primary mb-1.5 font-medium">
                  {t('report.statusTimeline', 'Status')}
                </h4>
                <div className="bg-muted/5 p-2 rounded-md border border-border/50">
                  <Timeline className="ml-1 min-h-0">
                    {/* Initial creation step */}
                    <TimelineItem status="done">
                      <TimelineHeading className="text-sm">{t('report.status.initial', 'Created')}</TimelineHeading>
                      <TimelineDot status="done" />
                      <TimelineLine done />
                      <TimelineContent className="text-xs pb-2">{formatDate(report.createdAt)}</TimelineContent>
                    </TimelineItem>

                    {/* Current status step */}
                    <TimelineItem status={report.status === ReportStatusEnum.DONE ? 'done' : 'default'}>
                      <TimelineHeading
                        className={`text-sm ${
                          report.status === ReportStatusEnum.DONE
                            ? 'text-emerald-700'
                            : report.status === ReportStatusEnum.CANCELLED
                              ? 'text-rose-700'
                              : report.status === ReportStatusEnum.IN_PROCESSING
                                ? 'text-blue-700'
                                : 'text-amber-700'
                        }`}
                      >
                        {getStatusTranslation(report.status)}
                      </TimelineHeading>
                      <TimelineDot status={getTimelineStatus(report.status)} />
                      <TimelineContent className="text-xs pb-0">{formatDate(report.updatedAt)}</TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </div>
              </div>

              {/* Response note if available */}
              {report.resultNote && (
                <div className="mb-3">
                  <h4 className="text-xs uppercase tracking-wide text-primary mb-1.5 font-medium">
                    {t('report.resultNote', 'Note')}
                  </h4>
                  <p className="text-sm bg-muted/5 p-2 rounded-md border border-border/50">{report.resultNote}</p>
                </div>
              )}

              {/* Assignee if available */}
              {report.assignee && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center text-primary text-xs border border-primary/10">
                    {report.assignee?.firstName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wide text-primary mb-0.5 font-medium">
                      {t('report.assignee', 'Handler')}
                    </h4>
                    <span className="text-sm text-foreground/90">
                      {report.assignee?.firstName || ''} {report.assignee?.lastName || ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image preview dialog */}
      {previewImage && (
        <ImagePreviewDialog isOpen={!!previewImage} onClose={closeImagePreview} imageUrl={previewImage} />
      )}
    </>
  )
}

export default function ReportList() {
  const { t } = useTranslation()
  const [reports, setReports] = useState<IReport[]>([])
  const [activeTypeTab, setActiveTypeTab] = useQueryState('type', parseAsString.withDefault('all'))
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false)

  // Pagination states
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_SIZE = 10

  // Types for tabs
  const typeTabOptions = useMemo(
    () => [
      { value: 'all', text: t('report.tabs.all', 'All Reports') },
      { value: 'order', text: t('report.tabs.order', 'Order Reports'), type: ReportTypeEnum.ORDER },
      {
        value: 'transaction',
        text: t('report.tabs.transaction', 'Transaction Reports'),
        type: ReportTypeEnum.TRANSACTION,
      },
      { value: 'booking', text: t('report.tabs.booking', 'Booking Reports'), type: ReportTypeEnum.BOOKING },
      { value: 'system', text: t('report.tabs.system', 'System Reports'), type: ReportTypeEnum.SYSTEM_FEATURE },
      { value: 'other', text: t('report.tabs.other', 'Other Reports'), type: ReportTypeEnum.OTHER },
    ],
    [t],
  )

  // Create params based on the active tab
  const filterParams = useMemo(() => {
    const params: TGetFilteredReportRequestParams = {
      page,
      pageSize: PAGE_SIZE,
    }

    // Filter by type
    if (activeTypeTab === 'order') params.type = ReportTypeEnum.ORDER
    else if (activeTypeTab === 'transaction') params.type = ReportTypeEnum.TRANSACTION
    else if (activeTypeTab === 'booking') params.type = ReportTypeEnum.BOOKING
    else if (activeTypeTab === 'system') params.type = ReportTypeEnum.SYSTEM_FEATURE
    else if (activeTypeTab === 'other') params.type = ReportTypeEnum.OTHER

    return params
  }, [activeTypeTab, page])

  // Follow the project pattern: pass parameters in queryKey instead of to the function
  const { data: reportData, isLoading } = useQuery({
    queryKey: [getFilteredReports.queryKey, filterParams],
    queryFn: getFilteredReports.fn,
  })

  useEffect(() => {
    if (reportData?.data) {
      // Filter by search query locally if needed
      const filteredReports = searchQuery
        ? reportData.data.items.filter(
            (report) =>
              report.id.toString().includes(searchQuery) ||
              report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (report.order?.id && report.order.id.toString().includes(searchQuery)) ||
              (report.booking?.id && report.booking.id.toString().includes(searchQuery)) ||
              (report.transaction?.id && report.transaction.id.toString().includes(searchQuery)),
          )
        : reportData.data.items

      setReports(filteredReports)

      // Calculate total pages based on totalPages from the API
      if (reportData.data.totalPages) {
        setTotalPages(reportData.data.totalPages)
      }
    } else {
      setReports([])
    }
  }, [reportData, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Reset to page 1 when searching
    setPage(1)
  }

  // Handle pagination
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const renderReports = () => {
    if (reports.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[250px] text-center bg-white rounded-md border border-border/50 p-6">
          <Empty
            title={t('empty.report.title', 'No Reports Found')}
            description={
              activeTypeTab === 'all'
                ? t('empty.report.description', 'There are no reports in the system')
                : t('empty.report.statusDescription', 'There are no reports matching your criteria')
            }
          />
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {reports.map((report) => (
          <ReportItem key={report.id} report={report} />
        ))}
      </div>
    )
  }

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center gap-2 bg-white rounded-md py-1 px-2 border border-border/50">
          <button
            onClick={goToPreviousPage}
            disabled={page === 1}
            className={`p-1 rounded-md flex items-center justify-center ${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-primary/5'}`}
            aria-label={t('pagination.previous', 'Previous page')}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="px-2 text-sm font-normal">
            {t('pagination.pageInfo', '{{current}} / {{total}}', { current: page, total: totalPages })}
          </div>

          <button
            onClick={goToNextPage}
            disabled={page === totalPages}
            className={`p-1 rounded-md flex items-center justify-center ${page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-primary/5'}`}
            aria-label={t('pagination.next', 'Next page')}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && <LoadingContentLayer />}

      <div className="w-full flex justify-center">
        <div className="w-full p-4 max-w-sm sm:max-w-[838px] md:max-w-[1060px] lg:max-w-[1820px] xl:max-w-[2180px] 2xl:max-w-[2830px]">
          {/* Dropdown for mobile */}
          <div className="block md:hidden w-full mb-4">
            <Select value={activeTypeTab} onValueChange={(value) => setActiveTypeTab(value)}>
              <SelectTrigger className="w-full border border-primary/30 text-primary hover:bg-primary/5 h-10 text-sm">
                <SelectValue>
                  {typeTabOptions.find((trigger) => trigger.value === activeTypeTab)?.text ||
                    t('report.tabs.all', 'All Reports')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {typeTabOptions.map((trigger) => (
                  <SelectItem key={trigger.value} value={trigger.value}>
                    {trigger.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs for desktop */}
          <Tabs
            value={activeTypeTab}
            onValueChange={(value) => setActiveTypeTab(value)}
            className="w-full hidden md:block"
          >
            <TabsList className="sticky top-0 z-10 h-14 w-full justify-start overflow-x-auto p-0 bg-white border-b border-border/20">
              {typeTabOptions?.map((trigger) => (
                <TabsTrigger
                  key={trigger.value}
                  className="overflow-y-hidden h-12 w-full my-auto rounded-none text-sm data-[state=active]:text-primary hover:text-secondary-foreground/80 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  value={trigger.value}
                >
                  {trigger.text}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center gap-2">
              <SearchReports onSearch={handleSearch} />

              <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
                <DialogTrigger asChild>
                  <Button className="whitespace-nowrap">
                    <ListPlusIcon className="mr-2 h-4 w-4" />
                    {t('report.create', 'Create Report')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[70%] overflow-auto">
                  <DialogTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    {t('report.new', 'New Report')}
                  </DialogTitle>
                  <DialogDescription>
                    <div className="text-gray-600 text-sm">
                      {t('report.createDescription', 'Please fill in the form below to report a new issue.')}
                    </div>
                  </DialogDescription>
                  <Modal
                    Report={[]}
                    setOpen={(open: boolean) => {
                      setIsCreateReportOpen(open)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {renderReports()}
            {renderPagination()}
          </div>
        </div>
      </div>
    </>
  )
}
