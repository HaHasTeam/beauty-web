import { IBlogDetails, IServerCreateBlog } from '@/types/blog'
import { TServerResponse, TServerResponseWithPagination } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TGetFilteredBlogRequestParams, UpdateBlogParams } from './type'

export const getAllBlogApi = toQueryFetcher<void, TServerResponse<IBlogDetails[]>>('getAllBlogApi', async () => {
  return publicRequest('/blogs')
})
export const getBlogApi = toQueryFetcher<string, TServerResponse<IBlogDetails>>('getBlogApi', async (blogId) => {
  return privateRequest(`/blogs/get-by-id/${blogId}`)
})

export const getBlogByTagApi = toQueryFetcher<string, TServerResponse<IBlogDetails>>('getBlogByTagApi', async (tag) => {
  return publicRequest(`/blogs/tag/${tag}`)
})

export const createBlogApi = toMutationFetcher<IServerCreateBlog, TServerResponse<IServerCreateBlog>>(
  'createBlogApi',
  async (data) => {
    return privateRequest('/blogs', {
      method: 'POST',
      data,
    })
  },
)
export const getFilteredBlogs = toQueryFetcher<
  TGetFilteredBlogRequestParams,
  TServerResponseWithPagination<IBlogDetails[]>
>('getFilteredBlogs', async (filterData) => {
  const { page, limit, sortBy, order, statuses, types, title } = filterData || {}

  return publicRequest('/blogs/filter-blogs', {
    method: 'GET',
    params: {
      page,
      limit,
      sortBy,
      order,
      statuses,
      types,
      title,
    },
  })
})

export const updateBlogApi = toMutationFetcher<UpdateBlogParams, TServerResponse<IServerCreateBlog>>(
  'updateBlogApi',
  async ({ id, data }: UpdateBlogParams) => {
    return privateRequest(`/blogs/${id}`, {
      method: 'PUT',
      data,
    })
  },
)
