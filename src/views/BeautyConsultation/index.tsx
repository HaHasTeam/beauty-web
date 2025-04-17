import { FormInputIcon, Search, VideoIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ConsultantList from '@/views/BeautyConsultation/components/ConsultantList'

export default function BeautyConsultation() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'all' | 'standard' | 'premium'>('all')
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Update search params in URL
    const newParams = new URLSearchParams(searchParams)
    if (searchInput) {
      newParams.set('search', searchInput)
    } else {
      newParams.delete('search')
    }
    
    // Reset to page 1 when searching
    newParams.set('page', '1')
    
    setSearchParams(newParams)
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto sm:px-4 px-2 py-8">
        <div className="w-full lg:px-28 md:px-3 sm:px-4 px-0 space-y-16">
          {/* Hero Section - Simplified */}
          <section>
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-600/70 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087"
                alt="Makeup Consultation"
                className="w-full h-[260px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-10">
                <div className="max-w-xl">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {t('beautyConsultation.heroTitle', 'Tư vấn Trang điểm Chuyên nghiệp')}
                  </h1>
                  <p className="text-sm md:text-base text-white/90 mb-5 max-w-xl line-clamp-2 md:line-clamp-none">
                    {t(
                      'beautyConsultation.heroDescription',
                      'Kết nối với các chuyên gia trang điểm hàng đầu cho vẻ đẹp riêng của bạn.',
                    )}
                  </p>
                  <Button className="bg-white text-primary hover:bg-white/90 hover:text-primary/90">
                    {t('beautyConsultation.bookNow', 'Đặt lịch')}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-16 animate-fadeIn">
            {/* Service Types - Modern Card Layout */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-center">
                {t('beautyConsultation.introTitle', 'Lựa chọn dịch vụ phù hợp')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Standard Service Card */}
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-secondary/10 p-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                      <FormInputIcon className="h-5 w-5 text-secondary-foreground/80" />
                    </div>
                    <h3 className="font-medium">
                      <Badge variant="secondary" className="whitespace-nowrap mr-2">
                        TIÊU CHUẨN
                      </Badge>
                      {t('beautyConsultation.standardTitle', 'Tư vấn Cơ bản')}
                    </h3>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {t(
                        'beautyConsultation.standardDescription',
                        'Tư vấn trang điểm cơ bản trực tuyến thông qua form đặt lịch, phù hợp theo đặc điểm khuôn mặt và màu da với mức giá hợp lý.',
                      )}
                    </p>

                    <Button variant="secondary" size="sm" className="w-full" onClick={() => setActiveTab('standard')}>
                      {t('beautyConsultation.learnMore', 'Tìm hiểu thêm')}
                    </Button>
                  </div>
                </div>

                {/* Premium Service Card */}
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-destructive/10 p-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center mr-3">
                      <VideoIcon className="h-5 w-5 text-destructive-foreground" />
                    </div>
                    <h3 className="font-medium">
                      <Badge variant="destructive" className="whitespace-nowrap mr-2">
                        CAO CẤP
                      </Badge>
                      {t('beautyConsultation.premiumTitle', 'Tư vấn Chuyên sâu')}
                    </h3>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {t(
                        'beautyConsultation.premiumDescription',
                        'Tư vấn trang điểm cao cấp với video call 1:1 cùng chuyên gia, thời gian cố định 60 phút, bao gồm bộ sản phẩm mẫu cao cấp.',
                      )}
                    </p>

                    <Button variant="destructive" size="sm" className="w-full" onClick={() => setActiveTab('premium')}>
                      {t('beautyConsultation.learnMore', 'Tìm hiểu thêm')}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Expert Makeup Consultants Section - With Tabs */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{t('beautyConsultation.ourExperts', 'Đội ngũ Chuyên gia')}</h2>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'all' | 'standard' | 'premium')}
                className="w-full"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
                  <TabsList className="grid grid-cols-3 w-full max-w-xs">
                    <TabsTrigger value="all" className="rounded-full">
                      {t('beautyConsultation.all', 'Tất cả')}
                    </TabsTrigger>
                    <TabsTrigger value="standard" className="rounded-full">
                      <FormInputIcon className="h-3.5 w-3.5 mr-1.5" />
                      {t('beautyConsultation.standard', 'Tiêu chuẩn')}
                    </TabsTrigger>
                    <TabsTrigger value="premium" className="rounded-full">
                      <VideoIcon className="h-3.5 w-3.5 mr-1.5" />
                      {t('beautyConsultation.premium', 'Cao cấp')}
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Search Bar */}
                  <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xs">
                    <Input
                      type="text"
                      placeholder={t('beautyConsultation.searchConsultants', 'Tìm kiếm chuyên gia...')}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="flex-grow rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 border-r-0"
                    />
                    <Button type="submit" className="rounded-l-none px-3">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                <TabsContent value="all" className="mt-0">
                  <ConsultantList filter="all" searchQuery={searchParams.get('search') || ''} />
                </TabsContent>
                <TabsContent value="standard" className="mt-0">
                  <ConsultantList filter="standard" searchQuery={searchParams.get('search') || ''} />
                </TabsContent>
                <TabsContent value="premium" className="mt-0">
                  <ConsultantList filter="premium" searchQuery={searchParams.get('search') || ''} />
                </TabsContent>
              </Tabs>
            </section>

            {/* CTA Section - Minimalist */}
            <section>
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6 text-center border border-border shadow-sm">
                <h2 className="text-xl font-bold mb-3">
                  {t('beautyConsultation.ctaTitle', 'Nâng tầm kỹ năng trang điểm của bạn')}
                </h2>
                <p className="text-muted-foreground mb-5 max-w-lg mx-auto">
                  {t(
                    'beautyConsultation.ctaDescription',
                    'Đặt lịch tư vấn với các chuyên gia trang điểm ngay hôm nay.',
                  )}
                </p>
                <Button className="px-6 whitespace-nowrap">
                  {t('beautyConsultation.bookConsultation', 'Đặt lịch')}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
