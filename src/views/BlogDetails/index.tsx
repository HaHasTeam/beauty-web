import 'react-quill-new/dist/quill.snow.css'
import './index.css'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'
import { useParams } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { getBlogByTagApi } from '@/network/apis/blog'
import { BlogEnum } from '@/types/enum'

const BlogDetail = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>() // Get blog ID from URL params

  // Fetch blog data
  const { data: blogData, isLoading: isBlogLoading } = useQuery({
    queryKey: [getBlogByTagApi.queryKey, id as string],
    queryFn: getBlogByTagApi.fn,
    enabled: !!id, // Only fetch if blogId exists
  })

  if (isBlogLoading) {
    return <LoadingLayer />
  }

  if (!isBlogLoading && (!blogData || !blogData?.data || (blogData && blogData.data.status !== BlogEnum.PUBLISHED))) {
    return (
      <div className="h-[600px] w-full flex justify-center items-center">
        <Empty title={t('empty.blog.title')} description={t('empty.blog.description')} />
      </div>
    )
  }

  return (
    !isBlogLoading &&
    blogData &&
    blogData.data &&
    blogData.data.status === BlogEnum.PUBLISHED && (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto sm:px-4 px-2 py-8">
          <div className="w-full lg:px-28 md:px-3 sm:px-4 px-0 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">{blogData.data.title}</h2>
              {/* <BlogState state={blogData.data.status} /> */}
            </div>
            <div className="text-sm text-muted-foreground ">
              <p>
                {t('blogDetails.createdAt')}:{' '}
                {t('date.toLocaleDateTimeString', { val: new Date(blogData.data.createdAt) })}
              </p>
              <p>
                {t('blogDetails.updatedAt')}:{' '}
                {t('date.toLocaleDateTimeString', { val: new Date(blogData.data.updatedAt) })}
              </p>
            </div>

            <ReactQuill value={blogData.data.content} readOnly={true} theme={'bubble'} />
          </div>
        </div>
      </div>
    )
  )
}

export default BlogDetail
