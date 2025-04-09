import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllBlogApi } from '@/network/apis/blog'
import { BlogEnum } from '@/types/enum'

const Blog = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Fetch blog data
  const { data: blogData, isLoading: isBlogLoading } = useQuery({
    queryKey: [getAllBlogApi.queryKey],
    queryFn: getAllBlogApi.fn,
  })

  if (isBlogLoading) {
    return <LoadingLayer />
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto sm:px-4 px-2 py-8">
        <div className="w-full lg:px-28 md:px-3 sm:px-4 px-0 space-y-3">
          <h3 className="text-2xl font-bold text-primary">{t('blog.title')}</h3>
          <div className="flex flex-wrap">
            {!isBlogLoading && blogData && blogData.data && blogData.data.length > 0 ? (
              blogData.data
                ?.filter((blog) => blog.status === BlogEnum.PUBLISHED)
                .map((blog) => (
                  <Card
                    key={blog.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                  >
                    <CardHeader className="pb-0 p-3">
                      <CardTitle className="text-lg text-primary">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="text-sm text-gray-500">
                        <span>
                          {t('blog.createdAt')}: {t('date.toLocaleDateTimeString', { val: new Date(blog.createdAt) })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="h-[600px] w-full flex justify-center items-center">
                <Empty title={t('empty.blog.title')} description={t('empty.blog.description')} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
