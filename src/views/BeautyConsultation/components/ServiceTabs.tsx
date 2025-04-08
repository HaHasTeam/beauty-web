import { useTranslation } from 'react-i18next'

import ReviewFilter from '@/components/filter/ReviewFilter'
import ReviewOverall from '@/components/reviews/ReviewOverall'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IFeedbackGeneral } from '@/types/feedback'

interface ServiceTabsProps {
  longDescription?: string;
  description: string;
  productId: string;
  reviewData: IFeedbackGeneral;
}

export default function ServiceTabs({
  longDescription,
  description,
  productId,
  reviewData
}: ServiceTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <Tabs defaultValue="description" className="w-full">
        <div className="border-b">
          <TabsList className="w-full justify-start h-10 bg-transparent mb-0 p-0">
            <TabsTrigger 
              value="description" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 h-10 font-medium"
            >
              {t('beautyConsultation.description', 'Mô tả')}
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 h-10 font-medium"
            >
              {t('beautyConsultation.reviews', 'Đánh giá')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-4 border border-border rounded-lg bg-white shadow-sm overflow-hidden">
          <TabsContent value="description" className="mt-0 p-5">
            <h3 className="text-lg font-medium mb-3">{t('beautyConsultation.aboutService', 'Về dịch vụ này')}</h3>
            
            {longDescription ? (
              <div className="space-y-5">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line text-sm">{longDescription}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-0 p-4">   
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Review Overview Component */}
              <div className="lg:w-1/3 bg-muted/5 rounded-lg p-2">
                <ReviewOverall reviewGeneral={reviewData} />
              </div>
              
              {/* Review Filter and List */}
              <div className="lg:w-2/3 rounded-lg">
                <ReviewFilter productId={productId} />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
} 