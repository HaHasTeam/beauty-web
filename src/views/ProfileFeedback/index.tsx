import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Empty from '@/components/empty/Empty'
import { getMyFeedbacksApi } from '@/network/apis/feedback'
import { IResponseFeedback } from '@/types/feedback'

function ProfileFeedback() {
  const { t } = useTranslation()
  const [myFeedbacks, setMyFeedbacks] = useState<IResponseFeedback[]>([])

  const { data: useMyFeedbacksData, isFetching: isGettingFeedback } = useQuery({
    queryKey: [getMyFeedbacksApi.queryKey],
    queryFn: getMyFeedbacksApi.fn,
  })

  useEffect(() => {
    if (useMyFeedbacksData?.data) {
      setMyFeedbacks(useMyFeedbacksData?.data)
    }
  }, [useMyFeedbacksData])
  return (
    <div>
      <main className="flex-1 p-6">
        <div>
          <h3 className="text-2xl font-semibold text-primary">{t('feedback.profileFeedback')}</h3>
          <p className="text-sm text-gray-500 text-primary">{t('feedback.profileFeedbackDescription')}</p>
        </div>
        <div className="space-y-4">
          {/* Feedback List */}
          {!isGettingFeedback && myFeedbacks && myFeedbacks?.length > 0 && (
            <div className="py-2 space-y-4 w-full">
              <div className="space-y-3 w-full">
                {myFeedbacks?.map((address) => <div key={address?.id} className="w-full"></div>)}
              </div>
            </div>
          )}
          {!isGettingFeedback && (!myFeedbacks || myFeedbacks?.length === 0) && (
            <Empty title={t('empty.myFeedbackList.title')} description={t('empty.myFeedbackList.description')} />
          )}
        </div>
      </main>
    </div>
  )
}

export default ProfileFeedback
