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
    <div>
      <h3>{t('blog.title')}</h3>
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
                <CardHeader>
                  <CardTitle className="text-xl">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    <span>
                      {t('blog.createdAt')}: {t('date.toLocaleDateTimeString', { val: new Date(blog.createdAt) })}
                    </span>
                    <span className="ml-2">| Status: {blog.status}</span>
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
  )
}

export default Blog
