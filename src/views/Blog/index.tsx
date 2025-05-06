import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Empty from '@/components/empty/Empty'
import APIPagination from '@/components/pagination/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDebounce } from '@/hooks/useDebounce'
import { getFilteredBlogs } from '@/network/apis/blog'
import { BlogEnum, BlogTypeEnum } from '@/types/enum'

const Blog = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [types, setTypes] = useState<BlogTypeEnum[]>([])
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Update types when selectedType changes
  useEffect(() => {
    if (selectedType === 'ALL') {
      setTypes([])
    } else if (selectedType === BlogTypeEnum.BLOG) {
      setTypes([BlogTypeEnum.BLOG])
    } else if (selectedType === BlogTypeEnum.CONDITION) {
      setTypes([BlogTypeEnum.CONDITION])
    }
  }, [selectedType])

  // Fetch blog data
  const { data: blogData, isLoading: isBlogLoading } = useQuery({
    queryKey: [
      getFilteredBlogs.queryKey,
      {
        page: currentPage,
        limit: 10,
        order: 'DESC',
        statuses: BlogEnum.PUBLISHED,
        types: types.length > 0 ? types.join(', ') : '',
        title: debouncedSearch,
      },
    ],
    queryFn: getFilteredBlogs.fn,
  })

  useEffect(() => {
    if (blogData?.data) {
      setTotalPages(blogData.data.total / blogData.data.items.length)
    }
  }, [blogData])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Refetch data with the new page
    queryClient.invalidateQueries({
      queryKey: [getFilteredBlogs.queryKey],
    })
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    setCurrentPage(1) // Reset to first page on type change
  }

  const formatDate = (dateString: string) => {
    return t('date.toLocaleDateTimeString', { val: new Date(dateString) })
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-primary">{t('blog.title')}</h1>

            <div className="relative w-full md:w-64">
              <Input
                placeholder={t('blog.search')}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="ALL" value={selectedType} onValueChange={handleTypeChange} className="w-full">
            <TabsList>
              <TabsTrigger value="ALL">{t('blog.all')}</TabsTrigger>
              <TabsTrigger value={BlogTypeEnum.BLOG}>{t('blog.type.blog')}</TabsTrigger>
              <TabsTrigger value={BlogTypeEnum.CONDITION}>{t('blog.type.condition')}</TabsTrigger>
            </TabsList>
          </Tabs>

          {isBlogLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="pb-2 p-0">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogData?.data?.items && blogData.data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {blogData.data.items
                  .filter((blog) => blog.status === BlogEnum.PUBLISHED)
                  .map((blog) => (
                    <Link to={`/blogs/${blog.tag}`} key={blog.id}>
                      <Card className="p-4 shadow-md rounded-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/50 h-full flex flex-col">
                        <CardHeader className=" p-0 pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-xl font-semibold text-primary line-clamp-2">
                              {blog.title}
                            </CardTitle>
                            <Badge
                              variant={blog.type === BlogTypeEnum.BLOG ? 'default' : 'secondary'}
                              className="shrink-0"
                            >
                              {blog.type === BlogTypeEnum.BLOG ? t('blog.type.blog') : t('blog.type.condition')}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(blog.createdAt)}
                          </div>
                        </CardHeader>
                        <CardContent className="p-0 pb-4 flex-grow">
                          <div
                            className="text-muted-foreground line-clamp-3 overflow-ellipsis quill-content text-sm"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                          />
                        </CardContent>
                        <CardFooter className="p-0">
                          <span className="ml-auto text-sm font-medium hover:opacity-60">{t('blog.readMore')}</span>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <APIPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
                </div>
              )}
            </>
          ) : (
            <div className="py-20 w-full flex justify-center items-center bg-muted/20 rounded-lg">
              <Empty
                title={searchQuery ? t('empty.blogSearch.title') : t('empty.blog.title')}
                description={
                  searchQuery
                    ? t('empty.blogSearch.description', { query: searchQuery })
                    : t('empty.blogList.description')
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
